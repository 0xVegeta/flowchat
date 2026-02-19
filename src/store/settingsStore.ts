import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  apiKey: string | null;
  theme: 'light' | 'dark' | 'system';
  setApiKey: (key: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: null,
      theme: 'system',
      setApiKey: (apiKey) => set({ apiKey }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'flowchat-settings', // unique name for localStorage
    }
  )
);
