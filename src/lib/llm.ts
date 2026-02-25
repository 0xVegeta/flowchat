import { type Message } from './db';
import { useSettingsStore, type ProviderId } from '@/store/settingsStore';
import { generateText, type LanguageModel } from 'ai';

// ─── Provider factory ────────────────────────────────────────────────────────
// Lazily imports the correct @ai-sdk/* package and creates a model instance.
// Keys are read from the settings store at call-time (BYOK).

async function getModel(provider: ProviderId, modelId: string, apiKey: string): Promise<LanguageModel> {
  switch (provider) {
    case 'openai': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      return createOpenAI({ apiKey })(modelId);
    }
    case 'anthropic': {
      const { createAnthropic } = await import('@ai-sdk/anthropic');
      return createAnthropic({ apiKey })(modelId);
    }
    case 'google': {
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      return createGoogleGenerativeAI({ apiKey })(modelId);
    }
    case 'xai': {
      const { createXai } = await import('@ai-sdk/xai');
      return createXai({ apiKey })(modelId);
    }
    case 'groq': {
      const { createGroq } = await import('@ai-sdk/groq');
      return createGroq({ apiKey })(modelId);
    }
    case 'mistral': {
      const { createMistral } = await import('@ai-sdk/mistral');
      return createMistral({ apiKey })(modelId);
    }
    case 'deepseek': {
      const { createDeepSeek } = await import('@ai-sdk/deepseek');
      return createDeepSeek({ apiKey })(modelId);
    }
    case 'perplexity': {
      const { createPerplexity } = await import('@ai-sdk/perplexity');
      return createPerplexity({ apiKey })(modelId);
    }
    case 'cohere': {
      const { createCohere } = await import('@ai-sdk/cohere');
      return createCohere({ apiKey })(modelId);
    }
    case 'fireworks': {
      const { createFireworks } = await import('@ai-sdk/fireworks');
      return createFireworks({ apiKey })(modelId);
    }
    case 'togetherai': {
      const { createTogetherAI } = await import('@ai-sdk/togetherai');
      return createTogetherAI({ apiKey })(modelId);
    }
    case 'cerebras': {
      const { createCerebras } = await import('@ai-sdk/cerebras');
      return createCerebras({ apiKey })(modelId);
    }
    case 'deepinfra': {
      const { createDeepInfra } = await import('@ai-sdk/deepinfra');
      return createDeepInfra({ apiKey })(modelId);
    }
    default:
      throw new Error(`Unsupported provider: ${provider as string}`);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function generateAIResponse(
  history: Message[],
  nodeData: Record<string, unknown>
): Promise<string> {
  const settings = useSettingsStore.getState();
  const provider = settings.activeProvider;
  const modelId = settings.activeModel;
  const rawKey = settings.getApiKey(provider);

  if (!rawKey) {
    throw new Error(
      `No API key configured for ${provider}. Open the sidebar and add your key.`
    );
  }

  // Trim whitespace from the key (common copy-paste issue)
  const apiKey = rawKey.trim();

  // Debug: log key presence and length (never log the actual key)
  console.log(`[FlowChat LLM] provider=${provider}, model=${modelId}, keyLength=${apiKey.length}`);

  // Build messages array for the AI SDK
  // Filter to only user/assistant — system prompts go via the `system` param.
  // Gemini specifically crashes if system messages appear mid-conversation.
  const messages = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  // If the node has a system prompt, use it; otherwise fall back to a default
  const systemPrompt: string =
    (nodeData?.systemPrompt as string) ||
    (nodeData?.label as string) ||
    'You are a helpful AI assistant.';

  try {
    const model = await getModel(provider, modelId, apiKey);

    const result = await generateText({
      model,
      system: systemPrompt,
      messages,
    });

    return result.text;
  } catch (error: unknown) {
    // Re-throw with a cleaner message
    const msg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`[${provider}/${modelId}] ${msg}`);
  }
}
