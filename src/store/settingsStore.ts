import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const PROVIDERS = [
  { id: 'openai',     label: 'OpenAI',       defaultModel: 'gpt-4o' },
  { id: 'anthropic',  label: 'Anthropic',    defaultModel: 'claude-sonnet-4-20250514' },
  { id: 'google',     label: 'Google',       defaultModel: 'gemini-2.5-flash' },
  { id: 'xai',        label: 'xAI (Grok)',   defaultModel: 'grok-3' },
  { id: 'groq',       label: 'Groq',         defaultModel: 'llama-3.3-70b-versatile' },
  { id: 'mistral',    label: 'Mistral',      defaultModel: 'mistral-large-latest' },
  { id: 'deepseek',   label: 'DeepSeek',     defaultModel: 'deepseek-chat' },
  { id: 'perplexity', label: 'Perplexity',   defaultModel: 'sonar-pro' },
  { id: 'cohere',     label: 'Cohere',       defaultModel: 'command-r-plus' },
  { id: 'fireworks',  label: 'Fireworks',    defaultModel: 'accounts/fireworks/models/llama-v3p1-70b-instruct' },
  { id: 'togetherai', label: 'Together.ai',  defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo' },
  { id: 'cerebras',   label: 'Cerebras',     defaultModel: 'llama3.1-70b' },
  { id: 'deepinfra',  label: 'DeepInfra',    defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct' },
] as const;

export type ProviderId = (typeof PROVIDERS)[number]['id'];

interface SettingsState {
  // Active provider being used
  activeProvider: ProviderId;
  // Active model for the current provider
  activeModel: string;
  // API keys stored per-provider  { openai: "sk-...", anthropic: "sk-ant-..." }
  apiKeys: Partial<Record<ProviderId, string>>;
  // Theme
  theme: 'light' | 'dark' | 'system';

  // Actions
  setActiveProvider: (provider: ProviderId) => void;
  setActiveModel: (model: string) => void;
  setApiKey: (provider: ProviderId, key: string) => void;
  removeApiKey: (provider: ProviderId) => void;
  getApiKey: (provider?: ProviderId) => string | undefined;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      activeProvider: 'openai',
      activeModel: 'gpt-4o',
      apiKeys: {},
      theme: 'system',

      setActiveProvider: (provider) => {
        const providerConfig = PROVIDERS.find((p) => p.id === provider);
        set({
          activeProvider: provider,
          activeModel: providerConfig?.defaultModel ?? '',
        });
      },

      setActiveModel: (model) => set({ activeModel: model }),

      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),

      removeApiKey: (provider) =>
        set((state) => {
          const next = { ...state.apiKeys };
          delete next[provider];
          return { apiKeys: next };
        }),

      getApiKey: (provider) => {
        const state = get();
        return state.apiKeys[provider ?? state.activeProvider];
      },

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'flowchat-settings',
    }
  )
);
