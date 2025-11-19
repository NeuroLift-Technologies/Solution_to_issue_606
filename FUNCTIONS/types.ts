export interface InitiationRights {
  canInitiateWithoutPrompt: boolean;
  maxInitiationsPerSession: number;
  escalationPaths: string[];
  conditions: string[];
}

export interface AccessibilityContract {
  readingLevel: 'elementary' | 'middle' | 'high_school' | 'college';
  maxTokensPerTurn: number;
  formattingPreferences: string[];
  neurodivergentConsiderations: string[];
}

export interface MemoryManagementContract {
  scope: 'session' | 'participant' | 'global';
  persistence: 'ephemeral' | 'durable';
  accessControl: string[];
}

export interface InteractionContract {
  accessibility: AccessibilityContract;
  memoryManagement: MemoryManagementContract;
}

export interface AgentProfile {
  identity: {
    role: string;
    description: string;
  };
  capabilities: string[];
  constraints: string[];
  initiationRights: InitiationRights;
}

export interface TOI {
  toiVersion: string;
  agent: AgentProfile;
  interactionContract: InteractionContract;
  metadata?: {
    createdBy: string;
    createdAt: string;
    tags?: string[];
  };
}

export interface ValidationErrorDetail {
  instancePath: string;
  schemaPath: string;
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationErrorDetail[];
}
