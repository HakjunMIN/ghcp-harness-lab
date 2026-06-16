import { useState } from "react";
import { ConversationNav } from "./components/ConversationNav";
import { ChatPanel } from "./components/ChatPanel";
import { Composer } from "./components/Composer";
import { createUserMessage, type ChatMessage } from "./lib/api";
import "./styles/chatgpt.css";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div className="app-shell">
      <ConversationNav />
      <main className="chat-main">
        <ChatPanel messages={messages} />
        <Composer onSend={(text) => setMessages((current) => [...current, createUserMessage(text)])} />
      </main>
    </div>
  );
}
