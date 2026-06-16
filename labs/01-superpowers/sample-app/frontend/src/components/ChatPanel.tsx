export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel({
  messages,
  isStreaming = false,
}: {
  messages: ChatMessage[];
  isStreaming?: boolean;
}) {
  if (messages.length === 0) {
    return (
      <section className="chat-panel chat-panel--empty" aria-label="Chat conversation">
        <div className="empty-state">
          <p className="empty-state__eyebrow">AI chat workspace</p>
          <h1>What can I help with?</h1>
          <p>Start a conversation and responses will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="chat-panel" aria-label="Chat conversation">
      <div className="message-timeline">
        {messages.map((message, index) => {
          const isAssistant = message.role === "assistant";
          const isLastMessage = index === messages.length - 1;
          const showStreaming = isStreaming && isAssistant && isLastMessage;

          return (
            <article
              aria-label={isAssistant ? "Assistant message" : "User message"}
              className={`message message--${message.role}`}
              key={message.id}
            >
              <div className="message__avatar" aria-hidden="true">
                {isAssistant ? "AI" : "You"}
              </div>
              <div className="message__body">
                <div className="message__content">{message.content}</div>
                {showStreaming && (
                  <div className="streaming-indicator" role="status">
                    <span className="streaming-indicator__dot" aria-hidden="true" />
                    <span>Streaming response</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
