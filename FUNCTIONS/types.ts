// Types aligned with @neurolift-technologies/toi v1.0.0 standard schema.
// When the package's dist/ artifacts are published, these can be replaced with
// direct re-exports from the package.

export type ToiTier = 'personal' | 'community' | 'project';

export interface ToiIdentity {
  author: string;
  handle?: string;
  organization?: string;
  pronouns?: string;
}

export interface ToiCommunication {
  tone?: 'formal' | 'casual' | 'professional' | 'friendly' | 'direct' | 'adaptive';
  verbosity?: 'minimal' | 'concise' | 'detailed' | 'comprehensive' | 'adaptive';
  structure?: 'linear' | 'hierarchical' | 'visual' | 'bullet-points' | 'narrative';
  language?: string;
  jargon_tolerance?: 'none' | 'low' | 'moderate' | 'high';
  pattern_highlighting?: boolean;
  summary_on_return?: boolean;
  thread_reconnection?: 'none' | 'brief-summary' | 'full-context';
}

export interface ToiAgency {
  task_initiation?: 'user-initiated' | 'ai-may-suggest' | 'ai-may-initiate';
  ai_suggestions?: 'none' | 'on-request' | 'proactive';
  interruptibility?: 'never' | 'urgent-only' | 'always';
  action_confirmation?: 'always' | 'destructive-only' | 'never';
  override_authority?: 'user-final' | 'shared' | 'ai-advisory';
}

export interface ToiPrivacy {
  retention?: 'session-only' | 'short-term' | 'long-term' | 'permanent' | 'user-controlled';
  cross_platform_sharing?: 'never' | 'explicit-only' | 'aggregate-only' | 'research-approved';
  training_use?: 'prohibited' | 'explicit-only' | 'anonymized-only' | 'permitted';
  analytics?: 'prohibited' | 'opt-in' | 'anonymized-only' | 'permitted';
}

/** Agent-specific data carried in the TOI custom section. */
export interface AgentToiCustom {
  role?: string;
  description?: string;
  capabilities?: Array<{ name: string; description: string; enabled: boolean }>;
  constraints?: Array<{ rule: string; rationale: string }>;
  escalationPaths?: string[];
  conditions?: string[];
  allowProactiveMessages?: boolean;
  requiresHumanApproval?: boolean;
  readingLevel?: string;
  maxTokensPerTurn?: number;
  formattingPreferences?: string[];
  preferredMedia?: string[];
  neurodivergentSupportNotes?: string;
  memoryScope?: string;
  memoryPersistence?: string;
  memoryAccessControl?: string[];
  [key: string]: unknown;
}

/** A parsed @neurolift-technologies/toi v1.0.0 document. */
export interface ToiDocument {
  $toi: string;
  $tier: ToiTier;
  $created?: string;
  $updated?: string;
  $id?: string;
  $license?: string;
  identity: ToiIdentity;
  cognitive_profile?: Record<string, unknown>;
  privacy?: ToiPrivacy;
  agency?: ToiAgency;
  communication?: ToiCommunication;
  ethical_pillars?: string[];
  custom?: Record<string, unknown>;
  [key: string]: unknown;
}

/** ToiDocument extended with a typed agent custom section. */
export type TOI = ToiDocument & { custom?: AgentToiCustom };

export interface ValidationError {
  message: string;
  instancePath?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}
