export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'completed'

export interface Agent {
  id: string
  name: string
  description: string
  status: AgentStatus
  model: string
  capabilities: string[]
  createdAt: string
  updatedAt: string
  lastRunAt: string | null
  taskCount: number
  successRate: number
}

export interface AgentConfig {
  temperature: number
  maxTokens: number
  systemPrompt: string
  tools: string[]
}

export interface AgentLog {
  id: string
  agentId: string
  level: 'info' | 'warn' | 'error'
  message: string
  timestamp: string
}
