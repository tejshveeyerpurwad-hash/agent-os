from typing import Any


class WorkflowDefinition:
    def __init__(self, workflow_id: str, name: str, description: str | None = None):
        self.workflow_id = workflow_id
        self.name = name
        self.description = description
        self.steps: list[dict[str, Any]] = []

    def add_step(self, step: dict[str, Any]) -> None:
        self.steps.append(step)

    def to_dict(self) -> dict[str, Any]:
        return {
            "workflow_id": self.workflow_id,
            "name": self.name,
            "description": self.description,
            "steps": self.steps,
        }
