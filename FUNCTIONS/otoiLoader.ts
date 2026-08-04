import type { TOI } from './types.js';
import { loadTOIForRole } from './loadTOI.js';
import { validateTOI } from './validateTOI.js';
import { KNOWN_ROLES, REQUIRED_ROLES, SINGULAR_ROLES } from './roleRegistry.js';

export interface OtoiAgentJoin {
  agentId: string;
  role: string;
}

export interface LoadOtoiOptions {
  logger?: (message: string) => void;
}

export interface OtoiParticipant {
  agent_id: string;
  role: string;
  toi: TOI;
}

export interface OtoiRule {
  appliesTo: string[];
  description: string;
  enforcement: string;
}

export interface OtoiSession {
  otoi_version: string;
  session_id: string;
  created: string;
  participants: OtoiParticipant[];
  rules: OtoiRule[];
}

export interface OtoiLoadResult {
  valid: boolean;
  otoi?: OtoiSession;
  errors?: string[];
}

/** Normalizes an escalation reference to a plain role token (e.g. '/debate_moderator' -> 'debate_moderator'). */
function normalizeRoleRef(ref: string): string {
  const lastSegment = ref.split('/').filter(Boolean).pop() ?? '';
  return lastSegment.replace(/-/g, '_');
}

/**
 * Resolves an escalation reference to a known session role, if any.
 * References that do not map to a known role are treated as external escalation targets.
 */
function resolveRoleRef(ref: string): string | undefined {
  const segment = normalizeRoleRef(ref);
  return KNOWN_ROLES.find(
    (role) => role === segment || role.endsWith(`_${segment}`) || role.startsWith(`${segment}_`),
  );
}

function escalationPathsFor(toi: TOI): string[] {
  const custom = toi.custom as { escalationPaths?: unknown } | undefined;
  return Array.isArray(custom?.escalationPaths)
    ? (custom.escalationPaths as string[]).filter((path): path is string => typeof path === 'string')
    : [];
}

/**
 * Enforces cross-agent rules against a set of validated participants and returns the
 * session rules plus any violations. A non-empty `errors` array means the session
 * configuration is invalid.
 */
export function enforceCrossAgentRules(participants: OtoiParticipant[]): { rules: OtoiRule[]; errors: string[] } {
  const errors: string[] = [];
  const rules: OtoiRule[] = [];

  const roles = participants.map((participant) => participant.role);
  const presentRoles = new Set(roles);

  const knownRoles = KNOWN_ROLES.filter((role) => roles.includes(role));
  if (knownRoles.length !== roles.length) {
    const unknownRoles = [...new Set(roles.filter((role) => !KNOWN_ROLES.includes(role)))];
    errors.push(`Unknown role(s) in session: ${unknownRoles.join(', ')}`);
  }
  rules.push({
    appliesTo: ['*'],
    description: 'Every agent role must be a known role.',
    enforcement: 'Reject sessions containing unknown roles',
  });

  for (const role of SINGULAR_ROLES) {
    const count = roles.filter((candidate) => candidate === role).length;
    if (count > 1) {
      errors.push(`Role '${role}' may appear at most once per session (found ${count}).`);
    }
  }
  rules.push({
    appliesTo: [...SINGULAR_ROLES],
    description: 'Singular orchestration roles must be unique within a session.',
    enforcement: 'At most one agent per singular role',
  });

  for (const role of REQUIRED_ROLES) {
    if (!presentRoles.has(role)) {
      errors.push(`Session requires at least one agent with role '${role}'.`);
    }
  }
  rules.push({
    appliesTo: [...REQUIRED_ROLES],
    description: 'Core participation roles must be present.',
    enforcement: 'At least one agent with each required role',
  });

  for (const participant of participants) {
    for (const ref of escalationPathsFor(participant.toi)) {
      if (!ref.startsWith('/')) {
        continue;
      }
      const resolved = resolveRoleRef(ref);
      if (resolved && !presentRoles.has(resolved)) {
        errors.push(
          `Agent '${participant.agent_id}' (${participant.role}) escalates to '${resolved}' but no such role is present in the session.`,
        );
      }
    }
  }
  rules.push({
    appliesTo: ['*'],
    description: 'Internal escalation paths must resolve to a role present in the session.',
    enforcement: 'Reject escalation references to absent in-session roles',
  });

  return { rules, errors };
}

export async function loadOtoiForSession(
  sessionId: string,
  agents: OtoiAgentJoin[],
  options: LoadOtoiOptions = {},
): Promise<OtoiLoadResult> {
  const { logger } = options;
  logger?.(`Loading OTOI for session ${sessionId} with ${agents.length} agents`);

  const participants: OtoiParticipant[] = [];
  for (const agent of agents) {
    let toi: TOI;
    try {
      toi = await loadTOIForRole(agent.role);
    } catch (error) {
      const message = (error as Error).message;
      logger?.(`Failed to load TOI for role ${agent.role}: ${message}`);
      return { valid: false, errors: [`Failed to load TOI for role '${agent.role}': ${message}`] };
    }

    const validation = await validateTOI(toi);
    if (!validation.valid) {
      const detail = validation.errors?.map((err) => `${err.instancePath ?? '/'} ${err.message}`).join('; ') ?? 'unknown error';
      logger?.(`TOI validation failed for agent ${agent.agentId} (${agent.role})`);
      return {
        valid: false,
        errors: [`TOI validation failed for agent '${agent.agentId}' (${agent.role}): ${detail}`],
      };
    }
    participants.push({ agent_id: agent.agentId, role: agent.role, toi });
  }

  const { rules, errors } = enforceCrossAgentRules(participants);
  if (errors.length > 0) {
    logger?.(`Cross-agent enforcement failed for session ${sessionId}`);
    return { valid: false, errors };
  }

  const otoi: OtoiSession = {
    otoi_version: '1.0.0',
    session_id: sessionId,
    created: new Date().toISOString(),
    participants,
    rules,
  };
  logger?.(`OTOI built for session ${sessionId}: ${participants.length} participants, ${rules.length} rules`);
  return { valid: true, otoi };
}
