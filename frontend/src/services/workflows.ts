import api from './api'
import type { Workflow } from '@/types/workflow'

export const workflowService = {
  async list(): Promise<Workflow[]> {
    const { data } = await api.get('/workflows')
    return data
  },

  async get(id: string): Promise<Workflow> {
    const { data } = await api.get(`/workflows/${id}`)
    return data
  },

  async create(workflow: Partial<Workflow>): Promise<Workflow> {
    const { data } = await api.post('/workflows', workflow)
    return data
  },

  async update(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    const { data } = await api.patch(`/workflows/${id}`, workflow)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/workflows/${id}`)
  },

  async execute(id: string): Promise<void> {
    await api.post(`/workflows/${id}/execute`)
  },
}
