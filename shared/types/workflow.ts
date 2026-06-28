export interface WorkflowSpec {
  id: string
  name: string
  description: string
  steps: WorkflowStepSpec[]
}

export interface WorkflowStepSpec {
  id: string
  name: string
  agentId: string
  input: Record<string, unknown>
  dependsOn?: string[]
  timeout?: number
}

export interface WorkflowExecution {
  workflowId: string
  status: 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  steps: Record<string, StepExecution>
}

export interface StepExecution {
  status: 'pending' | 'running' | 'completed' | 'failed'
  output?: Record<string, unknown>
  error?: string
  startedAt?: string
  completedAt?: string
}
