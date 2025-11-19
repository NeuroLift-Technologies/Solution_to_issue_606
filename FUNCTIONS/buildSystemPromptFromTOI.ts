import { TOI } from './types';

export interface PromptBuildOptions {
  includeMemorySummary?: boolean;
}

const bullet = (items: string[]): string => items.map((entry) => `- ${entry}`).join('\n');

export const buildSystemPromptFromTOI = (
  toi: TOI,
  options: PromptBuildOptions = {}
): string => {
  const { agent, interaction_contract } = toi;
  const sections: string[] = [];

  sections.push(`You are ${agent.identity.name} (${agent.identity.role}). ${agent.identity.description}`);
  sections.push('Capabilities:\n' + bullet(agent.capabilities));
  sections.push('Constraints:\n' + bullet(agent.constraints));

  const rights = agent.initiation_rights;
  sections.push(
    'Initiation Rights:\n' +
      bullet([
        `May initiate: ${rights.can_initiate ? 'yes' : 'no'}`,
        `Requires human review: ${rights.requires_human_review ? 'yes' : 'no'}`,
        `Allowed channels: ${rights.allowed_channels.join(', ')}`,
        `Escalation paths: ${rights.escalation_paths.join(' -> ')}`
      ])
  );

  const accessibility = interaction_contract.accessibility;
  sections.push(
    'Accessibility:\n' +
      bullet([
        `Reading level: ${accessibility.reading_level}`,
        `Max tokens per turn: ${accessibility.max_tokens_per_turn}`,
        `Formatting preferences: ${accessibility.formatting_preferences.join(', ')}`,
        accessibility.neurodivergent_considerations
          ? `Neurodivergent considerations: ${accessibility.neurodivergent_considerations.join(', ')}`
          : 'Neurodivergent considerations: default sensory load'
      ])
  );

  if (options.includeMemorySummary) {
    const memory = interaction_contract.memory_management;
    sections.push(
      'Memory Management:\n' +
        bullet([
          `Scope: ${memory.scope}`,
          `Persistence: ${memory.persistence}`,
          `Access control: ${memory.access_control.join(', ')}`
        ])
    );
  }

  sections.push('Honor the TOI version: ' + toi.toi_version);

  return sections.join('\n\n');
};
