# ChatGPT-Inspired Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing React chat frontend into a polished ChatGPT-inspired dark chat interface while preserving the current API contracts and behavior.

**Architecture:** Keep the existing `App`, `ConversationNav`, `ChatPanel`, and `Composer` boundaries. Move presentation out of inline styles and into `frontend/src/styles/chatgpt.css`, with components exposing semantic class names and accessible state markers. The backend, SSE parser, and package dependencies remain unchanged.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, React Testing Library, CSS.

---

## File Structure

- Modify `frontend/src/App.tsx`: keep application state and streaming orchestration, pass active conversation and streaming state into child components, and add a simple top bar.
- Modify `frontend/src/components/ConversationNav.tsx`: render the polished sidebar, active conversation state, loading state, empty state, and local error notices.
- Modify `frontend/src/components/ChatPanel.tsx`: render the empty state, message timeline, role-specific message layout, and streaming indicator.
- Modify `frontend/src/components/Composer.tsx`: replace the bare input/button with an accessible pill composer using a textarea and keyboard submit behavior.
- Modify `frontend/src/styles/chatgpt.css`: define all layout, dark theme, responsive behavior, message styling, sidebar styling, and composer styling.
- Modify `frontend/src/__tests__/App.test.tsx`: keep integration smoke coverage for the app shell and send behavior.
- Create `frontend/src/components/ChatPanel.test.tsx`: focused tests for empty, message, and streaming states.
- Create `frontend/src/components/Composer.test.tsx`: focused tests for composer submit and disabled behavior.
- Create `frontend/src/components/ConversationNav.test.tsx`: focused tests for sidebar loading, empty, active, and error states.

Do not modify backend files, `frontend/package.json`, or lockfiles for this redesign.

## Task 1: ChatPanel Empty State And Message Timeline

**Files:**
- Create: `frontend/src/components/ChatPanel.test.tsx`
- Modify: `frontend/src/components/ChatPanel.tsx`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/components/ChatPanel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ChatPanel } from "./ChatPanel";

describe("ChatPanel", () => {
  test("renders the empty chat welcome state", () => {
    render(<ChatPanel messages={[]} isStreaming={false} />);

    expect(screen.getByRole("heading", { name: "What can I help with?" })).toBeInTheDocument();
    expect(screen.getByText("Start a conversation and responses will appear here."))
      .toBeInTheDocument();
  });

  test("renders user and assistant messages with role labels", () => {
    render(
      <ChatPanel
        isStreaming={false}
        messages={[
          { id: "user-1", role: "user", content: "hello" },
          { id: "assistant-1", role: "assistant", content: "Hi there." },
        ]}
      />
    );

    expect(screen.getByLabelText("User message")).toHaveTextContent("hello");
    expect(screen.getByLabelText("Assistant message")).toHaveTextContent("Hi there.");
  });

  test("shows a streaming indicator after assistant content", () => {
    render(
      <ChatPanel
        isStreaming={true}
        messages={[{ id: "assistant-1", role: "assistant", content: "Working" }]}
      />
    );

    expect(screen.getByText("Streaming response")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
cd frontend && npm test -- --run src/components/ChatPanel.test.tsx
```

Expected: FAIL because `ChatPanel` does not accept `isStreaming`, does not render the empty heading, and does not expose message role labels.

- [ ] **Step 3: Implement the minimal ChatPanel redesign**

Replace `frontend/src/components/ChatPanel.tsx` with:

```tsx
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:

```bash
cd frontend && npm test -- --run src/components/ChatPanel.test.tsx
```

Expected: PASS for all `ChatPanel` tests.

- [ ] **Step 5: Commit**

Run:

```bash
git add frontend/src/components/ChatPanel.tsx frontend/src/components/ChatPanel.test.tsx
git commit -m "feat: redesign chat message panel"
```

## Task 2: Composer Pill Surface And Submit Behavior

**Files:**
- Create: `frontend/src/components/Composer.test.tsx`
- Modify: `frontend/src/components/Composer.tsx`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/components/Composer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Composer } from "./Composer";

describe("Composer", () => {
  test("disables send when the prompt is empty", () => {
    render(<Composer onSend={vi.fn()} disabled={false} />);

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  test("sends trimmed text and clears the textarea", async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} disabled={false} />);

    const textbox = screen.getByPlaceholderText("Message ChatGPT...");
    await userEvent.type(textbox, "  hello  ");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onSend).toHaveBeenCalledWith("hello");
    expect(textbox).toHaveValue("");
  });

  test("submits with Enter and keeps newline with Shift Enter", async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} disabled={false} />);

    const textbox = screen.getByPlaceholderText("Message ChatGPT...");
    await userEvent.type(textbox, "line one{shift>}{enter}{/shift}line two");
    expect(textbox).toHaveValue("line one\nline two");

    await userEvent.keyboard("{enter}");
    expect(onSend).toHaveBeenCalledWith("line one\nline two");
    expect(textbox).toHaveValue("");
  });

  test("does not submit while disabled", async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} disabled={true} />);

    await userEvent.type(screen.getByPlaceholderText("Message ChatGPT..."), "hello");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onSend).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
cd frontend && npm test -- --run src/components/Composer.test.tsx
```

Expected: FAIL because the current composer uses an input, does not preserve Shift+Enter newlines, and does not submit on Enter.

- [ ] **Step 3: Implement the composer redesign**

Replace `frontend/src/components/Composer.tsx` with:

```tsx
import { KeyboardEvent, useState } from "react";

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const trimmedText = text.trim();
  const cannotSend = Boolean(disabled) || trimmedText.length === 0;

  const submit = () => {
    if (cannotSend) {
      return;
    }

    onSend(trimmedText);
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="composer-wrap"
      aria-label="Message composer"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="composer-shell">
        <button className="composer-action" type="button" aria-label="Add context" disabled={disabled}>
          +
        </button>
        <textarea
          className="composer-input"
          placeholder="Message ChatGPT..."
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <button className="composer-send" type="submit" disabled={cannotSend}>
          Send
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:

```bash
cd frontend && npm test -- --run src/components/Composer.test.tsx
```

Expected: PASS for all `Composer` tests.

- [ ] **Step 5: Commit**

Run:

```bash
git add frontend/src/components/Composer.tsx frontend/src/components/Composer.test.tsx
git commit -m "feat: redesign chat composer"
```

## Task 3: ConversationNav Sidebar States

**Files:**
- Create: `frontend/src/components/ConversationNav.test.tsx`
- Modify: `frontend/src/components/ConversationNav.tsx`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/components/ConversationNav.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ConversationNav } from "./ConversationNav";

function mockFetch(response: Response) {
  global.fetch = vi.fn(() => Promise.resolve(response));
}

describe("ConversationNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the empty conversation state", async () => {
    mockFetch(new Response(JSON.stringify({ items: [] }), { status: 200 }));

    render(<ConversationNav activeConversationId={undefined} onSelect={vi.fn()} />);

    expect(screen.getByRole("button", { name: "New chat" })).toBeInTheDocument();
    expect(await screen.findByText("No conversations yet"))
      .toBeInTheDocument();
  });

  test("marks the active conversation", async () => {
    mockFetch(
      new Response(
        JSON.stringify({
          items: [{ id: "conv-1", title: "Design review", created_at: "2026-06-16T00:00:00Z" }],
        }),
        { status: 200 }
      )
    );

    render(<ConversationNav activeConversationId="conv-1" onSelect={vi.fn()} />);

    const activeItem = await screen.findByRole("button", { name: "Design review" });
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  test("selects a conversation", async () => {
    const onSelect = vi.fn();
    mockFetch(
      new Response(
        JSON.stringify({
          items: [{ id: "conv-1", title: "Design review", created_at: "2026-06-16T00:00:00Z" }],
        }),
        { status: 200 }
      )
    );

    render(<ConversationNav activeConversationId={undefined} onSelect={onSelect} />);

    await userEvent.click(await screen.findByRole("button", { name: "Design review" }));
    expect(onSelect).toHaveBeenCalledWith("conv-1");
  });

  test("shows an inline error when conversations fail to load", async () => {
    mockFetch(new Response("", { status: 500 }));

    render(<ConversationNav activeConversationId={undefined} onSelect={vi.fn()} />);

    expect(await screen.findByRole("status")).toHaveTextContent("Could not load conversations: HTTP 500");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
cd frontend && npm test -- --run src/components/ConversationNav.test.tsx
```

Expected: FAIL because `ConversationNav` does not accept `activeConversationId`, does not render the specified empty/error states, and uses list items instead of accessible conversation buttons.

- [ ] **Step 3: Implement the sidebar redesign**

Replace `frontend/src/components/ConversationNav.tsx` with:

```tsx
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:

```bash
cd frontend && npm test -- --run src/components/ConversationNav.test.tsx
```

Expected: PASS for all `ConversationNav` tests.

- [ ] **Step 5: Commit**

Run:

```bash
git add frontend/src/components/ConversationNav.tsx frontend/src/components/ConversationNav.test.tsx
git commit -m "feat: redesign conversation sidebar"
```

## Task 4: App Shell, CSS System, And Integration Smoke Tests

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/styles/chatgpt.css`
- Modify: `frontend/src/__tests__/App.test.tsx`

- [ ] **Step 1: Write the failing app integration tests**

Replace `frontend/src/__tests__/App.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import App from "../App";

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn((input: RequestInfo | URL) => {
    const url = String(input);

    if (url === "/api/conversations") {
      return Promise.resolve(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    }

    return Promise.resolve(new Response("", { status: 404 }));
  });
});

test("renders the redesigned app shell", async () => {
  render(<App />);

  expect(screen.getByRole("button", { name: "New chat" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "What can I help with?" })).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Message ChatGPT...")).toBeInTheDocument();
  expect(await screen.findByText("No conversations yet")).toBeInTheDocument();
});

test("displays user message after sending", async () => {
  render(<App />);

  const input = screen.getByPlaceholderText("Message ChatGPT...");
  const button = screen.getByRole("button", { name: "Send" });

  await userEvent.type(input, "hello");
  await userEvent.click(button);

  expect(await screen.findByText("hello")).toBeInTheDocument();
  expect(input).toHaveValue("");
});

test("send button is disabled when input is empty", async () => {
  render(<App />);

  const button = screen.getByRole("button", { name: "Send" });
  expect(button).toBeDisabled();

  await userEvent.type(screen.getByPlaceholderText("Message ChatGPT..."), "text");
  expect(button).not.toBeDisabled();

  await userEvent.clear(screen.getByPlaceholderText("Message ChatGPT..."));
  expect(button).toBeDisabled();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
cd frontend && npm test -- --run src/__tests__/App.test.tsx
```

Expected: FAIL because `App` does not pass `isStreaming` or `activeConversationId`, `ConversationNav` does not yet have final class-based shell integration if previous tasks were not completed, and the app shell CSS classes are not complete.

- [ ] **Step 3: Implement the app shell wiring**

Replace `frontend/src/App.tsx` with:

```tsx
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
```

- [ ] **Step 4: Implement the CSS system**

Replace `frontend/src/styles/chatgpt.css` with:

```css
:root {
  color: #f4f4f5;
  background: #0f0f10;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #0f0f10;
}

button,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled,
textarea:disabled {
  cursor: not-allowed;
}

.app-shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
  background: #0f0f10;
  color: #f4f4f5;
}

.conversation-nav {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 12px;
  background: #171719;
  border-right: 1px solid #242428;
}

.conversation-nav__top {
  display: grid;
  gap: 12px;
}

.conversation-nav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 8px;
  color: #f4f4f5;
  font-size: 14px;
  font-weight: 650;
}

.conversation-nav__brand-mark {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #242428;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.conversation-nav__new,
.conversation-list__item {
  width: 100%;
  min-height: 38px;
  border: 0;
  border-radius: 8px;
  color: #f4f4f5;
  background: transparent;
  text-align: left;
}

.conversation-nav__new {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  background: #202023;
  font-weight: 600;
}

.conversation-nav__new:hover:not(:disabled),
.conversation-list__item:hover {
  background: #2a2a2e;
}

.conversation-nav__new:disabled {
  color: #8c8c95;
}

.conversation-nav__section {
  flex: 1;
  min-height: 0;
  margin-top: 22px;
  overflow: hidden;
}

.conversation-nav__section-title {
  padding: 0 8px 8px;
  color: #9b9ba3;
  font-size: 12px;
  font-weight: 650;
  text-transform: uppercase;
}

.conversation-nav__muted,
.conversation-nav__notice {
  margin: 0;
  padding: 8px;
  color: #a8a8b2;
  font-size: 13px;
  line-height: 1.4;
}

.conversation-nav__notice {
  color: #f2b8b5;
}

.conversation-list {
  display: grid;
  gap: 2px;
  margin: 0;
  overflow-y: auto;
  padding: 0 2px 0 0;
  list-style: none;
}

.conversation-list__item {
  display: block;
  padding: 0 10px;
  color: #d9d9de;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-list__item--active {
  background: #303036;
  color: #ffffff;
}

.conversation-nav__footer {
  margin-top: 14px;
  padding: 10px 8px;
  border-top: 1px solid #242428;
  color: #a8a8b2;
  font-size: 12px;
}

.conversation-nav__footer div {
  display: grid;
  gap: 2px;
}

.conversation-nav__footer strong {
  color: #f4f4f5;
  font-size: 13px;
}

.chat-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
  background: #101011;
}

.chat-main__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 0 20px;
  color: #d9d9de;
}

.model-button {
  min-height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #f4f4f5;
  font-weight: 650;
}

.model-button:hover {
  background: #202023;
}

.chat-main__status {
  color: #8c8c95;
  font-size: 13px;
}

.chat-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 20px 120px;
}

.chat-panel--empty {
  display: grid;
  place-items: center;
  padding-bottom: 180px;
}

.empty-state {
  width: min(680px, 100%);
  text-align: center;
}

.empty-state__eyebrow {
  margin: 0 0 10px;
  color: #8c8c95;
  font-size: 13px;
  font-weight: 650;
}

.empty-state h1 {
  margin: 0;
  color: #f4f4f5;
  font-size: 30px;
  font-weight: 650;
  letter-spacing: 0;
}

.empty-state p:last-child {
  margin: 12px 0 0;
  color: #a8a8b2;
  line-height: 1.5;
}

.message-timeline {
  display: grid;
  gap: 22px;
  width: min(760px, 100%);
  margin: 0 auto;
}

.message {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.message--user {
  grid-template-columns: minmax(0, 1fr) 38px;
}

.message--user .message__avatar {
  grid-column: 2;
  grid-row: 1;
  background: #303036;
}

.message--user .message__body {
  justify-self: end;
  max-width: min(620px, 100%);
}

.message__avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #1f3f36;
  color: #f4f4f5;
  font-size: 11px;
  font-weight: 750;
}

.message__body {
  min-width: 0;
}

.message__content {
  color: #ececf1;
  font-size: 15px;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.message--user .message__content {
  padding: 10px 14px;
  border-radius: 18px;
  background: #2f2f34;
  color: #ffffff;
}

.streaming-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  color: #9b9ba3;
  font-size: 13px;
}

.streaming-indicator__dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #19c37d;
}

.composer-wrap {
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 18px 20px 22px;
  background: linear-gradient(180deg, rgba(16, 16, 17, 0), #101011 28%);
}

.composer-shell {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: end;
  width: min(760px, 100%);
  min-height: 58px;
  margin: 0 auto;
  padding: 10px;
  border: 1px solid #303036;
  border-radius: 24px;
  background: #202023;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}

.composer-action,
.composer-send {
  border: 0;
  border-radius: 999px;
  font-weight: 700;
}

.composer-action {
  width: 36px;
  height: 36px;
  background: #303036;
  color: #f4f4f5;
  font-size: 20px;
  line-height: 1;
}

.composer-input {
  width: 100%;
  min-height: 36px;
  max-height: 160px;
  resize: vertical;
  border: 0;
  outline: 0;
  padding: 8px 0;
  background: transparent;
  color: #f4f4f5;
  line-height: 1.45;
}

.composer-input::placeholder {
  color: #9b9ba3;
}

.composer-send {
  min-width: 64px;
  height: 36px;
  padding: 0 16px;
  background: #f4f4f5;
  color: #111113;
}

.composer-send:disabled {
  background: #38383e;
  color: #8c8c95;
}

@media (max-width: 760px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .conversation-nav {
    display: none;
  }

  .chat-main__header {
    padding: 0 14px;
  }

  .chat-main__status {
    display: none;
  }

  .chat-panel {
    padding: 18px 14px 112px;
  }

  .empty-state h1 {
    font-size: 26px;
  }

  .message,
  .message--user {
    grid-template-columns: 1fr;
  }

  .message__avatar,
  .message--user .message__avatar {
    display: none;
  }

  .message--user .message__body {
    justify-self: stretch;
  }

  .composer-wrap {
    padding: 14px;
  }

  .composer-shell {
    grid-template-columns: 32px minmax(0, 1fr) auto;
    border-radius: 20px;
  }

  .composer-action {
    width: 32px;
    height: 32px;
  }
}
```

- [ ] **Step 5: Run the app integration tests**

Run:

```bash
cd frontend && npm test -- --run src/__tests__/App.test.tsx
```

Expected: PASS for all app integration tests.

- [ ] **Step 6: Run the full frontend test suite**

Run:

```bash
cd frontend && npm test -- --run
```

Expected: PASS for all frontend tests.

- [ ] **Step 7: Run the frontend production build**

Run:

```bash
cd frontend && npm run build
```

Expected: PASS with Vite producing a `dist` build.

- [ ] **Step 8: Commit**

Run:

```bash
git add frontend/src/App.tsx frontend/src/styles/chatgpt.css frontend/src/__tests__/App.test.tsx
git commit -m "feat: polish chat app shell"
```

## Task 5: Browser Verification And Retrospective

**Files:**
- Modify: `RETRO.md`

- [ ] **Step 1: Start the frontend dev server**

Run:

```bash
cd frontend && npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 2: Verify the desktop layout manually**

Open the Vite URL in a browser at a desktop width. Confirm these exact checks:

- The left sidebar is visible and about 260px wide.
- The main canvas is dark and uncluttered.
- The empty state heading reads `What can I help with?`.
- The composer is centered at the bottom and has a rounded pill surface.
- The `Send` button is disabled when the prompt is empty.
- Typing text enables the `Send` button.

- [ ] **Step 3: Verify the mobile layout manually**

Open the same URL at a narrow width below 760px. Confirm these exact checks:

- The sidebar is hidden.
- The header, empty state, and composer fit without horizontal scrolling.
- Composer text and buttons do not overlap.
- User and assistant messages wrap inside the viewport.

- [ ] **Step 4: Update the retrospective**

Append this section to `RETRO.md`:

```markdown

## ChatGPT-Inspired Frontend Redesign

- Replaced the bare prototype presentation with a focused dark chat interface.
- Kept the existing frontend/backend API contracts unchanged.
- Added component-level tests for the chat panel, composer, and conversation sidebar.
- Added app-level smoke tests for the redesigned shell and send behavior.
- Verified the frontend test suite and production build after the redesign.
- Manual browser checks covered desktop and narrow mobile widths.
```

- [ ] **Step 5: Run final frontend verification**

Run:

```bash
cd frontend && npm test -- --run && npm run build
```

Expected: PASS for tests and PASS for the Vite build.

- [ ] **Step 6: Commit**

Run:

```bash
git add RETRO.md
git commit -m "docs: record frontend redesign verification"
```

## Self-Review

Spec coverage:

- Modern dark interface: covered by Task 4 CSS system.
- Existing API contracts preserved: covered by Task 4 App wiring and no backend file changes.
- Component responsibilities clarified: covered by Tasks 1, 2, and 3.
- Inline styles moved to CSS: covered by Tasks 1, 2, 3, and 4.
- Empty, loading, streaming, active, and error states: covered by Tasks 1 and 3, with app shell coverage in Task 4.
- Responsive behavior: covered by Task 4 CSS media query and Task 5 manual verification.
- Frontend tests and build: covered by Tasks 1 through 5.

Placeholder scan:

- No incomplete markers, deferred implementation notes, or unspecified validation steps remain in this plan.

Type consistency:

- `ChatMessage` is defined in `ChatPanel.tsx` and imported by `App.tsx`.
- `ConversationNav` accepts `activeConversationId?: string` and `onSelect?: (conversationId: string) => void` consistently across tests and app wiring.
- `Composer` keeps `onSend: (text: string) => void` and `disabled?: boolean`, matching the existing app contract.
# ChatGPT-Inspired Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the React chat frontend into a polished ChatGPT-inspired dark chat experience while preserving the existing backend and streaming contracts.

**Architecture:** Keep the existing `App` orchestration and three component boundaries: `ConversationNav`, `ChatPanel`, and `Composer`. Move presentation out of inline styles into `frontend/src/styles/chatgpt.css`, add focused component tests, and keep the API client untouched.

**Tech Stack:** React 18, Vite, TypeScript, Vitest, Testing Library, CSS media queries, existing browser `fetch` and streaming APIs.

---

## Scope Check

The approved spec covers one subsystem: the existing React frontend. It does not require backend changes, authentication, new dependencies, or API contract changes. This can be implemented as one frontend plan with four independent tasks.

## File Structure

- Modify `frontend/src/App.tsx`
  - Owns message state, active conversation id, and streaming orchestration.
  - Passes active/streaming state into presentational components.
- Modify `frontend/src/components/ConversationNav.tsx`
  - Owns sidebar rendering, conversation fetching/creation, active item UI, loading, empty, and error states.
- Modify `frontend/src/components/ChatPanel.tsx`
  - Owns empty state, message timeline, role-aware message layout, and streaming indicator.
- Modify `frontend/src/components/Composer.tsx`
  - Owns prompt entry, submit button state, and polished composer markup.
- Modify `frontend/src/styles/chatgpt.css`
  - Owns all visual styling, layout, responsive behavior, states, and typography.
- Modify `frontend/src/__tests__/App.test.tsx`
  - Keeps existing integration behavior covered and adds smoke coverage for the redesign.
- Create `frontend/src/components/ChatPanel.test.tsx`
  - Unit tests the empty state, message rendering, and streaming indicator.
- Create `frontend/src/components/Composer.test.tsx`
  - Unit tests prompt typing, send behavior, disabled behavior, and clearing after send.
- Create `frontend/src/components/ConversationNav.test.tsx`
  - Unit tests sidebar fetch/render, active conversation state, and error rendering.

Do not modify `frontend/src/lib/api.ts`, backend files, or package dependencies for this redesign.

---

### Task 1: ChatPanel Empty State And Message Timeline

**Files:**
- Create: `frontend/src/components/ChatPanel.test.tsx`
- Modify: `frontend/src/components/ChatPanel.tsx`

- [ ] **Step 1: Write the failing ChatPanel tests**

Create `frontend/src/components/ChatPanel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ChatPanel } from "./ChatPanel";

test("renders the empty chat welcome when there are no messages", () => {
  render(<ChatPanel messages={[]} isStreaming={false} />);

  expect(screen.getByRole("heading", { name: "What can I help with today?" })).toBeInTheDocument();
  expect(screen.getByText("Start a conversation and responses will appear here."))
    .toBeInTheDocument();
});

test("renders user and assistant messages with role-aware labels", () => {
  render(
    <ChatPanel
      isStreaming={false}
      messages={[
        { id: "user-1", role: "user", content: "Hello there" },
        { id: "assistant-1", role: "assistant", content: "Hi, how can I help?" },
      ]}
    />
  );

  expect(screen.getByText("You")).toBeInTheDocument();
  expect(screen.getByText("Assistant")).toBeInTheDocument();
  expect(screen.getByText("Hello there")).toBeInTheDocument();
  expect(screen.getByText("Hi, how can I help?")).toBeInTheDocument();
});

test("renders a quiet streaming indicator while waiting for assistant text", () => {
  render(<ChatPanel messages={[{ id: "user-1", role: "user", content: "Draft" }]} isStreaming />);

  expect(screen.getByText("Assistant is thinking"))
    .toBeInTheDocument();
});
```

- [ ] **Step 2: Run the ChatPanel tests to verify they fail**

Run:

```bash
cd frontend
npm test -- --run src/components/ChatPanel.test.tsx
```

Expected: FAIL because `ChatPanel` does not accept `isStreaming`, does not render the empty-state heading, and does not render role labels.

- [ ] **Step 3: Implement the ChatPanel component**

Replace `frontend/src/components/ChatPanel.tsx` with:

```tsx
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
      <section className="chat-panel chat-panel-empty" aria-label="Chat conversation">
        <div className="empty-chat">
          <p className="empty-chat-kicker">MVP Chat</p>
          <h1>What can I help with today?</h1>
          <p>Start a conversation and responses will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="chat-panel" aria-label="Chat conversation">
      <div className="message-list">
        {messages.map((message) => (
          <article
            className={`message-row message-row-${message.role}`}
            key={message.id}
          >
            <div className="message-meta">
              {message.role === "user" ? "You" : "Assistant"}
            </div>
            <div className="message-bubble">
              {message.content}
            </div>
          </article>
        ))}
        {isStreaming && (
          <div className="streaming-status" role="status">
            <span className="streaming-dot" aria-hidden="true" />
            Assistant is thinking
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the ChatPanel tests to verify they pass**

Run:

```bash
cd frontend
npm test -- --run src/components/ChatPanel.test.tsx
```

Expected: PASS with all ChatPanel tests green.

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add frontend/src/components/ChatPanel.tsx frontend/src/components/ChatPanel.test.tsx
git commit -m "feat: add polished chat timeline states"
```

---

### Task 2: Composer Interaction Surface

**Files:**
- Create: `frontend/src/components/Composer.test.tsx`
- Modify: `frontend/src/components/Composer.tsx`

- [ ] **Step 1: Write the failing Composer tests**

Create `frontend/src/components/Composer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Composer } from "./Composer";

test("sends trimmed text and clears the composer", async () => {
  const onSend = vi.fn();
  const user = userEvent.setup();

  render(<Composer onSend={onSend} disabled={false} />);

  const input = screen.getByPlaceholderText("Message ChatGPT...");
  await user.type(input, "  hello composer  ");
  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(onSend).toHaveBeenCalledWith("hello composer");
  expect(input).toHaveValue("");
});

test("disables send when text is empty", async () => {
  const onSend = vi.fn();
  const user = userEvent.setup();

  render(<Composer onSend={onSend} disabled={false} />);

  const input = screen.getByPlaceholderText("Message ChatGPT...");
  const sendButton = screen.getByRole("button", { name: "Send" });

  expect(sendButton).toBeDisabled();

  await user.type(input, "ready");
  expect(sendButton).not.toBeDisabled();

  await user.clear(input);
  expect(sendButton).toBeDisabled();
});

test("disables input and send button while streaming", () => {
  render(<Composer onSend={vi.fn()} disabled />);

  expect(screen.getByPlaceholderText("Message ChatGPT...")).toBeDisabled();
  expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
});
```

- [ ] **Step 2: Run the Composer tests to verify they fail**

Run:

```bash
cd frontend
npm test -- --run src/components/Composer.test.tsx
```

Expected: FAIL because the current composer uses unstyled markup and sends untrimmed text.

- [ ] **Step 3: Implement the Composer component**

Replace `frontend/src/components/Composer.tsx` with:

```tsx
import { useState } from "react";

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const trimmedText = text.trim();
  const sendDisabled = disabled || !trimmedText;

  const submit = () => {
    if (sendDisabled) {
      return;
    }

    onSend(trimmedText);
    setText("");
  };

  return (
    <footer className="composer-shell">
      <div className="composer-surface">
        <button
          aria-label="Add context"
          className="composer-action"
          disabled={disabled}
          type="button"
        >
          +
        </button>
        <textarea
          className="composer-input"
          disabled={disabled}
          onChange={(event) => setText(event.currentTarget.value)}
          placeholder="Message ChatGPT..."
          rows={1}
          value={text}
        />
        <button
          className="send-button"
          disabled={sendDisabled}
          onClick={submit}
          type="button"
        >
          Send
        </button>
      </div>
      <p className="composer-note">Responses stream in real time.</p>
    </footer>
  );
}
```

- [ ] **Step 4: Run the Composer tests to verify they pass**

Run:

```bash
cd frontend
npm test -- --run src/components/Composer.test.tsx
```

Expected: PASS with all Composer tests green.

- [ ] **Step 5: Commit Task 2**

Run:

```bash
git add frontend/src/components/Composer.tsx frontend/src/components/Composer.test.tsx
git commit -m "feat: add polished chat composer"
```

---

### Task 3: Conversation Sidebar States

**Files:**
- Create: `frontend/src/components/ConversationNav.test.tsx`
- Modify: `frontend/src/components/ConversationNav.tsx`

- [ ] **Step 1: Write the failing ConversationNav tests**

Create `frontend/src/components/ConversationNav.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { ConversationNav } from "./ConversationNav";

afterEach(() => {
  vi.restoreAllMocks();
});

test("renders fetched conversations and marks the active conversation", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: [
          { id: "conv-1", title: "First chat", created_at: "2026-06-16T00:00:00Z" },
          { id: "conv-2", title: "Second chat", created_at: "2026-06-16T00:00:01Z" },
        ] }),
      } as Response)
    )
  );

  render(<ConversationNav activeConversationId="conv-2" onSelect={vi.fn()} />);

  expect(await screen.findByText("First chat")).toBeInTheDocument();
  const activeItem = screen.getByRole("button", { name: "Second chat" });
  expect(activeItem).toHaveAttribute("aria-current", "page");
});

test("calls onSelect when a conversation is clicked", async () => {
  const onSelect = vi.fn();
  const user = userEvent.setup();

  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: [
          { id: "conv-1", title: "First chat", created_at: "2026-06-16T00:00:00Z" },
        ] }),
      } as Response)
    )
  );

  render(<ConversationNav activeConversationId={undefined} onSelect={onSelect} />);

  await user.click(await screen.findByRole("button", { name: "First chat" }));

  expect(onSelect).toHaveBeenCalledWith("conv-1");
});

test("renders a quiet sidebar error when conversations cannot load", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: false, status: 500 } as Response))
  );

  render(<ConversationNav activeConversationId={undefined} onSelect={vi.fn()} />);

  await waitFor(() => {
    expect(screen.getByText("Could not load conversations: HTTP 500"))
      .toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the ConversationNav tests to verify they fail**

Run:

```bash
cd frontend
npm test -- --run src/components/ConversationNav.test.tsx
```

Expected: FAIL because `ConversationNav` does not accept `activeConversationId`, uses list items instead of accessible buttons, and renders a different error message.

- [ ] **Step 3: Implement the ConversationNav component**

Replace `frontend/src/components/ConversationNav.tsx` with:

```tsx
import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
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
        const data = await response.json();
        setConversations(data.items || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
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
      const data = await response.json();
      const created = {
        id: data.id,
        title: data.title || "New Chat",
        created_at: data.created_at || new Date().toISOString(),
      };
      setConversations((prev) => [created, ...prev]);
      onSelect?.(created.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Could not create conversation: ${message}`);
    }
  };

  return (
    <aside className="conversation-nav" aria-label="Conversation navigation">
      <div className="nav-header">
        <div className="app-mark" aria-hidden="true">AI</div>
        <button className="sidebar-icon-button" aria-label="Collapse sidebar" type="button">
          ||
        </button>
      </div>

      <button
        className="new-chat-button"
        disabled={loading}
        onClick={createConversation}
        type="button"
      >
        <span aria-hidden="true">+</span>
        New chat
      </button>

      <div className="nav-section-label">Recent</div>

      {error && <p className="nav-error">{error}</p>}
      {loading && <p className="nav-muted">Loading conversations...</p>}
      {!loading && !error && conversations.length === 0 && (
        <p className="nav-muted">No conversations yet</p>
      )}

      <ul className="conversation-list" aria-label="Recent conversations">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;
          return (
            <li key={conversation.id}>
              <button
                aria-current={isActive ? "page" : undefined}
                className={`conversation-item${isActive ? " conversation-item-active" : ""}`}
                onClick={() => onSelect?.(conversation.id)}
                title={conversation.title}
                type="button"
              >
                {conversation.title}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="nav-footer">
        <div className="avatar" aria-hidden="true">M</div>
        <div>
          <div className="account-name">MVP Chat</div>
          <div className="account-plan">Local demo</div>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Run the ConversationNav tests to verify they pass**

Run:

```bash
cd frontend
npm test -- --run src/components/ConversationNav.test.tsx
```

Expected: PASS with all ConversationNav tests green.

- [ ] **Step 5: Commit Task 3**

Run:

```bash
git add frontend/src/components/ConversationNav.tsx frontend/src/components/ConversationNav.test.tsx
git commit -m "feat: add polished conversation sidebar"
```

---

### Task 4: App Integration, Dark CSS, And Redesign Smoke Tests

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/styles/chatgpt.css`
- Modify: `frontend/src/__tests__/App.test.tsx`

- [ ] **Step 1: Update the App integration tests first**

Replace `frontend/src/__tests__/App.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, beforeEach, vi } from "vitest";
import App from "../App";

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      status: 404,
    } as Response)
  );
});

test("renders the redesigned empty chat shell", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: "What can I help with today?" }))
    .toBeInTheDocument();
  expect(screen.getByRole("button", { name: "New chat" }))
    .toBeInTheDocument();
  expect(screen.getByPlaceholderText("Message ChatGPT..."))
    .toBeInTheDocument();
});

test("displays user message after sending", async () => {
  render(<App />);
  const input = screen.getByPlaceholderText("Message ChatGPT...");
  const button = screen.getByRole("button", { name: "Send" });

  await userEvent.type(input, "hello");
  await userEvent.click(button);

  expect(await screen.findByText("hello")).toBeInTheDocument();
  expect(input).toHaveValue("");
});

test("send button disabled when input is empty", async () => {
  render(<App />);
  const button = screen.getByRole("button", { name: "Send" });

  expect(button).toBeDisabled();

  await userEvent.type(screen.getByPlaceholderText("Message ChatGPT..."), "text");
  expect(button).not.toBeDisabled();

  await userEvent.clear(screen.getByPlaceholderText("Message ChatGPT..."));
  expect(button).toBeDisabled();
});

test("send button disabled during streaming", async () => {
  let resolveFetch: (value: Response) => void = () => undefined;
  global.fetch = vi.fn(() => new Promise<Response>((resolve) => {
    resolveFetch = resolve;
  }));

  render(<App />);
  const input = screen.getByPlaceholderText("Message ChatGPT...");
  const button = screen.getByRole("button", { name: "Send" });

  await userEvent.type(input, "test message");
  await userEvent.click(button);

  expect(button).toBeDisabled();

  resolveFetch({
    ok: false,
    status: 500,
  } as Response);
});
```

- [ ] **Step 2: Run the App tests to verify they fail**

Run:

```bash
cd frontend
npm test -- --run src/__tests__/App.test.tsx
```

Expected: FAIL until `App` passes `isStreaming` and `activeConversationId` to child components and the CSS-backed markup from previous tasks is integrated.

- [ ] **Step 3: Update App integration code**

Replace `frontend/src/App.tsx` with:

```tsx
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
          content: "Unable to send that message. Please try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="app-shell">
      <ConversationNav
        activeConversationId={conversationId}
        onSelect={handleConversationSelect}
      />
      <main className="chat-main">
        <header className="chat-topbar">
          <button className="model-button" type="button">MVP Chat</button>
          <div className="topbar-actions" aria-label="Chat actions">
            <span className="connection-pill">Local</span>
          </div>
        </header>
        <ChatPanel messages={messages} isStreaming={isStreaming} />
        <Composer onSend={handleSend} disabled={isStreaming} />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Replace the CSS with the full dark redesign**

Replace `frontend/src/styles/chatgpt.css` with:

```css
:root {
  color: #f4f4f5;
  background: #050505;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100vh;
  margin: 0;
}

body {
  background: #050505;
}

button,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled,
textarea:disabled {
  cursor: not-allowed;
}

.app-shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
  background: #050505;
  color: #f4f4f5;
}

.conversation-nav {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 12px;
  background: #0d0d0d;
  border-right: 1px solid #262626;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  margin-bottom: 8px;
}

.app-mark,
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #f4f4f5;
  color: #09090b;
  font-size: 12px;
  font-weight: 700;
}

.sidebar-icon-button,
.composer-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #d4d4d8;
}

.sidebar-icon-button:hover,
.composer-action:hover:not(:disabled) {
  background: #262626;
}

.new-chat-button,
.conversation-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #f4f4f5;
  text-align: left;
}

.new-chat-button {
  gap: 10px;
  padding: 0 10px;
  margin-bottom: 18px;
  background: #2f2f2f;
  font-weight: 600;
}

.new-chat-button:hover:not(:disabled) {
  background: #3a3a3a;
}

.nav-section-label {
  margin: 0 4px 8px;
  color: #a1a1aa;
  font-size: 12px;
  font-weight: 600;
}

.nav-error,
.nav-muted {
  margin: 6px 4px 12px;
  color: #a1a1aa;
  font-size: 13px;
  line-height: 1.4;
}

.nav-error {
  color: #f0b4b4;
}

.conversation-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.conversation-item {
  display: block;
  overflow: hidden;
  padding: 0 10px;
  color: #e4e4e7;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-item:hover,
.conversation-item-active {
  background: #242424;
}

.conversation-item-active {
  color: #ffffff;
  font-weight: 600;
}

.nav-footer {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 4px 2px;
  border-top: 1px solid #222222;
}

.account-name {
  font-size: 13px;
  font-weight: 600;
}

.account-plan {
  color: #a1a1aa;
  font-size: 12px;
}

.chat-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
  background: #050505;
}

.chat-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 0 20px;
}

.model-button {
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #f4f4f5;
  font-size: 18px;
  font-weight: 700;
}

.model-button:hover {
  background: #1f1f1f;
}

.connection-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid #2f2f2f;
  border-radius: 999px;
  color: #a1a1aa;
  font-size: 12px;
}

.chat-panel {
  display: flex;
  flex: 1;
  min-height: 0;
  padding: 24px 20px 12px;
  overflow-y: auto;
}

.chat-panel-empty {
  align-items: center;
  justify-content: center;
}

.empty-chat {
  width: min(680px, 100%);
  text-align: center;
}

.empty-chat-kicker {
  margin: 0 0 12px;
  color: #a1a1aa;
  font-size: 13px;
  font-weight: 600;
}

.empty-chat h1 {
  margin: 0;
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0;
}

.empty-chat p:last-child {
  margin: 12px 0 0;
  color: #a1a1aa;
  font-size: 15px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: min(760px, 100%);
  margin: 0 auto;
}

.message-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-row-user {
  align-items: flex-end;
}

.message-row-assistant {
  align-items: flex-start;
}

.message-meta {
  color: #a1a1aa;
  font-size: 12px;
  font-weight: 600;
}

.message-bubble {
  max-width: min(640px, 100%);
  padding: 12px 14px;
  border-radius: 18px;
  color: #f4f4f5;
  line-height: 1.55;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.message-row-user .message-bubble {
  background: #2f2f2f;
}

.message-row-assistant .message-bubble {
  padding-right: 0;
  padding-left: 0;
  background: transparent;
}

.streaming-status {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  width: fit-content;
  color: #a1a1aa;
  font-size: 13px;
}

.streaming-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #f4f4f5;
}

.composer-shell {
  width: min(760px, calc(100% - 40px));
  margin: 0 auto;
  padding: 12px 0 18px;
}

.composer-surface {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-height: 56px;
  padding: 8px;
  border: 1px solid #303030;
  border-radius: 28px;
  background: #242424;
}

.composer-input {
  width: 100%;
  min-height: 24px;
  max-height: 120px;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: #f4f4f5;
  line-height: 1.5;
}

.composer-input::placeholder {
  color: #a1a1aa;
}

.send-button {
  min-height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: #f4f4f5;
  color: #09090b;
  font-weight: 700;
}

.send-button:disabled {
  background: #3f3f46;
  color: #a1a1aa;
}

.composer-note {
  margin: 8px 0 0;
  color: #71717a;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 760px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .conversation-nav {
    display: none;
  }

  .chat-topbar {
    padding: 0 14px;
  }

  .chat-panel {
    padding: 18px 14px 10px;
  }

  .empty-chat h1 {
    font-size: 26px;
  }

  .composer-shell {
    width: calc(100% - 24px);
    padding-bottom: 12px;
  }

  .composer-surface {
    grid-template-columns: 32px minmax(0, 1fr) auto;
  }

  .send-button {
    padding: 0 12px;
  }
}
```

- [ ] **Step 5: Run focused frontend tests**

Run:

```bash
cd frontend
npm test -- --run src/components/ChatPanel.test.tsx src/components/Composer.test.tsx src/components/ConversationNav.test.tsx src/__tests__/App.test.tsx
```

Expected: PASS for all focused frontend tests.

- [ ] **Step 6: Run the frontend build**

Run:

```bash
cd frontend
npm run build
```

Expected: PASS with Vite producing a production build.

- [ ] **Step 7: Commit Task 4**

Run:

```bash
git add frontend/src/App.tsx frontend/src/styles/chatgpt.css frontend/src/__tests__/App.test.tsx
git commit -m "feat: integrate chatgpt-inspired frontend shell"
```

---

### Task 5: Manual Browser Verification And Polish Fixes

**Files:**
- Modify only if verification finds issues: `frontend/src/styles/chatgpt.css`
- Modify only if verification finds behavior issues: relevant file under `frontend/src/`

- [ ] **Step 1: Start the Vite dev server**

Run:

```bash
cd frontend
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 2: Open the app in a browser**

Open the local Vite URL from Step 1.

Expected: The empty state shows a dark ChatGPT-inspired shell with hidden mobile sidebar only on narrow screens.

- [ ] **Step 3: Verify desktop layout**

Use a desktop-width viewport around 1200px wide.

Expected:

- Sidebar is visible and about 260px wide.
- Main canvas is near-black.
- Top bar shows `MVP Chat` and `Local`.
- Empty state heading is centered and not inside a card.
- Composer is centered, rounded, and aligned with the chat timeline.
- Text does not overlap or overflow.

- [ ] **Step 4: Verify mobile layout**

Use a mobile-width viewport around 390px wide.

Expected:

- Sidebar is hidden.
- Main chat remains usable.
- Empty state heading fits on screen.
- Composer controls fit without horizontal scrolling.
- Send button text stays inside the button.

- [ ] **Step 5: Verify send interaction with the existing backend behavior**

Type `hello` into the composer and click `Send`.

Expected:

- User message appears immediately.
- Composer clears.
- Send button disables while the request is in flight.
- If the backend is unavailable, a readable assistant error message appears in the timeline.

- [ ] **Step 6: Apply only necessary polish fixes**

If desktop or mobile verification finds spacing, overflow, or contrast issues, adjust `frontend/src/styles/chatgpt.css` only. Keep fixes scoped to the observed issue.

Example CSS adjustment if the composer overflows on mobile:

```css
@media (max-width: 420px) {
  .composer-surface {
    grid-template-columns: 28px minmax(0, 1fr) auto;
    gap: 6px;
  }

  .send-button {
    min-height: 34px;
    padding: 0 10px;
  }
}
```

- [ ] **Step 7: Re-run verification commands**

Run:

```bash
cd frontend
npm test -- --run src/components/ChatPanel.test.tsx src/components/Composer.test.tsx src/components/ConversationNav.test.tsx src/__tests__/App.test.tsx
npm run build
```

Expected: PASS for tests and build.

- [ ] **Step 8: Commit verification polish**

If no files changed during manual verification, skip this commit and record that no polish fixes were needed in the final handoff.

If files changed, run:

```bash
git add frontend/src
git commit -m "fix: polish responsive chat layout"
```

---

## Final Verification

Run these commands before calling the implementation complete:

```bash
cd frontend
npm test -- --run
npm run build
```

Expected:

- Vitest test suite passes.
- Vite production build passes.

Then check repository status:

```bash
git --no-pager status --short
```

Expected: Only unrelated pre-existing changes remain. Do not revert unrelated files.

## Handoff Notes

- The redesign intentionally does not add icon packages. Text symbols are used where needed.
- The API client remains unchanged.
- Backend files remain unchanged.
- If implementation reveals that `created_at` is absent from create-conversation responses, keep the existing fallback in `ConversationNav` rather than changing the backend.
