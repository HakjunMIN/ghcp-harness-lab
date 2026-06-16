import { useState } from "react";
import { ConversationNav } from "./components/ConversationNav";
import { ChatPanel } from "./components/ChatPanel";
import { Composer } from "./components/Composer";
import "./styles/chatgpt.css";

export default function App() {
  const [messages, setMessages] = useState<{
    id: string;
    role: "user" | "assistant";
    content: string;
  }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = async (text: string) => {
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = crypto.randomUUID();
    let assistantContent = "";

    setIsStreaming(true);
    try {
      const { sendMessage } = await import("./lib/api");
      await sendMessage(text, undefined, (delta) => {
        if (delta.type === "delta" && delta.token) {
          assistantContent += delta.token;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.id === assistantId) {
              return [...prev.slice(0, -1), { ...last, content: assistantContent }];
            }
            return [
              ...prev,
              { id: assistantId, role: "assistant", content: assistantContent },
            ];
          });
        } else if (delta.type === "done") {
          assistantContent = delta.content || assistantContent;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.id === assistantId) {
              return [...prev.slice(0, -1), { ...last, content: assistantContent }];
            }
            return [
              ...prev,
              { id: assistantId, role: "assistant", content: assistantContent },
            ];
          });
        }
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "Error: Failed to send message.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="app-shell">
      <ConversationNav />
      <main className="chat-main">
        <ChatPanel messages={messages} />
        <Composer onSend={handleSend} disabled={isStreaming} />
      </main>
    </div>
  );
}
