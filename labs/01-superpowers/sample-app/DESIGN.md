# ChatGPT-style App Design (MVP)

## Summary

Build an MVP chat application with a polished ChatGPT-like UI, Python backend,
`uv` workflow, Microsoft Agent Framework orchestration, and Azure OpenAI as the
LLM provider.

## Scope

### Goals

- ChatGPT-like single-page UX with sidebar + chat panel + composer.
- React + Vite frontend.
- FastAPI backend.
- Microsoft Agent Framework integration with a single agent.
- Streaming responses via SSE.
- SQLite-based conversation/message persistence.
- No authentication in MVP.

### Non-goals

- Multi-agent orchestration.
- OAuth/social login.
- Team collaboration, sharing, or admin console.
- Advanced RAG, plugins, billing, and analytics.

## Architecture

### Frontend

- React + Vite SPA.
- Main layout:
  - `conversation-nav` (left): conversation list, create/select conversation.
  - `chat-panel` (center): message timeline and streaming assistant bubble.
  - `composer` (bottom): prompt input, send, and stop generation.

### Backend

- FastAPI application exposing REST + SSE endpoints.
- Service boundaries:
  - API layer: request validation, response shaping, error mapping.
  - Agent service: Microsoft Agent Framework wrapper around single agent runs.
  - Repository layer: SQLite reads/writes for conversations and messages.

### AI Layer

- Agent Framework executes one configured agent per conversation turn.
- Agent calls Azure OpenAI.
- Streamed output tokens are relayed to frontend as SSE events.

## Components and Responsibilities

- `ui-shell`: theme, spacing, responsive structure.
- `conversation-nav`: list/search/switch/create conversations.
- `chat-panel`: render timeline, loading/stream states, auto-scroll behavior.
- `composer`: prompt validation, submit/abort interactions.
- `api-client`: HTTP + SSE abstraction, retry policy, normalized errors.
- `chat router`: endpoint handlers (`/api/chat/stream`, conversation APIs).
- `agent service`: run prompt through Agent Framework and emit deltas.
- `sqlite repository`: persist and query conversation/message entities.

## Data Flow

1. User submits prompt in `composer`.
2. Frontend creates optimistic user message and opens SSE stream.
3. Backend validates payload and stores user message in SQLite.
4. Agent service runs single Agent Framework flow against Azure OpenAI.
5. Backend emits SSE events: `delta`, `done`, `error`.
6. Frontend incrementally updates assistant message bubble.
7. On completion, backend stores final assistant message in SQLite.
8. Conversation list/history APIs hydrate UI on reload.

## API Surface (MVP)

- `POST /api/chat/stream` (SSE response)
  - Input: `conversation_id` (optional for new), `message`.
  - Events: `delta`, `done`, `error`.
- `GET /api/conversations`
- `POST /api/conversations`
- `GET /api/conversations/{id}/messages`

## Persistence Model

### `conversations`

- `id` (string/uuid)
- `title` (derived from first user prompt or fallback)
- `created_at`
- `updated_at`

### `messages`

- `id`
- `conversation_id`
- `role` (`user` | `assistant`)
- `content`
- `created_at`

## Error Handling

- Validation errors return 400 with clear, user-facing messages.
- Agent/Azure failures emit SSE `error` event and end stream gracefully.
- Stream interruption preserves received partial text in UI.
- Persistence failures are explicit; UI indicates when response was shown but
  save failed.
- Structured backend logging for traceability (without leaking secrets).

## Testing Strategy

- Backend unit tests: API handlers, repository ops, agent service boundaries.
- Backend integration tests: prompt → stream events → DB persistence path.
- Frontend tests: component state transitions for send/stream/error/retry.
- Minimal E2E: send prompt and verify streamed assistant completion rendered.
- Manual UX checks focused on ChatGPT-like polish:
  - keyboard flow,
  - streaming readability,
  - conversation switching,
  - responsive layout quality.

## Success Criteria (MVP)

- User can create/select conversations and send prompts.
- Assistant response streams in real time.
- Reload restores conversation history from SQLite.
- Core UX feels polished and close to ChatGPT interaction patterns.
