from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class ConversationCreateRequest(BaseModel):
    title: str = "New Chat"


class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str


class ConversationsListResponse(BaseModel):
    items: list[ConversationResponse]


class MessageCreateRequest(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatStreamRequest(BaseModel):
    message: str
    conversation_id: str | None = None


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: str


class MessagesListResponse(BaseModel):
    items: list[MessageResponse]
