class AgentService:
    def stream_reply(self, message: str):
        del message
        yield from ("Hello", ", ", "how can I help you?")
