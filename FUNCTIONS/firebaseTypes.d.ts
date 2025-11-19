export interface AgentDocument {
  role: string;
  toi_status?: 'pending' | 'validated' | 'invalid';
  toi_payload?: unknown;
  [key: string]: unknown;
}

export interface DocumentReference<T> {
  id: string;
  update(data: Partial<T>): Promise<void>;
}

export interface AgentSnapshot<T> {
  data(): T;
  ref: DocumentReference<T>;
}

export interface EventContext {
  params: Record<string, string>;
}

export interface AgentJoinEvent<T> {
  data: () => AgentSnapshot<T>;
  context: EventContext;
}
