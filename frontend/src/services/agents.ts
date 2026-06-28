import api from './api'
import type { Agent } from '@/types/agent'

export const agentService = {
  async list(): Promise<Agent[]> {
    const { data } = await api.get('/agents')
    return data
  },

  async get(id: string): Promise<Agent> {
    const { data } = await api.get(`/agents/${id}`)
    return data
  },

  async create(agent: Partial<Agent>): Promise<Agent> {
    const { data } = await api.post('/agents', agent)
    return data
  },

  async update(id: string, agent: Partial<Agent>): Promise<Agent> {
    const { data } = await api.patch(`/agents/${id}`, agent)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/agents/${id}`)
  },
}
