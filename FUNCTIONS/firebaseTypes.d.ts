export interface AgentDocument {
  id: string;
  role: string;
  toiStatus?: 'pending' | 'validated' | 'invalid';
  toiRef?: string;
  toi?: unknown;
  [key: string]: unknown;
}

export interface SessionAgentContext {
  sessionId: string;
  agentId: string;
  data: AgentDocument;
}

export interface FirestoreLike {
  getAgent(sessionId: string, agentId: string): Promise<AgentDocument | null>;
  updateAgent(sessionId: string, agentId: string, data: Partial<AgentDocument>): Promise<void>;
}
