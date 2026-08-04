export const roleToFileMap: Record<string, string> = {
  debate_moderator: 'debate_moderator.v1.json',
  participant: 'participant.v1.json',
  observer: 'observer.v1.json',
  facilitator: 'facilitator.v1.json',
  neurodivergent_support: 'neurodivergent_support.v1.json',
};

export const KNOWN_ROLES = Object.keys(roleToFileMap);

/** Roles that may appear at most once per session. */
export const SINGULAR_ROLES: ReadonlySet<string> = new Set([
  'debate_moderator',
  'facilitator',
  'neurodivergent_support',
]);

/** Roles that must be present at least once in a valid session. */
export const REQUIRED_ROLES: string[] = ['participant'];
