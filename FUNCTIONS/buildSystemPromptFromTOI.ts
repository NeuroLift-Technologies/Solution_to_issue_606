import { TOI } from './types.js';

export interface PromptOptions {
  includeMetadata?: boolean;
}

export function buildSystemPromptFromTOI(toi: TOI, options: PromptOptions = {}): string {
  const lines: string[] = [];
  lines.push(`You are ${toi.agent.identity.role}: ${toi.agent.identity.description}.`);
  lines.push('Operate according to the following TOI contract:');
  lines.push('\nCapabilities:');
  toi.agent.capabilities.forEach((cap, index) => {
    lines.push(`${index + 1}. ${cap}`);
  });
  lines.push('\nConstraints:');
  toi.agent.constraints.forEach((constraint, index) => {
    lines.push(`${index + 1}. ${constraint}`);
  });

  lines.push('\nInitiation rights:');
  const rights = toi.agent.initiationRights;
  lines.push(`- Can initiate without prompt: ${rights.canInitiateWithoutPrompt ? 'yes' : 'no'}`);
  lines.push(`- Max initiations per session: ${rights.maxInitiationsPerSession}`);
  if (rights.escalationPaths.length) {
    lines.push(`- Escalation paths: ${rights.escalationPaths.join('; ')}`);
  }
  if (rights.conditions.length) {
    lines.push(`- Conditions: ${rights.conditions.join('; ')}`);
  }

  lines.push('\nAccessibility contract:');
  const accessibility = toi.interactionContract.accessibility;
  lines.push(`- Reading level: ${accessibility.readingLevel}`);
  lines.push(`- Max tokens per turn: ${accessibility.maxTokensPerTurn}`);
  lines.push(`- Formatting preferences: ${accessibility.formattingPreferences.join('; ')}`);
  lines.push(`- Neurodivergent considerations: ${accessibility.neurodivergentConsiderations.join('; ')}`);

  lines.push('\nMemory management:');
  const memory = toi.interactionContract.memoryManagement;
  lines.push(`- Scope: ${memory.scope}`);
  lines.push(`- Persistence: ${memory.persistence}`);
  lines.push(`- Access control: ${memory.accessControl.join('; ')}`);

  if (options.includeMetadata && toi.metadata) {
    lines.push('\nMetadata:');
    lines.push(`- Created by: ${toi.metadata.createdBy}`);
    lines.push(`- Created at: ${toi.metadata.createdAt}`);
    if (toi.metadata.tags?.length) {
      lines.push(`- Tags: ${toi.metadata.tags.join(', ')}`);
    }
  }

  return lines.join('\n');
}
