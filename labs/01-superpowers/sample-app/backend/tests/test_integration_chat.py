"""Integration test: chat + persistence roundtrip."""

from fastapi.testclient import TestClient

from app.main import app


def test_chat_stream_then_history_roundtrip():
    """Create conversation, stream message, verify persistence."""
    client = TestClient(app)

    # Create conversation
    create = client.post("/api/conversations", json={"title": "Integration Test"})
    assert create.status_code == 201
    cid = create.json()["id"]

    # Stream chat
    stream = client.post("/api/chat/stream", json={"conversation_id": cid, "message": "hello"})
    assert stream.status_code == 200
    assert "event: delta" in stream.text
    assert "event: done" in stream.text

    # Verify messages persisted
    messages = client.get(f"/api/conversations/{cid}/messages")
    assert messages.status_code == 200
    items = messages.json()["items"]
    assert len(items) >= 2, f"Expected at least 2 messages, got {len(items)}"
    # First message is user, last should be assistant
    assert items[0]["role"] == "user"
    assert items[-1]["role"] == "assistant"
