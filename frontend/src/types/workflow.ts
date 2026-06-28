export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed'

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  steps: WorkflowStep[]
  createdAt: string
  updatedAt: string
  lastRunAt: string | null
  runCount: number
}

export interface WorkflowStep {
  id: string
  name: string
  agentId: string
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  status: 'pending' | 'running' | 'completed' | 'failed'
  order: number
}

export interface WorkflowRun {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt: string | null
  steps: WorkflowStep[]
}
