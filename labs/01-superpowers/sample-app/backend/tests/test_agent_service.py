from app import agent_service


class FakeCredential:
    def get_token(self, _scope: str):
        return type("Token", (), {"token": "fake-token"})()


class FakeResponse:
    def raise_for_status(self):
        return None

    def iter_lines(self):
        yield b'data: {"choices":[{"delta":{"content":"Hello"}}]}'
        yield b"data: [DONE]"


def test_stream_reply_uses_gpt5_token_parameter(monkeypatch):
    captured_payloads = []

    def fake_post(_url, headers, json, stream):
        assert headers["Authorization"] == "Bearer fake-token"
        assert stream is True
        captured_payloads.append(json)
        return FakeResponse()

    monkeypatch.setenv("AZURE_OPENAI_ENDPOINT", "https://example.openai.azure.com")
    monkeypatch.setenv("AZURE_OPENAI_CHAT_DEPLOYMENT", "gpt-5.4")
    monkeypatch.setattr(agent_service, "DefaultAzureCredential", lambda: FakeCredential())
    monkeypatch.setattr(agent_service.requests, "post", fake_post)

    service = agent_service.AgentService()

    assert list(service.stream_reply("Hi")) == ["Hello"]
    assert len(captured_payloads) == 1
    payload = captured_payloads[0]
    assert "max_completion_tokens" in payload
    assert "max_tokens" not in payload