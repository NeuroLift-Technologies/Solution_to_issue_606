import type { TOI } from './types.js';

function formatList(items: string[], label: string): string {
  return `${label}:` + (items.length ? `\n- ${items.join('\n- ')}` : ' none');
}

export function buildSystemPromptFromTOI(toi: TOI): string {
  const custom = toi.custom ?? {};

  const name = toi.identity.author;
  const role = (custom.role as string | undefined) ?? 'agent';
  const description = (custom.description as string | undefined) ?? '';

  const capabilities = (custom.capabilities as Array<{ name: string; description: string; enabled: boolean }> | undefined) ?? [];
  const enabledCapabilities = capabilities.filter((c) => c.enabled).map((c) => `${c.name} — ${c.description}`);

  const constraints = (custom.constraints as Array<{ rule: string; rationale: string }> | undefined) ?? [];
  const constraintList = constraints.map((c) => `${c.rule} (${c.rationale})`);

  const allowProactive = custom.allowProactiveMessages ?? (toi.agency?.task_initiation === 'ai-may-initiate');
  const requiresApproval = custom.requiresHumanApproval ?? (toi.agency?.action_confirmation === 'always');
  const escalationPaths = (custom.escalationPaths as string[] | undefined) ?? [];
  const conditions = (custom.conditions as string[] | undefined) ?? [];

  const readingLevel = (custom.readingLevel as string | undefined) ?? '';
  const maxTokens = (custom.maxTokensPerTurn as number | undefined) ?? 0;
  const formattingPrefs = (custom.formattingPreferences as string[] | undefined) ?? [];
  const preferredMedia = (custom.preferredMedia as string[] | undefined) ?? [];
  const ndNotes = (custom.neurodivergentSupportNotes as string | undefined) ?? '';

  const memoryScope = (custom.memoryScope as string | undefined) ?? '';
  const memoryPersistence = (custom.memoryPersistence as string | undefined) ?? '';
  const memoryAccess = (custom.memoryAccessControl as string[] | undefined) ?? [];

  const lines = [
    `You are ${name}, acting as ${role}.`,
    description,
    formatList(enabledCapabilities, 'Authorized capabilities'),
    formatList(constraintList, 'Constraints you must respect'),
    `Initiation rights: proactive messages allowed = ${allowProactive}. Human approval required = ${requiresApproval}.`,
    conditions.length ? `Conditions: ${conditions.join('; ')}` : 'No additional initiation conditions.',
    escalationPaths.length ? `Escalation paths: ${escalationPaths.join(', ')}` : 'No escalation paths defined.',
    readingLevel ? `Accessibility: reading level ${readingLevel}, maximum ${maxTokens} tokens per turn.` : '',
    formattingPrefs.length ? `Preferred formatting: ${formattingPrefs.join(', ')}` : 'No formatting preferences provided.',
    preferredMedia.length ? `Preferred media: ${preferredMedia.join(', ')}` : 'Preferred media: text.',
    ndNotes ? `Neurodivergent support notes: ${ndNotes}` : 'Use concise, explicit language optimized for low cognitive load.',
    memoryScope ? `Memory scope: ${memoryScope}, persistence: ${memoryPersistence}. Access controls: ${memoryAccess.join(', ') || 'none'}.` : '',
  ].filter(Boolean);

  return lines.join('\n\n');
}
