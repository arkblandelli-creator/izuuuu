export type AIMode = "chatgpt" | "claude" | "gemini";

export interface AIModeConfig {
  id: AIMode;
  name: string;
  provider: string;
  badgeColor: string;
  icon: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  model?: AIMode;
  attachments?: Attachment[];
  isError?: boolean;
  isStreaming?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: AIMode;
}

export const AI_MODES: AIModeConfig[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "ChatGPT API",
    badgeColor: "bg-emerald-500",
    icon: "Zap",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Claude AI",
    badgeColor: "bg-orange-500",
    icon: "Sparkles",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Gemini AI",
    badgeColor: "bg-blue-500",
    icon: "Bot",
  },
];
