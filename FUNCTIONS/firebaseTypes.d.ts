export interface FirestoreEventContext {
  timestamp: string;
  eventId: string;
  params: Record<string, string>;
}

export interface FirestoreDocument<T> {
  id: string;
  data(): T;
  ref: {
    set(data: Partial<T>, options?: { merge?: boolean }): Promise<void>;
    update(data: Partial<T>): Promise<void>;
  };
}

export type FirestoreTrigger<T> = (snapshot: FirestoreDocument<T>, context: FirestoreEventContext) => Promise<void>;
