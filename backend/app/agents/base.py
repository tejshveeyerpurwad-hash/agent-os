from abc import ABC, abstractmethod
from typing import Any


class BaseAgent(ABC):
    def __init__(self, agent_id: str, name: str, model: str = "gpt-4"):
        self.agent_id = agent_id
        self.name = name
        self.model = model
        self.status = "idle"

    @abstractmethod
    async def execute(self, task: dict[str, Any]) -> dict[str, Any]:
        pass

    @abstractmethod
    async def validate(self, input_data: dict[str, Any]) -> bool:
        pass

    async def on_start(self) -> None:
        self.status = "running"

    async def on_complete(self) -> None:
        self.status = "completed"

    async def on_error(self, error: Exception) -> None:
        self.status = "error"
