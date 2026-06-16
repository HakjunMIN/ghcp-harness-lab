export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export function createUserMessage(content: string): ChatMessage {
  return { role: "user", content };
}

export function createAssistantMessage(content: string): ChatMessage {
  return { role: "assistant", content };
}
