from datetime import datetime
from pydantic import BaseModel


class WorkflowStepCreate(BaseModel):
    name: str
    agent_id: str
    input_config: dict = {}
    order: int


class WorkflowCreate(BaseModel):
    name: str
    description: str | None = None
    steps: list[WorkflowStepCreate] = []


class WorkflowResponse(BaseModel):
    id: str
    name: str
    description: str | None
    status: str
    run_count: int
    created_at: datetime
    updated_at: datetime
    last_run_at: datetime | None

    model_config = {"from_attributes": True}
