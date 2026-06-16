import { useState } from "react";
import { ConversationNav } from "./components/ConversationNav";
import { ChatPanel, type ChatMessage } from "./components/ChatPanel";
import { Composer } from "./components/Composer";
import "./styles/chatgpt.css";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const handleConversationSelect = async (id: string) => {
    setConversationId(id);
    setMessages([]);
    
    try {
      const response = await fetch(`/api/conversations/${id}/messages`);
      if (!response.ok) {
        console.error("Failed to load messages");
        return;
      }
      const data = await response.json();
      setMessages(data.items || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSend = async (text: string) => {
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = crypto.randomUUID();
    let assistantContent = "";

    setIsStreaming(true);
    try {
      const { sendMessage } = await import("./lib/api");
      await sendMessage(text, conversationId, (delta) => {
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
      <ConversationNav activeConversationId={conversationId} onSelect={handleConversationSelect} />
      <main className="chat-main">
        <header className="chat-main__header">
          <button className="model-button" type="button">ChatGPT-inspired MVP</button>
          <span className="chat-main__status">Local prototype</span>
        </header>
        <ChatPanel messages={messages} isStreaming={isStreaming} />
        <Composer onSend={handleSend} disabled={isStreaming} />
      </main>
    </div>
  );
}
