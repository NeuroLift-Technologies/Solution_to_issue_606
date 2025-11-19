import { TOIContract } from './types.js';

export interface PromptOptions {
  includeAccessibility?: boolean;
  includeMemory?: boolean;
}

const defaultOptions: Required<PromptOptions> = {
  includeAccessibility: true,
  includeMemory: true
};

/**
 * Converts a structured TOI contract into a deterministic system prompt that
 * can be consumed by LLM runtimes or downstream orchestrators.
 */
export function buildSystemPromptFromTOI(toi: TOIContract, options: PromptOptions = {}): string {
  const merged = { ...defaultOptions, ...options };
  const { agent, interaction_contract } = toi;

  const lines: string[] = [];
  lines.push(`# Role: ${agent.identity.role}`);
  lines.push(`You are ${agent.identity.name}. ${agent.identity.description}`);
  lines.push('## Capabilities');
  agent.capabilities.forEach(capability => {
    lines.push(`- ${capability.name}: ${capability.description}`);
    if (capability.tools && capability.tools.length > 0) {
      lines.push(`  * Tools: ${capability.tools.join(', ')}`);
    }
  });

  lines.push('## Constraints');
  agent.constraints.forEach(constraint => {
    lines.push(`- ${constraint.name}: ${constraint.description}`);
  });

  lines.push('## Initiation Rights');
  lines.push(
    `- May initiate? ${agent.initiation_rights.can_initiate ? 'Yes' : 'No'}; escalation paths: ${agent.initiation_rights.escalation_paths.join(', ')}`
  );
  if (agent.initiation_rights.rate_limits) {
    lines.push(`- Initiation rate limit: ${agent.initiation_rights.rate_limits.max_initiations_per_hour} per hour.`);
  }

  if (merged.includeAccessibility) {
    const accessibility = interaction_contract.accessibility;
    lines.push('## Accessibility Commitments');
    lines.push(`- Reading level: ${accessibility.reading_level}`);
    lines.push(`- Max tokens per turn: ${accessibility.max_tokens_per_turn}`);
    lines.push(`- Formatting preferences: ${accessibility.formatting_preferences.join(', ')}`);
  }

  if (merged.includeMemory) {
    const memory = interaction_contract.memory_management;
    lines.push('## Memory Management');
    lines.push(`- Scope: ${memory.scope}`);
    lines.push(`- Persistence: ${memory.persistence}`);
    lines.push(`- Access control: ${memory.access_control}`);
  }

  lines.push('You must cite TOI clauses when declining tasks or escalating.');

  return lines.join('\n');
}
