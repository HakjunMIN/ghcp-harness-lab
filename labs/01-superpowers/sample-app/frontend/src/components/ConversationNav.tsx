import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  title: string;
  created_at?: string;
}

export function ConversationNav({
  activeConversationId,
  onSelect,
}: {
  activeConversationId?: string;
  onSelect?: (conversationId: string) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/conversations");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const contentType = response.headers.get("Content-Type");
        if (contentType && !contentType.includes("application/json")) {
          throw new Error("Backend returned a non-JSON response");
        }
        const data = await response.json();
        setConversations(data.items || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Request failed";
        setError(`Could not load conversations: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const createConversation = async () => {
    setError(null);

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const contentType = response.headers.get("Content-Type");
      if (contentType && !contentType.includes("application/json")) {
        throw new Error("Backend returned a non-JSON response");
      }
      const data = await response.json();
      const conversation = {
        id: data.id,
        title: data.title || "New Chat",
        created_at: data.created_at,
      };

      setConversations((prev) => [conversation, ...prev]);
      onSelect?.(conversation.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(`Could not create conversation: ${message}`);
    }
  };

  return (
    <aside className="conversation-nav" aria-label="Sidebar">
      <div className="conversation-nav__top">
        <div className="conversation-nav__brand">
          <span className="conversation-nav__brand-mark" aria-hidden="true">AI</span>
          <span>Assistant</span>
        </div>
        <button className="conversation-nav__new" onClick={createConversation} disabled={loading}>
          <span aria-hidden="true">+</span>
          <span>New chat</span>
        </button>
      </div>

      <div className="conversation-nav__section">
        <div className="conversation-nav__section-title">Recent</div>
        {error && (
          <p className="conversation-nav__notice" role="status">
            {error}
          </p>
        )}
        {loading && <p className="conversation-nav__muted">Loading conversations...</p>}
        {!loading && conversations.length === 0 && !error && (
          <p className="conversation-nav__muted">No conversations yet</p>
        )}
        <ul className="conversation-list" aria-label="Recent conversations">
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;
            return (
              <li key={conversation.id}>
                <button
                  className={`conversation-list__item${isActive ? " conversation-list__item--active" : ""}`}
                  onClick={() => onSelect?.(conversation.id)}
                  aria-current={isActive ? "page" : undefined}
                  title={conversation.title}
                >
                  <span>{conversation.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="conversation-nav__footer">
        <div>
          <strong>Local MVP</strong>
          <span>Streaming chat</span>
        </div>
      </div>
    </aside>
  );
}
