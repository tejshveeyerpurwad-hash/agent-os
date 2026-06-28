from datetime import datetime
from pydantic import BaseModel


class AgentCreate(BaseModel):
    name: str
    description: str | None = None
    model: str = "gpt-4"
    capabilities: list[str] = []
    temperature: float = 0.7
    max_tokens: int = 4096
    system_prompt: str | None = None


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    model: str | None = None
    status: str | None = None
    capabilities: list[str] | None = None
    temperature: float | None = None
    max_tokens: int | None = None
    system_prompt: str | None = None


class AgentResponse(BaseModel):
    id: str
    name: str
    description: str | None
    model: str
    status: str
    capabilities: list[str]
    temperature: float
    max_tokens: int
    task_count: int
    success_rate: float
    created_at: datetime
    updated_at: datetime
    last_run_at: datetime | None

    model_config = {"from_attributes": True}
