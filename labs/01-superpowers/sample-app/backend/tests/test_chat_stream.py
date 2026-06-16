from fastapi.testclient import TestClient

from app.main import app


def test_chat_stream_emits_delta_and_done():
    client = TestClient(app)

    response = client.post("/api/chat/stream", json={"message": "Say hi"})

    assert response.status_code == 200
    assert "event: delta" in response.text
    assert "event: done" in response.text
