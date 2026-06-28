export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}
