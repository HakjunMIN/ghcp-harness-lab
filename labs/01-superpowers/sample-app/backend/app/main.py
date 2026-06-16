from datetime import UTC, datetime
import os

from fastapi import FastAPI, HTTPException

from app.models import (
    ConversationCreateRequest,
    ConversationsListResponse,
    HealthResponse,
    MessageCreateRequest,
    MessagesListResponse,
)
from app.repository import SqliteRepository


def now_iso() -> str:
    return datetime.now(UTC).isoformat()


app = FastAPI(title="chatgpt-style-agent-app")


def get_repository() -> SqliteRepository:
    repository = getattr(app.state, "repository", None)
    if repository is None:
        repository = SqliteRepository(os.getenv("APP_DB_PATH", "data/app.db"))
        app.state.repository = repository
    return repository


@app.get("/api/health", response_model=HealthResponse)
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/conversations", status_code=201)
def create_conversation(payload: ConversationCreateRequest) -> dict[str, str]:
    return get_repository().create_conversation(payload.title.strip() or "New Chat", now_iso())


@app.get("/api/conversations", response_model=ConversationsListResponse)
def list_conversations() -> dict[str, list[dict[str, str]]]:
    return {"items": get_repository().list_conversations()}


@app.post("/api/conversations/{conversation_id}/messages", status_code=201)
def add_message(conversation_id: str, payload: MessageCreateRequest) -> dict[str, str]:
    repository = get_repository()
    if repository.get_conversation(conversation_id) is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return repository.add_message(conversation_id, payload.role, payload.content, now_iso())


@app.get("/api/conversations/{conversation_id}/messages", response_model=MessagesListResponse)
def list_messages(conversation_id: str) -> dict[str, list[dict[str, str]]]:
    repository = get_repository()
    if repository.get_conversation(conversation_id) is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"items": repository.list_messages(conversation_id)}
