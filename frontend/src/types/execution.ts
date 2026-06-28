export type ExecutionPhase =
  | 'idle'
  | 'planning'
  | 'decomposing'
  | 'assigning_agents'
  | 'executing'
  | 'querying_knowledge'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'

export interface Subtask {
  id: string
  description: string
  agentId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'awaiting_approval'
  dependsOn: string[]
  result: string | null
  knowledgeQueries: string[]
  startedAt: string | null
  completedAt: string | null
}

export interface ExecutionPlan {
  objective: string
  reasoning: string[]
  subtasks: Subtask[]
  dependencies: { from: string; to: string }[]
  createdAt: string
}

export interface Execution {
  id: string
  objective: string
  phase: ExecutionPhase
  plan: ExecutionPlan | null
  currentTaskId: string | null
  createdAt: string
  completedAt: string | null
  result: string | null
  error: string | null
  history: { phase: ExecutionPhase; timestamp: string; detail: string }[]
}

export interface Approval {
  id: string
  executionId: string
  subtaskId: string
  title: string
  description: string
  amount?: string
  urgency: 'high' | 'medium' | 'low'
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  resolvedAt: string | null
}

export type KnowledgeItemType =
  | 'document'
  | 'policy'
  | 'employee'
  | 'customer'
  | 'project'
  | 'invoice'
  | 'contract'
  | 'note'

export interface KnowledgeItem {
  id: string
  type: KnowledgeItemType
  title: string
  content: string
  tags: string[]
  relatedIds: string[]
  createdAt: string
  updatedAt: string
  metadata: Record<string, string>
}

export interface ActivityEvent {
  id: string
  type: 'execution' | 'agent' | 'knowledge' | 'workflow' | 'approval' | 'system'
  action: string
  detail: string
  agentId?: string
  executionId?: string
  timestamp: string
  severity: 'info' | 'success' | 'warning' | 'error'
}

export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  triggers: string[]  // keywords that trigger this workflow
  steps: WorkflowDefStep[]
  createdAt: string
  updatedAt: string
  runCount: number
  lastRunAt: string | null
}

export interface WorkflowDefStep {
  id: string
  name: string
  agentId: string
  inputTemplate: string
  requiresApproval: boolean
  dependsOn: string[]
  order: number
}

export interface WorkflowRun {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt: string | null
  steps: { stepId: string; status: 'pending' | 'running' | 'completed' | 'failed'; output: string | null }[]
}
