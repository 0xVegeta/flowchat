import { create } from 'zustand';
import { type Message } from '@/lib/db';

interface ExecutionState {
  sessionId: string | null;
  activeNodeId: string | null;
  messages: Message[];
  isProcessing: boolean;
  isWaitingForInput: boolean;
  variables: Record<string, any>;
  
  setSessionId: (sessionId: string | null) => void;
  setActiveNodeId: (id: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setIsWaitingForInput: (waiting: boolean) => void;
  updateVariable: (key: string, value: any) => void;
  resetExecution: () => void;
  getMessagesForNode: (nodeId: string, edges: any[]) => Message[];
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  sessionId: null,
  activeNodeId: null,
  messages: [],
  isProcessing: false,
  isWaitingForInput: false,
  variables: {},
  
  setSessionId: (sessionId) => set({ sessionId }),
  setActiveNodeId: (activeNodeId) => set({ activeNodeId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setIsWaitingForInput: (isWaitingForInput) => set({ isWaitingForInput }),
  updateVariable: (key, value) =>
    set((state) => ({
      variables: { ...state.variables, [key]: value },
    })),
  resetExecution: () =>
    set({
      sessionId: null,
      activeNodeId: null,
      messages: [],
      isProcessing: false,
      isWaitingForInput: false,
      variables: {},
    }),
  getMessagesForNode: (nodeId, edges) => {
    const { messages } = get();
    const ancestorIds = new Set<string>();
    const queue = [nodeId];
    
    // Simple BFS to find all ancestor nodes
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (ancestorIds.has(currentId)) continue;
      ancestorIds.add(currentId);
      
      const incomingEdges = edges.filter(e => e.target === currentId);
      for (const edge of incomingEdges) {
        queue.push(edge.source);
      }
    }

    return messages
      .filter(m => ancestorIds.has(m.nodeId))
      .sort((a, b) => a.timestamp - b.timestamp);
  },
}));
