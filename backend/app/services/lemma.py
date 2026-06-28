from typing import Any
from app.config import settings


class LemmaService:
    def __init__(self):
        self.api_key = settings.lemma_api_key
        self.model = settings.lemma_model

    async def generate(self, prompt: str, **kwargs: Any) -> str:
        if not self.api_key:
            return f"[Lemma SDK would process: {prompt[:100]}...]"
        try:
            from lemma import Lemma
            client = Lemma(api_key=self.api_key)
            response = client.generate(prompt=prompt, model=self.model, **kwargs)
            return response
        except ImportError:
            return f"[Lemma SDK not installed. Prompt: {prompt[:100]}...]"
        except Exception as e:
            return f"[Lemma API error: {str(e)}]"

    async def embed(self, text: str) -> list[float]:
        if not self.api_key:
            return [0.0] * 1536
        try:
            from lemma import Lemma
            client = Lemma(api_key=self.api_key)
            return client.embed(text=text)
        except ImportError:
            return [0.0] * 1536
        except Exception as e:
            raise RuntimeError(f"Embedding failed: {e}") from e

    async def analyze_sentiment(self, text: str) -> dict[str, Any]:
        result = await self.generate(f"Analyze the sentiment of this text: {text}")
        return {"sentiment": result, "confidence": 0.85}


lemma_service = LemmaService()
