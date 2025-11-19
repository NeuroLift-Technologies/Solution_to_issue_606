/**
 * Shared TypeScript interfaces that describe the structure of a TOI contract
 * and how it participates in an OTOI governance network.
 */

export interface Capability {
  name: string;
  description: string;
  tools?: string[];
}

export interface Constraint {
  name: string;
  description: string;
}

export interface InitiationRights {
  can_initiate: boolean;
  escalation_paths: string[];
  rate_limits?: {
    max_initiations_per_hour: number;
  };
}

export interface AccessibilityContract {
  reading_level: 'elementary' | 'middle_school' | 'high_school' | 'college';
  max_tokens_per_turn: number;
  formatting_preferences: string[];
}

export interface MemoryManagementContract {
  scope: 'session' | 'experiment' | 'global';
  persistence: 'transient' | 'durable';
  access_control: string;
}

export interface InteractionContract {
  accessibility: AccessibilityContract;
  memory_management: MemoryManagementContract;
}

export interface AgentIdentity {
  name: string;
  description: string;
  role: string;
}

export interface TOIContract {
  toi_version: string;
  agent: {
    identity: AgentIdentity;
    capabilities: Capability[];
    constraints: Constraint[];
    initiation_rights: InitiationRights;
  };
  interaction_contract: InteractionContract;
}

export interface OTOILink {
  role: string;
  depends_on: string[];
  escalation_contact: string;
}

export interface OTOINetwork {
  session_id: string;
  revision: string;
  participants: OTOILink[];
}

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
}
