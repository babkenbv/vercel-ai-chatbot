export type ModelProvider = "google" | "openai";

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  description: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Google's latest fast model",
  },
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "openai",
    description: "OpenAI's most capable model",
  },
];

export const DEFAULT_MODEL_ID = "gemini-2.5-flash";
