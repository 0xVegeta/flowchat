import { create } from 'zustand';
import { type Message } from '@/lib/db';

interface ExecutionState {
  sessionId: string | null;
  messages: Message[];
  isProcessing: boolean;
  variables: Record<string, any>;
  setSessionId: (sessionId: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  updateVariable: (key: string, value: any) => void;
  resetExecution: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  sessionId: null,
  messages: [],
  isProcessing: false,
  variables: {},
  setSessionId: (sessionId) => set({ sessionId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  updateVariable: (key, value) =>
    set((state) => ({
      variables: { ...state.variables, [key]: value },
    })),
  resetExecution: () =>
    set({
      sessionId: null,
      messages: [],
      isProcessing: false,
      variables: {},
    }),
}));
