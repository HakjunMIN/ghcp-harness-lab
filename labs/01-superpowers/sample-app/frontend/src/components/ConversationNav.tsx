import { useState, useEffect } from "react";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export function ConversationNav({
  onSelect,
}: {
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
        const data = await response.json();
        setConversations(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const createConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setConversations((prev) => [
        { id: data.id, title: data.title, created_at: data.created_at },
        ...prev,
      ]);
      if (onSelect) {
        onSelect(data.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create conversation");
    }
  };

  return (
    <aside style={{ padding: 16, borderRight: "1px solid #ccc", minWidth: 200 }}>
      <h2>Conversations</h2>
      <button onClick={createConversation} disabled={loading}>
        + New Chat
      </button>
      {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0 0" }}>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            onClick={() => onSelect?.(conv.id)}
            style={{
              padding: "8px 4px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {conv.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}
