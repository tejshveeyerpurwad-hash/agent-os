import { create } from 'zustand'
import { LemmaClient } from 'lemma-sdk'
import type { LemmaConfig } from 'lemma-sdk'
import { useActivityStore } from './activityStore'
import type {
  LemmaHealthStatus,
  LemmaExecutionLog,
  LemmaAgentInfo,
  LemmaWorkflowInfo,
  LemmaFunctionInfo,
  LemmaTableInfo,
  LemmaFileInfo,
} from '@/types/lemma'

const LEMMA_CONFIG: Partial<LemmaConfig> = {
  apiUrl: import.meta.env.VITE_LEMMA_API_URL || 'https://api.lemma.work',
  authUrl: import.meta.env.VITE_LEMMA_AUTH_URL || 'https://lemma.work/auth',
  podId: import.meta.env.VITE_LEMMA_POD_ID || undefined,
  timeoutMs: 30000,
  maxRetries: 2,
}

export interface LemmaState {
  client: LemmaClient | null
  initialized: boolean
  health: LemmaHealthStatus
  agents: LemmaAgentInfo[]
  workflows: LemmaWorkflowInfo[]
  functions: LemmaFunctionInfo[]
  tables: LemmaTableInfo[]
  files: LemmaFileInfo[]
  executionLogs: LemmaExecutionLog[]
  isConnecting: boolean
}

interface LemmaActions {
  initialize: () => Promise<void>
  checkHealth: () => Promise<LemmaHealthStatus>
  listAgents: () => Promise<LemmaAgentInfo[]>
  listWorkflows: () => Promise<LemmaWorkflowInfo[]>
  listFunctions: () => Promise<LemmaFunctionInfo[]>
  listTables: () => Promise<LemmaTableInfo[]>
  listFiles: () => Promise<LemmaFileInfo[]>
  runAgent: (name: string, message: string) => Promise<string | null>
  runWorkflow: (name: string) => Promise<string | null>
  runFunction: (name: string, input?: Record<string, unknown>) => Promise<string | null>
  queryDatastore: (query: string) => Promise<Record<string, unknown>[]>
  searchDocuments: (query: string) => Promise<LemmaFileInfo[]>
  addExecutionLog: (log: LemmaExecutionLog) => void
  clearLogs: () => void
  setPodId: (podId: string) => void
}

function lemmaError(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err)
}

export const useLemmaStore = create<LemmaState & LemmaActions>((set, get) => ({
  client: null,
  initialized: false,
  health: {
    status: 'disconnected',
    apiUrl: LEMMA_CONFIG.apiUrl || '',
    podId: LEMMA_CONFIG.podId || null,
    lastChecked: new Date().toISOString(),
    latency: 0,
  },
  agents: [],
  workflows: [],
  functions: [],
  tables: [],
  files: [],
  executionLogs: [],
  isConnecting: false,

  initialize: async () => {
    if (get().initialized) return
    set({ isConnecting: true })
    try {
      const client = new LemmaClient(LEMMA_CONFIG)
      await client.initialize()
      set({ client, initialized: true, isConnecting: false })
      useActivityStore.getState().addSystemEvent('Lemma SDK initialized', 'Lemma client connected successfully')
      await get().checkHealth()
    } catch (err) {
      set({ isConnecting: false })
      useActivityStore.getState().addEvent({
        type: 'system',
        action: 'Lemma SDK initialization failed',
        detail: lemmaError(err),
        severity: 'warning',
      })
    }
  },

  checkHealth: async () => {
    const start = performance.now()
    const client = get().client
    try {
      if (client) {
        await client.request('GET', '/health')
      }
      const latency = Math.round(performance.now() - start)
      const health: LemmaHealthStatus = {
        status: 'connected',
        apiUrl: LEMMA_CONFIG.apiUrl || '',
        podId: LEMMA_CONFIG.podId || null,
        lastChecked: new Date().toISOString(),
        latency,
      }
      set({ health })
      return health
    } catch (err) {
      const health: LemmaHealthStatus = {
        status: 'error',
        apiUrl: LEMMA_CONFIG.apiUrl || '',
        podId: LEMMA_CONFIG.podId || null,
        lastChecked: new Date().toISOString(),
        latency: Math.round(performance.now() - start),
        error: lemmaError(err),
      }
      set({ health })
      return health
    }
  },

  listAgents: async () => {
    const client = get().client
    if (!client) return get().agents
    try {
      const res = await client.agents.list()
      const items = (res.items || []).map((a: Record<string, unknown>) => ({
        name: String(a.name || ''),
        description: a.description ? String(a.description) : null,
        instruction: String(a.instruction || ''),
        status: (a.visibility === 'published' ? 'active' : 'inactive') as 'active' | 'inactive',
        createdAt: String(a.created_at || new Date().toISOString()),
        updatedAt: String(a.updated_at || new Date().toISOString()),
        runCount: 0,
      }))
      set({ agents: items })
      return items
    } catch {
      return get().agents
    }
  },

  listWorkflows: async () => {
    const client = get().client
    if (!client) return get().workflows
    try {
      const res = await client.workflows.list()
      const items = (res.items || []).map((w: Record<string, unknown>) => ({
        name: String(w.name || ''),
        description: w.description ? String(w.description) : null,
        isActive: w.is_active === true,
        nodeCount: (w.nodes as unknown[])?.length || 0,
        createdAt: String(w.created_at || new Date().toISOString()),
        updatedAt: String(w.updated_at || new Date().toISOString()),
        runCount: 0,
      }))
      set({ workflows: items })
      return items
    } catch {
      return get().workflows
    }
  },

  listFunctions: async () => {
    const client = get().client
    if (!client) return get().functions
    try {
      const res = await client.functions.list()
      const items = (res.items || []).map((f: Record<string, unknown>) => ({
        name: String(f.name || ''),
        description: f.description ? String(f.description) : null,
        createdAt: String(f.created_at || new Date().toISOString()),
        updatedAt: String(f.updated_at || new Date().toISOString()),
        runCount: 0,
      }))
      set({ functions: items })
      return items
    } catch {
      return get().functions
    }
  },

  listTables: async () => {
    const client = get().client
    if (!client) return get().tables
    try {
      const res = await client.tables.list()
      const items = (res.items || []).map((t: Record<string, unknown>) => ({
        name: String(t.name || ''),
        columnCount: (t.columns as unknown[])?.length || 0,
        recordCount: 0,
        createdAt: String(t.created_at || new Date().toISOString()),
      }))
      set({ tables: items })
      return items
    } catch {
      return get().tables
    }
  },

  listFiles: async () => {
    const client = get().client
    if (!client) return get().files
    try {
      const res = await client.files.list()
      const items = (res.items || []).map((f: Record<string, unknown>) => ({
        name: String(f.name || ''),
        path: String(f.path || ''),
        size: Number(f.size || 0),
        createdAt: String(f.created_at || new Date().toISOString()),
        updatedAt: String(f.updated_at || new Date().toISOString()),
      }))
      set({ files: items })
      return items
    } catch {
      return get().files
    }
  },

  runAgent: async (name, message) => {
    const client = get().client
    if (!client) return null
    const logId = `lemma-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const log: LemmaExecutionLog = {
      id: logId,
      type: 'agent_run',
      status: 'running',
      name,
      input: message,
      startedAt: new Date().toISOString(),
      completedAt: null,
      duration: null,
    }
    get().addExecutionLog(log)
    try {
      const result = await client.agents.run(name, message)
      const output = result instanceof ReadableStream ? 'Streaming response' : JSON.stringify(result, null, 2)
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'completed', output, completedAt: new Date().toISOString(), duration: 0 } : l
        ),
      }))
      useActivityStore.getState().addEvent({
        type: 'agent',
        action: `Lemma agent "${name}" executed`,
        detail: typeof message === 'string' ? message : JSON.stringify(message),
        severity: 'success',
      })
      return output
    } catch (err) {
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'failed', error: lemmaError(err), completedAt: new Date().toISOString() } : l
        ),
      }))
      return null
    }
  },

  runWorkflow: async (name) => {
    const client = get().client
    if (!client) return null
    const logId = `lemma-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const log: LemmaExecutionLog = {
      id: logId,
      type: 'workflow_run',
      status: 'running',
      name,
      startedAt: new Date().toISOString(),
      completedAt: null,
      duration: null,
    }
    get().addExecutionLog(log)
    try {
      const result = await client.workflows.runs.create(name)
      const output = JSON.stringify(result, null, 2)
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'completed', output, completedAt: new Date().toISOString(), duration: 0 } : l
        ),
      }))
      useActivityStore.getState().addEvent({
        type: 'workflow',
        action: `Lemma workflow "${name}" started`,
        detail: `Workflow run created`,
        severity: 'success',
      })
      return output
    } catch (err) {
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'failed', error: lemmaError(err), completedAt: new Date().toISOString() } : l
        ),
      }))
      return null
    }
  },

  runFunction: async (name, input) => {
    const client = get().client
    if (!client) return null
    const logId = `lemma-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const log: LemmaExecutionLog = {
      id: logId,
      type: 'function_run',
      status: 'running',
      name,
      input: input ? JSON.stringify(input) : undefined,
      startedAt: new Date().toISOString(),
      completedAt: null,
      duration: null,
    }
    get().addExecutionLog(log)
    try {
      const result = await client.functions.run(name, { input })
      const output = JSON.stringify(result, null, 2)
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'completed', output, completedAt: new Date().toISOString(), duration: 0 } : l
        ),
      }))
      useActivityStore.getState().addEvent({
        type: 'agent',
        action: `Lemma function "${name}" executed`,
        detail: input ? JSON.stringify(input) : '',
        severity: 'success',
      })
      return output
    } catch (err) {
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'failed', error: lemmaError(err), completedAt: new Date().toISOString() } : l
        ),
      }))
      return null
    }
  },

  queryDatastore: async (query): Promise<Record<string, unknown>[]> => {
    const client = get().client
    if (!client) return []
    const logId = `lemma-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const log: LemmaExecutionLog = {
      id: logId,
      type: 'datastore_query',
      status: 'running',
      name: 'datastore.query',
      input: query,
      startedAt: new Date().toISOString(),
      completedAt: null,
      duration: null,
    }
    get().addExecutionLog(log)
    try {
      const result = await client.datastore.query(query)
      const resultAny = result as Record<string, unknown>
      const records: Record<string, unknown>[] = (resultAny.records as Record<string, unknown>[]) || (resultAny.items as Record<string, unknown>[]) || []
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'completed', output: `${records.length} records returned`, completedAt: new Date().toISOString(), duration: 0 } : l
        ),
      }))
      return records
    } catch (err) {
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'failed', error: lemmaError(err), completedAt: new Date().toISOString() } : l
        ),
      }))
      return []
    }
  },

  searchDocuments: async (query) => {
    const client = get().client
    if (!client) return []
    const logId = `lemma-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const log: LemmaExecutionLog = {
      id: logId,
      type: 'document_search',
      status: 'running',
      name: 'files.search',
      input: query,
      startedAt: new Date().toISOString(),
      completedAt: null,
      duration: null,
    }
    get().addExecutionLog(log)
    try {
      const result = await client.files.search(query)
      const items = (result.items || []).map((f: Record<string, unknown>) => ({
        name: String(f.name || ''),
        path: String(f.path || ''),
        size: Number(f.size || 0),
        createdAt: String(f.created_at || new Date().toISOString()),
        updatedAt: String(f.updated_at || new Date().toISOString()),
      }))
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'completed', output: `${items.length} documents found`, completedAt: new Date().toISOString(), duration: 0 } : l
        ),
      }))
      set({ files: items })
      return items
    } catch (err) {
      set(state => ({
        executionLogs: state.executionLogs.map(l =>
          l.id === logId ? { ...l, status: 'failed', error: lemmaError(err), completedAt: new Date().toISOString() } : l
        ),
      }))
      return []
    }
  },

  addExecutionLog: (log) => set(state => ({
    executionLogs: [log, ...state.executionLogs].slice(0, 100),
  })),

  clearLogs: () => set({ executionLogs: [] }),

  setPodId: (podId) => {
    const client = get().client
    if (client) {
      client.setPodId(podId)
    }
    set(state => ({
      health: { ...state.health, podId },
    }))
  },
}))
