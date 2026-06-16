type ConversationNavProps = {
  conversations?: string[];
};

export function ConversationNav({ conversations = ["General"] }: ConversationNavProps) {
  return (
    <aside className="conversation-nav" aria-label="Conversations">
      <div className="nav-brand">ChatGPT</div>
      <button className="nav-new-chat" type="button">
        New chat
      </button>
      <div className="nav-section">Recent</div>
      <ul className="nav-list">
        {conversations.map((conversation, index) => (
          <li key={conversation}>
            <button className={`nav-item ${index === 0 ? "is-active" : ""}`} type="button">
              {conversation}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
