export interface StreamDelta {
  type: "delta" | "done" | "error";
  token?: string;
  content?: string;
  error?: string;
}

export async function sendMessage(
  message: string,
  conversationId: string | undefined,
  onDelta: (delta: StreamDelta) => void
): Promise<string> {
  const body: Record<string, string> = { message };
  if (conversationId) {
    body.conversation_id = conversationId;
  }

  const response = await fetch("/api/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = `HTTP ${response.status}`;
    onDelta({ type: "error", error });
    throw new Error(error);
  }

  if (!response.body) {
    const error = "No response body";
    onDelta({ type: "error", error });
    throw new Error(error);
  }

  let content = "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines[lines.length - 1];

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith("event: ")) {
          const event = line.substring(7);
          const dataLine = lines[++i]?.trim();
          if (dataLine?.startsWith("data: ")) {
            try {
              const data = JSON.parse(dataLine.substring(6));
              if (event === "delta" && data.token) {
                content += data.token;
                onDelta({ type: "delta", token: data.token });
              } else if (event === "done") {
                content = data.content || content;
                onDelta({ type: "done", content });
              } else if (event === "error") {
                onDelta({ type: "error", error: data.error });
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      const lines = buffer.split("\n");
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith("event: ")) {
          const event = line.substring(7);
          const dataLine = lines[++i]?.trim();
          if (dataLine?.startsWith("data: ")) {
            try {
              const data = JSON.parse(dataLine.substring(6));
              if (event === "delta" && data.token) {
                content += data.token;
                onDelta({ type: "delta", token: data.token });
              } else if (event === "done") {
                content = data.content || content;
                onDelta({ type: "done", content });
              } else if (event === "error") {
                onDelta({ type: "error", error: data.error });
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return content;
}
