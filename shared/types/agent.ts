export interface AgentSpec {
  id: string
  name: string
  description: string
  model: string
  capabilities: string[]
  config: Record<string, unknown>
}

export interface AgentTask {
  id: string
  agentId: string
  input: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export interface AgentResult {
  taskId: string
  agentId: string
  output: Record<string, unknown>
  status: 'success' | 'error'
  duration: number
  error?: string
}
