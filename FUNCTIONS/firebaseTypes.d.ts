import { TOI } from './types.js';

export interface AgentJoinPayload {
  sessionId: string;
  agentId: string;
  role: string;
}

export interface AgentRecord {
  role: string;
  toi?: TOI;
  toi_status?: 'validated' | 'invalid';
  toi_errors?: string[];
}

export interface AgentStore {
  updateAgent(sessionId: string, agentId: string, data: Partial<AgentRecord>): Promise<void>;
}
