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

  return (
    <div className="app-shell">
      <ConversationNav />
      <main className="chat-main">
        <ChatPanel messages={messages} />
        <Composer
          onSend={(text) => setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text }])}
        />
      </main>
    </div>
  );
}
