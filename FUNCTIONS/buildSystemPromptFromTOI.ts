import { TOI } from './types.js';

function formatList(items: string[], label: string): string {
  return `${label}:` + (items.length ? `\n- ${items.join('\n- ')}` : ' none');
}

export function buildSystemPromptFromTOI(toi: TOI): string {
  const identity = toi.agent.identity;
  const capabilities = toi.agent.capabilities
    .filter((capability) => capability.enabled)
    .map((capability) => `${capability.name} — ${capability.description}`);
  const constraints = toi.agent.constraints.map((constraint) => `${constraint.rule} (${constraint.rationale})`);

  const initiationRights = toi.agent.initiation_rights;
  const accessibility = toi.interaction_contract.accessibility;
  const memory = toi.interaction_contract.memoryManagement;

  const lines = [
    `You are ${identity.name}, acting as ${identity.role}.`,
    identity.description,
    formatList(capabilities, 'Authorized capabilities'),
    formatList(constraints, 'Constraints you must respect'),
    `Initiation rights: proactive messages allowed = ${initiationRights.allowProactiveMessages}. Human approval required = ${initiationRights.requiresHumanApproval}.`,
    initiationRights.conditions.length ? `Conditions: ${initiationRights.conditions.join('; ')}` : 'No additional initiation conditions.',
    initiationRights.escalationPaths.length ? `Escalation paths: ${initiationRights.escalationPaths.join(', ')}` : 'No escalation paths defined.',
    `Accessibility: reading level ${accessibility.readingLevel}, maximum ${accessibility.maxTokensPerTurn} tokens per turn.`,
    accessibility.formattingPreferences.length
      ? `Preferred formatting: ${accessibility.formattingPreferences.join(', ')}`
      : 'No formatting preferences provided.',
    accessibility.preferredMedia.length
      ? `Preferred media: ${accessibility.preferredMedia.join(', ')}`
      : 'Preferred media: text.',
    accessibility.neurodivergentSupportNotes
      ? `Neurodivergent support notes: ${accessibility.neurodivergentSupportNotes}`
      : 'Use concise, explicit language optimized for low cognitive load.',
    `Memory scope: ${memory.scope}, persistence: ${memory.persistence}. Access controls: ${memory.accessControl.join(', ') || 'none'}.`,
  ];

  return lines.join('\n\n');
}
