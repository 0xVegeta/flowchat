import { type Message } from './db';

// Placeholder for LLM integration
export async function generateAIResponse(history: Message[], nodeData: any): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return "I am a flow-based AI assistant. Each node in this canvas represents a branch of our conversation. You can create new nodes to explore different ideas!";
}
