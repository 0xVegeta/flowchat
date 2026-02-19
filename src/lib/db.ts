import Dexie, { type EntityTable } from 'dexie';

interface Flow {
  id: string;
  name: string;
  nodes: any[]; // Using any for now, will refine with Zod schemas later
  edges: any[];
  createdAt: number;
  updatedAt: number;
}

interface Session {
  id: string;
  flowId: string;
  status: 'active' | 'completed' | 'archived';
  currentVariables: Record<string, any>;
  createdAt: number;
}

interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  nodeId: string; // The node that generated this message
  timestamp: number;
}

interface Setting {
  key: string;
  value: string;
}

const db = new Dexie('FlowChatDatabase') as Dexie & {
  flows: EntityTable<Flow, 'id'>;
  sessions: EntityTable<Session, 'id'>;
  messages: EntityTable<Message, 'id'>;
  settings: EntityTable<Setting, 'key'>;
};

// Schema definition
db.version(1).stores({
  flows: 'id, name, updatedAt',      // Indexed by id, name, and updatedAt
  sessions: 'id, flowId, createdAt', // Indexed by id, flowId, and createdAt
  messages: 'id, sessionId, timestamp', // Indexed by id, sessionId, and timestamp
  settings: 'key'                    // Indexed by key
});

export { db };
export type { Flow, Session, Message, Setting };
