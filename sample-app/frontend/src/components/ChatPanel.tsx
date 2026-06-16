import type { ChatMessage } from "../lib/api";

type ChatPanelProps = {
  messages: ChatMessage[];
};

export function ChatPanel({ messages }: ChatPanelProps) {
  return (
    <section className="chat-panel" aria-label="Chat messages">
      <header className="chat-header">
        <h1>ChatGPT</h1>
      </header>

      <div className="message-list" aria-live="polite">
        {messages.length === 0 ? (
          <div className="empty-state">Start a conversation by sending a message.</div>
        ) : (
          messages.map((message, index) => (
            <article className={`message-row ${message.role}`} key={`${message.role}-${index}`}>
              <div className="message-bubble">{message.content}</div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
