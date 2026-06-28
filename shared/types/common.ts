export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'completed'
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed'
