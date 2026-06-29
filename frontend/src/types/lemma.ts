export interface LemmaHealthStatus {
  status: 'connected' | 'disconnected' | 'error'
  apiUrl: string
  podId: string | null
  lastChecked: string
  latency: number
  error?: string
}

export interface LemmaExecutionLog {
  id: string
  type: 'agent_run' | 'workflow_run' | 'function_run' | 'datastore_query' | 'document_search'
  status: 'running' | 'completed' | 'failed'
  name: string
  input?: string
  output?: string
  startedAt: string
  completedAt: string | null
  duration: number | null
  error?: string
}

export interface LemmaAgentInfo {
  name: string
  description: string | null
  instruction: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  runCount: number
}

export interface LemmaWorkflowInfo {
  name: string
  description: string | null
  isActive: boolean
  nodeCount: number
  createdAt: string
  updatedAt: string
  runCount: number
}

export interface LemmaFunctionInfo {
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  runCount: number
}

export interface LemmaTableInfo {
  name: string
  columnCount: number
  recordCount: number
  createdAt: string
}

export interface LemmaFileInfo {
  name: string
  path: string
  size: number
  createdAt: string
  updatedAt: string
}
