from typing import Any
from app.agents.base import BaseAgent


class AgentManager:
    _agents: dict[str, BaseAgent] = {}

    def register(self, agent: BaseAgent) -> None:
        self._agents[agent.agent_id] = agent

    def unregister(self, agent_id: str) -> None:
        self._agents.pop(agent_id, None)

    def get(self, agent_id: str) -> BaseAgent | None:
        return self._agents.get(agent_id)

    async def execute_agent(self, agent_id: str, task: dict[str, Any]) -> dict[str, Any]:
        agent = self.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        return await agent.execute(task)


agent_manager = AgentManager()
