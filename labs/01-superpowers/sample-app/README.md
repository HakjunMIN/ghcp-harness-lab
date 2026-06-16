# ChatGPT-style Agent App

React + FastAPI chat application with Azure OpenAI integration and SQLite persistence.

## Quick Start

Run the backend and frontend in separate terminals. The Vite frontend proxies `/api` requests to the FastAPI backend on port 8000.

### Environment

The backend uses Microsoft Entra authentication through `DefaultAzureCredential`, not an API key. Sign in with Azure CLI before starting the backend:

```bash
az login
```

Set the Azure OpenAI endpoint and chat deployment used by the local service:

```bash
export AZURE_OPENAI_ENDPOINT="https://admin-me7tpdlm-eastus2.services.ai.azure.com"
export AZURE_OPENAI_CHAT_DEPLOYMENT="gpt-5.4"
```

Optional local SQLite path:

```bash
export APP_DB_PATH="../data/local-dev.db"
```

The signed-in Azure identity must have permission to call the Azure AI/OpenAI resource, for example a Cognitive Services/Azure AI user role that can invoke chat completions.

### Backend

```bash
cd backend
uv sync
AZURE_OPENAI_ENDPOINT="https://admin-me7tpdlm-eastus2.services.ai.azure.com" \
AZURE_OPENAI_CHAT_DEPLOYMENT="gpt-5.4" \
APP_DB_PATH="../data/local-dev.db" \
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Backend runs on http://127.0.0.1:8000 with API docs at http://127.0.0.1:8000/docs.

Verify the backend:

```bash
curl http://127.0.0.1:8000/api/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```

Frontend runs on http://127.0.0.1:5173 by default.

Verify the frontend-to-backend proxy:

```bash
curl http://127.0.0.1:5173/api/conversations
```

### Stop Services

Press `Ctrl+C` in each terminal running `uvicorn` or `vite`.

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

- **Frontend:** React 18 + Vite with ChatGPT-inspired UI (sidebar, chat panel, composer)
- **Backend:** FastAPI with SSE streaming, SQLite persistence, and Azure OpenAI chat completions
- **Integration:** REST + SSE for streaming responses with persistence
