import { create } from 'zustand'
import type { ActivityEvent } from '@/types/execution'

interface ActivityState {
  events: ActivityEvent[]
  unreadCount: number
}

interface ActivityActions {
  addEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void
  addSystemEvent: (action: string, detail: string) => void
  markAllRead: () => void
  getByExecution: (executionId: string) => ActivityEvent[]
  getByAgent: (agentId: string) => ActivityEvent[]
  clear: () => void
}

let eventCounter = 0

export const useActivityStore = create<ActivityState & ActivityActions>((set, get) => ({
  events: [
    { id: 'evt-1', type: 'system', action: 'System initialized', detail: 'AgentOS v3.0 started successfully. All 8 agents online.', timestamp: new Date(Date.now() - 300000).toISOString(), severity: 'success' },
    { id: 'evt-2', type: 'agent', action: 'FinanceAgent approved budget', detail: 'Q3 marketing budget of $240,000 approved and allocated.', agentId: 'agent-finance', timestamp: new Date(Date.now() - 240000).toISOString(), severity: 'success' },
    { id: 'evt-3', type: 'agent', action: 'HRBot shortlisted candidates', detail: '14 candidates shortlisted for Senior Engineer position. First-round interviews scheduled.', agentId: 'agent-hr', timestamp: new Date(Date.now() - 180000).toISOString(), severity: 'info' },
    { id: 'evt-4', type: 'workflow', action: 'Campaign workflow started', detail: 'Q3 Marketing Campaign workflow initialized. MarketGenius assigned.', agentId: 'agent-marketing', timestamp: new Date(Date.now() - 120000).toISOString(), severity: 'info' },
    { id: 'evt-5', type: 'agent', action: 'SupportBot resolved tickets', detail: '26 support tickets resolved in the last hour. 94% satisfaction rate.', agentId: 'agent-support', timestamp: new Date(Date.now() - 60000).toISOString(), severity: 'success' },
    { id: 'evt-6', type: 'agent', action: 'SalesPro closed deal', detail: 'Enterprise deal closed with TechCorp. ARR: $85,000. Contract signed.', agentId: 'agent-sales', timestamp: new Date(Date.now() - 30000).toISOString(), severity: 'success' },
  ],
  unreadCount: 3,

  addEvent: (event) => {
    eventCounter++
    const newEvent: ActivityEvent = {
      ...event,
      id: `evt-${Date.now()}-${eventCounter}`,
      timestamp: new Date().toISOString(),
    }
    set(state => ({
      events: [newEvent, ...state.events].slice(0, 200),
      unreadCount: state.unreadCount + 1,
    }))
  },

  addSystemEvent: (action, detail) => {
    get().addEvent({ type: 'system', action, detail, severity: 'info' })
  },

  markAllRead: () => set({ unreadCount: 0 }),

  getByExecution: (executionId) => get().events.filter(e => e.executionId === executionId),

  getByAgent: (agentId) => get().events.filter(e => e.agentId === agentId),

  clear: () => set({ events: [], unreadCount: 0 }),
}))
