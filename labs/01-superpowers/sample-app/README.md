# ChatGPT-style Agent App

React + FastAPI chat application with Azure OpenAI integration and SQLite persistence.

## Quick Start

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Backend runs on http://localhost:8000 with API docs at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173 by default.

## API Endpoints

- `GET /api/health` — health check
- `POST /api/conversations` — create conversation
- `GET /api/conversations` — list conversations
- `POST /api/chat/stream` — stream chat (SSE)
- `GET /api/conversations/{id}/messages` — fetch conversation messages

## Testing

**Backend:**
```bash
cd backend && uv run pytest tests/ -q
```

**Frontend:**
```bash
cd frontend && npm run test -- --run
```

## Architecture

- **Frontend:** React 19 + Vite with ChatGPT-like UI (sidebar, chat panel, composer)
- **Backend:** FastAPI with SSE streaming, SQLite persistence, stubbed agent service
- **Integration:** REST + SSE for streaming responses with persistence
