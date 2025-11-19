import { FirestoreLike, AgentDocument } from './firebaseTypes.js';
import { TOI, ValidationResult } from './types.js';
import { validateTOI } from './validateTOI.js';

export interface AttachTOIDependencies {
  firestore: FirestoreLike;
  loadTOI(role: string): Promise<TOI | null>;
  logger?: Pick<Console, 'info' | 'error'>;
}

export interface AttachResult {
  updatedAgent?: AgentDocument;
  validation: ValidationResult;
}

export async function attachTOIOnAgentJoin(
  sessionId: string,
  agentId: string,
  deps: AttachTOIDependencies
): Promise<AttachResult> {
  const { firestore, loadTOI, logger = console } = deps;
  const agent = await firestore.getAgent(sessionId, agentId);
  if (!agent) {
    throw new Error(`Agent ${agentId} in session ${sessionId} was not found.`);
  }

  logger.info?.(`Attaching TOI for agent ${agentId} (role: ${agent.role})`);
  const toi = await loadTOI(agent.role);
  if (!toi) {
    await firestore.updateAgent(sessionId, agentId, {
      toiStatus: 'invalid',
    });
    const validation: ValidationResult = {
      valid: false,
      errors: [
        {
          instancePath: '',
          schemaPath: '',
          message: `No TOI configured for role ${agent.role}`,
        },
      ],
    };
    return { validation };
  }

  const validation = validateTOI(toi);
  if (!validation.valid) {
    await firestore.updateAgent(sessionId, agentId, {
      toiStatus: 'invalid',
      toiRef: agent.role,
    });
    return { validation };
  }

  const updatedAgent: AgentDocument = {
    ...agent,
    toi,
    toiStatus: 'validated',
    toiRef: agent.role,
  };
  await firestore.updateAgent(sessionId, agentId, {
    toi: updatedAgent.toi,
    toiStatus: updatedAgent.toiStatus,
    toiRef: updatedAgent.toiRef,
  });

  return { updatedAgent, validation };
}
