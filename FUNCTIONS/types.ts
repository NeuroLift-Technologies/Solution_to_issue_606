export interface InitiationRights {
  allowProactiveMessages: boolean;
  requiresHumanApproval: boolean;
  escalationPaths: string[];
  conditions: string[];
}

export interface AccessibilityPreferences {
  readingLevel: 'kid' | 'teen' | 'adult' | 'expert';
  maxTokensPerTurn: number;
  formattingPreferences: string[];
  preferredMedia: ('text' | 'audio' | 'visual')[];
  neurodivergentSupportNotes?: string;
}

export interface MemoryManagement {
  scope: 'session' | 'experiment' | 'global';
  persistence: 'volatile' | 'ephemeral' | 'persistent';
  accessControl: string[];
}

export interface AgentIdentity {
  name: string;
  description: string;
  role: string;
}

export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
}

export interface AgentConstraint {
  rule: string;
  rationale: string;
}

export interface InteractionContract {
  accessibility: AccessibilityPreferences;
  memoryManagement: MemoryManagement;
}

export interface TOI {
  toi_version: string;
  agent: {
    identity: AgentIdentity;
    capabilities: AgentCapability[];
    constraints: AgentConstraint[];
    initiation_rights: InitiationRights;
  };
  interaction_contract: InteractionContract;
}

export interface CrossAgentRule {
  appliesTo: string[];
  description: string;
  enforcement: string;
}

export interface OTOI {
  otoi_version: string;
  session_id: string;
  participants: string[];
  rules: CrossAgentRule[];
}

export interface ValidationError {
  message: string;
  instancePath?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}
