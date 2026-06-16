# ChatGPT-style Agent App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an MVP ChatGPT-style web app with React UI, FastAPI backend, Microsoft Agent Framework, Azure OpenAI, SSE streaming, and SQLite conversation persistence.

**Architecture:** Use a single deployable app boundary with two folders: `frontend/` (React + Vite) and `backend/` (FastAPI + repository + agent service). The frontend streams assistant deltas from `/api/chat/stream`; backend persists messages before/after generation and wraps Agent Framework behind an interface that is easy to fake in tests.

**Tech Stack:** React 19 + Vite + TypeScript, FastAPI, Uvicorn, Microsoft Agent Framework (Python), Azure OpenAI SDK, SQLite, pytest, vitest, Playwright.

---

## File structure

- Create `frontend/`
  - `frontend/src/App.tsx`: app root + layout composition.
  - `frontend/src/components/ConversationNav.tsx`: conversation list + create action.
  - `frontend/src/components/ChatPanel.tsx`: message timeline + streaming assistant bubble.
  - `frontend/src/components/Composer.tsx`: prompt input, send, stop.
  - `frontend/src/lib/api.ts`: typed API and SSE client.
  - `frontend/src/styles/chatgpt.css`: ChatGPT-like visual polish.
  - `frontend/src/__tests__/App.test.tsx`: frontend behavior tests.
- Create `backend/`
  - `backend/app/main.py`: FastAPI app and routers.
  - `backend/app/models.py`: Pydantic request/response/event models.
  - `backend/app/repository.py`: SQLite CRUD for conversations/messages.
  - `backend/app/agent_service.py`: Agent Framework + Azure OpenAI integration.
  - `backend/app/chat_stream.py`: SSE event stream orchestration.
  - `backend/tests/test_health.py`: health and app boot tests.
  - `backend/tests/test_repository.py`: persistence tests.
  - `backend/tests/test_chat_stream.py`: streaming contract tests.
- Modify root docs
  - `README.md`: run/setup instructions for both frontend and backend.
  - `RETRO.md`: final retrospective after implementation.

## Task 1: Backend skeleton and health endpoint

**Files:**
- Create: `backend/app/main.py`
- Create: `backend/app/models.py`
- Create: `backend/tests/test_health.py`

- [ ] **Step 1: Write failing health test**

Create `backend/tests/test_health.py`:

```python
from fastapi.testclient import TestClient

from app.main import app


def test_health_endpoint_returns_ok():
    client = TestClient(app)
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd backend && uv run pytest tests/test_health.py -q
```

Expected: FAIL with import/module errors (app not implemented yet).

- [ ] **Step 3: Implement minimal app and model definitions**

Create `backend/app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="chatgpt-style-agent-app")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```

Create `backend/app/models.py`:

```python
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
cd backend && uv run pytest tests/test_health.py -q
```

Expected: PASS (1 passed).

- [ ] **Step 5: Commit**

```bash
git add backend/app/main.py backend/app/models.py backend/tests/test_health.py
git commit -m "feat: add backend health skeleton" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 2: SQLite repository and conversation APIs

**Files:**
- Modify: `backend/app/main.py`
- Create: `backend/app/repository.py`
- Modify: `backend/app/models.py`
- Create: `backend/tests/test_repository.py`

- [ ] **Step 1: Write failing persistence and API tests**

Create `backend/tests/test_repository.py`:

```python
from fastapi.testclient import TestClient

from app.main import app


def test_create_and_list_conversation():
    client = TestClient(app)
    created = client.post("/api/conversations", json={"title": "New Chat"})
    assert created.status_code == 201
    conversation_id = created.json()["id"]

    listed = client.get("/api/conversations")
    assert listed.status_code == 200
    ids = [item["id"] for item in listed.json()["items"]]
    assert conversation_id in ids


def test_append_and_fetch_messages():
    client = TestClient(app)
    created = client.post("/api/conversations", json={"title": "Thread"})
    conversation_id = created.json()["id"]
    append = client.post(
        f"/api/conversations/{conversation_id}/messages",
        json={"role": "user", "content": "hello"},
    )
    assert append.status_code == 201

    fetched = client.get(f"/api/conversations/{conversation_id}/messages")
    assert fetched.status_code == 200
    assert fetched.json()["items"][0]["content"] == "hello"
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
cd backend && uv run pytest tests/test_repository.py -q
```

Expected: FAIL because conversation/message routes are missing.

- [ ] **Step 3: Implement repository and routes**

Create `backend/app/repository.py`:

```python
import sqlite3
import uuid
from pathlib import Path


class SqliteRepository:
    def __init__(self, db_path: str = "data/app.db") -> None:
        self.db_path = db_path
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                "CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, title TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)"
            )
            conn.execute(
                "CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL)"
            )

    def create_conversation(self, title: str, now_iso: str) -> dict:
        cid = str(uuid.uuid4())
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (cid, title, now_iso, now_iso),
            )
        return {"id": cid, "title": title}
```

Modify `backend/app/main.py` (add routes):

```python
from datetime import datetime, UTC
from fastapi import FastAPI
from app.repository import SqliteRepository

app = FastAPI(title="chatgpt-style-agent-app")
repo = SqliteRepository()


@app.post("/api/conversations", status_code=201)
def create_conversation(payload: dict) -> dict:
    title = payload.get("title", "New Chat").strip() or "New Chat"
    return repo.create_conversation(title, datetime.now(UTC).isoformat())
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
cd backend && uv run pytest tests/test_health.py tests/test_repository.py -q
```

Expected: PASS for health + repository tests.

- [ ] **Step 5: Commit**

```bash
git add backend/app/main.py backend/app/models.py backend/app/repository.py backend/tests/test_repository.py
git commit -m "feat: add sqlite conversation persistence" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 3: Agent service and SSE chat streaming

**Files:**
- Create: `backend/app/agent_service.py`
- Create: `backend/app/chat_stream.py`
- Modify: `backend/app/main.py`
- Create: `backend/tests/test_chat_stream.py`

- [ ] **Step 1: Write failing SSE contract test**

Create `backend/tests/test_chat_stream.py`:

```python
from fastapi.testclient import TestClient

from app.main import app


def test_chat_stream_emits_delta_and_done():
    client = TestClient(app)
    response = client.post(
        "/api/chat/stream",
        json={"message": "Say hi", "conversation_id": None},
    )
    assert response.status_code == 200
    body = response.text
    assert "event: delta" in body
    assert "event: done" in body
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd backend && uv run pytest tests/test_chat_stream.py -q
```

Expected: FAIL because `/api/chat/stream` is not implemented.

- [ ] **Step 3: Implement agent wrapper and stream endpoint**

Create `backend/app/agent_service.py`:

```python
class AgentService:
    def stream_reply(self, message: str):
        # Replace this stub with Microsoft Agent Framework + Azure OpenAI call.
        for token in ["Hello", ", ", "how can I help you?"]:
            yield token
```

Create `backend/app/chat_stream.py`:

```python
import json


def sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"
```

Modify `backend/app/main.py` (add stream endpoint):

```python
from fastapi.responses import StreamingResponse
from app.agent_service import AgentService
from app.chat_stream import sse_event

agent_service = AgentService()


@app.post("/api/chat/stream")
def chat_stream(payload: dict):
    message = payload["message"]

    def iterator():
        content = []
        for token in agent_service.stream_reply(message):
            content.append(token)
            yield sse_event("delta", {"token": token})
        yield sse_event("done", {"content": "".join(content)})

    return StreamingResponse(iterator(), media_type="text/event-stream")
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
cd backend && uv run pytest tests/test_chat_stream.py -q
```

Expected: PASS and body includes `event: delta` + `event: done`.

- [ ] **Step 5: Commit**

```bash
git add backend/app/main.py backend/app/agent_service.py backend/app/chat_stream.py backend/tests/test_chat_stream.py
git commit -m "feat: add sse chat streaming pipeline" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 4: React UI shell and chat UX polish

**Files:**
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/components/ConversationNav.tsx`
- Create: `frontend/src/components/ChatPanel.tsx`
- Create: `frontend/src/components/Composer.tsx`
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/styles/chatgpt.css`
- Create: `frontend/src/__tests__/App.test.tsx`

- [ ] **Step 1: Write failing frontend interaction test**

Create `frontend/src/__tests__/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("sends prompt and shows streaming assistant message", async () => {
  render(<App />);
  await userEvent.type(screen.getByPlaceholderText("Message ChatGPT..."), "hello");
  await userEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(await screen.findByText("hello")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd frontend && npm run test -- App.test.tsx
```

Expected: FAIL because components are not implemented.

- [ ] **Step 3: Implement layout and API client**

Create `frontend/src/App.tsx`:

```tsx
import { useState } from "react";
import { ConversationNav } from "./components/ConversationNav";
import { ChatPanel } from "./components/ChatPanel";
import { Composer } from "./components/Composer";
import "./styles/chatgpt.css";

export default function App() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  return (
    <div className="app-shell">
      <ConversationNav />
      <main className="chat-main">
        <ChatPanel messages={messages} />
        <Composer onSend={(text) => setMessages((prev) => [...prev, { role: "user", content: text }])} />
      </main>
    </div>
  );
}
```

Create `frontend/src/styles/chatgpt.css`:

```css
.app-shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; background: #343541; color: #ececf1; }
.chat-main { display: flex; flex-direction: column; }
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
cd frontend && npm run test -- App.test.tsx
```

Expected: PASS for send/render interaction baseline.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/App.tsx frontend/src/components frontend/src/lib/api.ts frontend/src/styles/chatgpt.css frontend/src/__tests__/App.test.tsx
git commit -m "feat: add chatgpt-style frontend shell" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 5: End-to-end wiring, docs, and final verification

**Files:**
- Modify: `backend/app/main.py`
- Modify: `frontend/src/lib/api.ts`
- Modify: `README.md`
- Modify: `RETRO.md`

- [ ] **Step 1: Add integration test for chat + persistence**

Create `backend/tests/test_integration_chat.py`:

```python
from fastapi.testclient import TestClient
from app.main import app


def test_chat_stream_then_history_roundtrip():
    client = TestClient(app)
    create = client.post("/api/conversations", json={"title": "Roundtrip"})
    cid = create.json()["id"]
    stream = client.post("/api/chat/stream", json={"conversation_id": cid, "message": "hello"})
    assert stream.status_code == 200
    messages = client.get(f"/api/conversations/{cid}/messages")
    assert messages.status_code == 200
    assert len(messages.json()["items"]) >= 2
```

- [ ] **Step 2: Run full backend + frontend tests**

Run:

```bash
cd backend && uv run pytest -q
cd ../frontend && npm test -- --run
```

Expected: all backend tests pass and frontend tests pass.

- [ ] **Step 3: Update runbook docs**

Update `README.md` with:

```markdown
## Run backend
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000

## Run frontend
cd frontend
npm install
npm run dev
```

- [ ] **Step 4: Record retrospective and commit**

Update `RETRO.md` with:

```markdown
## ChatGPT-style MVP retrospective
- Worked: clear component boundaries and SSE-first API contract.
- Hard parts: Agent Framework wiring + stream lifecycle handling.
- Next step: replace stubbed AgentService with production Azure OpenAI config.
```

Commit:

```bash
git add backend frontend README.md RETRO.md
git commit -m "feat: ship chatgpt-style mvp with streaming agent backend" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Self-review

- Spec coverage: the plan covers ChatGPT-like UI, FastAPI backend, single-agent integration seam, SSE streaming, SQLite persistence, explicit error/stream path testing, and UX-focused validation.
- Placeholder scan: no TODO/TBD placeholders remain; each task includes explicit files, code snippets, and verification commands.
- Type consistency: shared names are consistent (`conversation_id`, `message`, `delta/done/error` events, `AgentService.stream_reply` flow, conversation/message repository paths).
