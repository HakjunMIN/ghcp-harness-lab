import os
import json
import requests
from azure.identity import DefaultAzureCredential


class AgentService:
    def __init__(self):
        self.endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
        self.deployment = os.environ.get("AZURE_OPENAI_CHAT_DEPLOYMENT")
        if not self.endpoint or not self.deployment:
            raise ValueError("AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_CHAT_DEPLOYMENT env vars required")
        self.credential = DefaultAzureCredential()

    def stream_reply(self, message: str):
        """Stream tokens from Azure OpenAI using DefaultCredential."""
        try:
            token = self.credential.get_token("https://cognitiveservices.azure.com/.default").token
            
            url = f"{self.endpoint.rstrip('/')}/openai/deployments/{self.deployment}/chat/completions?api-version=2024-06-01"
            
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            }
            
            payload = {
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message},
                ],
                "stream": True,
            }
            if self.deployment.startswith("gpt-5"):
                payload["max_completion_tokens"] = 500
            else:
                payload["max_tokens"] = 500
            
            response = requests.post(url, headers=headers, json=payload, stream=True)
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    line = line.decode("utf-8")
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str.strip() == "[DONE]":
                            break
                        try:
                            data = json.loads(data_str)
                            if "choices" in data and len(data["choices"]) > 0:
                                delta = data["choices"][0].get("delta", {})
                                if "content" in delta:
                                    yield delta["content"]
                        except json.JSONDecodeError:
                            pass
        except Exception as e:
            yield f"[Error: {str(e)}]"


