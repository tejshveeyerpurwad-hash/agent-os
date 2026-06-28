export const APP_NAME = 'AgentOS'
export const APP_TAGLINE = 'AI Business Operating System'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  WORKSPACE: '/workspace',
  PLANNER: '/planner',
  AGENTS: '/agents',
  WORKFLOWS: '/workflows',
  KNOWLEDGE: '/knowledge',
  ANALYTICS: '/analytics',
  ACTIVITY: '/activity',
  CONVERSATIONS: '/conversations',
  CALENDAR: '/calendar',
  TEAM: '/team',
  SETTINGS: '/settings',
} as const

export const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Workspace', path: ROUTES.WORKSPACE, icon: 'Terminal' },
  { label: 'Planner', path: ROUTES.PLANNER, icon: 'BrainCircuit' },
  { label: 'AI Agents', path: ROUTES.AGENTS, icon: 'Bot' },
  { label: 'Workflows', path: ROUTES.WORKFLOWS, icon: 'Workflow' },
  { label: 'Knowledge', path: ROUTES.KNOWLEDGE, icon: 'BookOpen' },
  { label: 'Activity', path: ROUTES.ACTIVITY, icon: 'Activity' },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings' },
] as const

export const AGENT_STATUS = { IDLE: 'idle', RUNNING: 'running', PAUSED: 'paused', ERROR: 'error', COMPLETED: 'completed' } as const
export const WORKFLOW_STATUS = { DRAFT: 'draft', ACTIVE: 'active', PAUSED: 'paused', COMPLETED: 'completed', FAILED: 'failed' } as const
