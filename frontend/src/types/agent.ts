export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'completed'

export interface Agent {
  id: string
  name: string
  role: string
  description: string
  status: AgentStatus
  model: string
  capabilities: string[]
  confidence: number
  currentTask: string | null
  lastAction: string
  taskCount: number
  successRate: number
  color: string
  icon: string
  createdAt: string
}

export interface AgentLog {
  id: string
  agentId: string
  level: 'info' | 'warn' | 'error'
  message: string
  timestamp: string
}
