export const APP_NAME = 'AgentOS'
export const APP_TAGLINE = 'AI Business Operating System'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AGENTS: '/agents',
  WORKFLOWS: '/workflows',
  KNOWLEDGE: '/knowledge',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Agents', path: ROUTES.AGENTS, icon: 'Bot' },
  { label: 'Workflows', path: ROUTES.WORKFLOWS, icon: 'Workflow' },
  { label: 'Knowledge', path: ROUTES.KNOWLEDGE, icon: 'Brain' },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: 'BarChart3' },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings' },
] as const

export const AGENT_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  ERROR: 'error',
  COMPLETED: 'completed',
} as const

export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const
