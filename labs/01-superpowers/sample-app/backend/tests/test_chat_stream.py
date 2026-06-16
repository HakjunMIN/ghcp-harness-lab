from fastapi.testclient import TestClient

from app.main import app


def test_chat_stream_emits_delta_and_done():
    client = TestClient(app)

    response = client.post("/api/chat/stream", json={"message": "Say hi"})

    assert response.status_code == 200
    assert "event: delta" in response.text
    assert "event: done" in response.text


def test_missing_message_returns_422():
    client = TestClient(app)

    resp = client.post("/api/chat/stream", json={})
    # Pydantic validation should reject missing message with 422
    assert resp.status_code == 422


def test_stream_error():
    client = TestClient(app)

    # Mock agent_service to raise an error
    from unittest.mock import patch

    with patch(
        "app.main.agent_service.stream_reply", side_effect=Exception("Mock error")
    ):
        response = client.post("/api/chat/stream", json={"message": "Say hi"})
        assert response.status_code == 200
        assert "event: error" in response.text
        assert "Mock error" in response.text

