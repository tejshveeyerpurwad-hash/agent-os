import asyncio
from typing import Any
from app.agents.manager import agent_manager


class WorkflowEngine:
    async def execute_workflow(self, workflow_id: str, steps: list[dict[str, Any]]) -> dict[str, Any]:
        results = {}

        for step in sorted(steps, key=lambda s: s.get("order", 0)):
            agent_id = step.get("agent_id")
            task_input = step.get("input_config", {})

            try:
                result = await agent_manager.execute_agent(agent_id, task_input)
                results[step["id"]] = {"status": "completed", "output": result}
            except Exception as e:
                results[step["id"]] = {"status": "failed", "error": str(e)}
                return {"workflow_id": workflow_id, "status": "failed", "steps": results}

        return {"workflow_id": workflow_id, "status": "completed", "steps": results}

    async def execute_parallel(self, steps: list[dict[str, Any]]) -> list[dict[str, Any]]:
        tasks = []
        for step in steps:
            tasks.append(agent_manager.execute_agent(step["agent_id"], step.get("input_config", {})))
        return await asyncio.gather(*tasks, return_exceptions=True)


workflow_engine = WorkflowEngine()
