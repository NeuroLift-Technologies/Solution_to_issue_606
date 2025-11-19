export interface InitiationRights {
  can_initiate: boolean;
  requires_human_review: boolean;
  allowed_channels: string[];
  escalation_paths: string[];
}

export interface AccessibilityPreferences {
  reading_level: string;
  max_tokens_per_turn: number;
  formatting_preferences: string[];
  neurodivergent_considerations?: string[];
}

export interface MemoryManagement {
  scope: 'session' | 'participant' | 'global';
  persistence: 'ephemeral' | 'short_term' | 'long_term';
  access_control: string[];
}

export interface InteractionContract {
  accessibility: AccessibilityPreferences;
  memory_management: MemoryManagement;
}

export interface AgentIdentity {
  name: string;
  role: string;
  description: string;
}

export interface AgentDefinition {
  identity: AgentIdentity;
  capabilities: string[];
  constraints: string[];
  initiation_rights: InitiationRights;
}

export interface TOI {
  toi_version: string;
  agent: AgentDefinition;
  interaction_contract: InteractionContract;
}

export interface SessionRelationship {
  session_id: string;
  agents: Array<{
    agent_id: string;
    role: string;
    toi_ref: string;
  }>;
  governance_rules: string[];
}

export interface OTOI {
  otoi_version: string;
  relationships: SessionRelationship[];
}

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
