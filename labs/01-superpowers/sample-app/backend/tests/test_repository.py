from fastapi.testclient import TestClient

from app.main import app
from app.repository import SqliteRepository


def test_create_and_list_conversation(tmp_path):
    app.state.repository = SqliteRepository(str(tmp_path / "app.db"))
    client = TestClient(app)

    created = client.post("/api/conversations", json={"title": "New Chat"})
    assert created.status_code == 201
    conversation_id = created.json()["id"]

    listed = client.get("/api/conversations")
    assert listed.status_code == 200
    ids = [item["id"] for item in listed.json()["items"]]
    assert conversation_id in ids


def test_append_and_fetch_messages(tmp_path):
    app.state.repository = SqliteRepository(str(tmp_path / "app.db"))
    client = TestClient(app)

    created = client.post("/api/conversations", json={"title": "Thread"})
    conversation_id = created.json()["id"]

    first = client.post(
        f"/api/conversations/{conversation_id}/messages",
        json={"role": "user", "content": "hello"},
    )
    assert first.status_code == 201

    second = client.post(
        f"/api/conversations/{conversation_id}/messages",
        json={"role": "assistant", "content": "hi there"},
    )
    assert second.status_code == 201

    fetched = client.get(f"/api/conversations/{conversation_id}/messages")
    assert fetched.status_code == 200
    assert [item["content"] for item in fetched.json()["items"]] == ["hello", "hi there"]


def test_invalid_role_rejected(tmp_path):
    app.state.repository = SqliteRepository(str(tmp_path / "app.db"))
    client = TestClient(app)

    created = client.post("/api/conversations", json={"title": "Thread 2"})
    conversation_id = created.json()["id"]

    resp = client.post(
        f"/api/conversations/{conversation_id}/messages",
        json={"role": "invalid", "content": "bad"},
    )
    # Pydantic validation should reject invalid role values with 422
    assert resp.status_code == 422
