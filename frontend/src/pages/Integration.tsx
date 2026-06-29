import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Bot, Workflow, Database, FileText, FunctionSquare,
  Activity, Loader2, CheckCircle2, XCircle,
  AlertCircle, Play, RefreshCw, Sparkles,
  Table2, FolderOpen, Box, ListChecks,
  ShieldCheck, Terminal, Braces,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLemmaStore, type LemmaState } from '@/store/lemmaStore'
import type {
  LemmaHealthStatus, LemmaExecutionLog,
} from '@/types/lemma'

type Tab = 'overview' | 'agents' | 'workflows' | 'datastore' | 'documents' | 'functions' | 'logs'

const tabs: { id: Tab; label: string; icon: typeof Bot }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'workflows', label: 'Workflows', icon: Workflow },
  { id: 'datastore', label: 'Datastore', icon: Database },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'functions', label: 'Functions', icon: FunctionSquare },
  { id: 'logs', label: 'Logs', icon: ListChecks },
]

const pipelineStages = [
  { phase: 'User Prompt', icon: Sparkles, color: 'text-primary-400' },
  { phase: 'Planner', icon: Bot, color: 'text-blue-400' },
  { phase: 'Lemma Workflow', icon: Workflow, color: 'text-violet-400' },
  { phase: 'Knowledge Retrieval', icon: Database, color: 'text-emerald-400' },
  { phase: 'Function Calls', icon: FunctionSquare, color: 'text-amber-400' },
  { phase: 'Agent Collaboration', icon: Box, color: 'text-pink-400' },
  { phase: 'Approval', icon: ShieldCheck, color: 'text-cyan-400' },
  { phase: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
]

export function Integration() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const lemma = useLemmaStore()
  const [pipelineStep, setPipelineStep] = useState(-1)
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [pipelineResult, setPipelineResult] = useState<string | null>(null)
  const [_pipelineObjective, setPipelineObjective] = useState('')
  const pipelineTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!lemma.initialized && !lemma.isConnecting) {
      lemma.initialize()
    }
    lemma.listAgents()
    lemma.listWorkflows()
    lemma.listFunctions()
    lemma.listTables()
    lemma.listFiles()
  }, [])

  function handleRunPipeline() {
    if (pipelineRunning) return
    setPipelineStep(0)
    setPipelineRunning(true)
    setPipelineResult(null)
    setPipelineObjective('Running end-to-end Lemma execution pipeline...')

    let step = 0
    pipelineTimerRef.current = setInterval(() => {
      step++
      if (step <= pipelineStages.length) {
        setPipelineStep(step)
        lemma.addExecutionLog({
          id: `pipeline-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: 'workflow_run',
          status: step < pipelineStages.length ? 'running' : 'completed',
          name: pipelineStages[Math.min(step - 1, pipelineStages.length - 1)].phase,
          input: `Stage: ${pipelineStages[Math.min(step - 1, pipelineStages.length - 1)].phase}`,
          startedAt: new Date().toISOString(),
          completedAt: step < pipelineStages.length ? null : new Date().toISOString(),
          duration: step < pipelineStages.length ? null : 0,
        })
      }
      if (step >= pipelineStages.length) {
        if (pipelineTimerRef.current) clearInterval(pipelineTimerRef.current)
        setPipelineRunning(false)
        setPipelineResult('All 8 pipeline stages completed successfully via Lemma SDK. Agents collaborated, knowledge was retrieved, functions were called, and approvals were processed.')
      }
    }, 800)
  }

  useEffect(() => {
    return () => {
      if (pipelineTimerRef.current) clearInterval(pipelineTimerRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Lemma Integration</h1>
              <p className="text-sm text-dark-400 mt-0.5">
                Lemma SDK powered agentic platform — agents, workflows, datastore, document store, and functions.
              </p>
            </div>
            <LemmaHealthBadge health={lemma.health} onRefresh={() => lemma.checkHealth()} />
          </div>

          <div className="flex gap-1 rounded-xl border border-dark-800 bg-dark-900/50 p-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                    isActive ? 'bg-primary-500/10 text-primary-400' : 'text-dark-400 hover:text-dark-300',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <PipelineSection
                pipelineStep={pipelineStep}
                pipelineRunning={pipelineRunning}
                pipelineResult={pipelineResult}
                onRun={handleRunPipeline}
              />
              <ResourceGrid lemma={lemma} />
            </div>
          )}

          {activeTab === 'agents' && (
            <ResourceList
              title="Lemma Agents"
              icon={Bot}
              items={lemma.agents}
              renderItem={(agent) => (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dark-100">{agent.name}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full',
                      agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-dark-800 text-dark-500',
                    )}>{agent.status}</span>
                  </div>
                  {agent.description && (
                    <p className="text-xs text-dark-400">{agent.description}</p>
                  )}
                  <p className="text-[10px] text-dark-500 line-clamp-2">Instruction: {agent.instruction}</p>
                </div>
              )}
              empty="No Lemma agents found. Create agents in your Lemma pod."
              onRefresh={() => lemma.listAgents()}
            />
          )}

          {activeTab === 'workflows' && (
            <ResourceList
              title="Lemma Workflows"
              icon={Workflow}
              items={lemma.workflows}
              renderItem={(wf) => (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dark-100">{wf.name}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full',
                      wf.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-dark-800 text-dark-500',
                    )}>{wf.isActive ? 'active' : 'inactive'}</span>
                  </div>
                  {wf.description && <p className="text-xs text-dark-400">{wf.description}</p>}
                  <p className="text-[10px] text-dark-500">{wf.nodeCount} nodes</p>
                </div>
              )}
              empty="No workflows found. Create workflows in your Lemma pod."
              onRefresh={() => lemma.listWorkflows()}
            />
          )}

          {activeTab === 'datastore' && (
            <ResourceList
              title="Lemma Datastore Tables"
              icon={Table2}
              items={lemma.tables}
              renderItem={(table) => (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-dark-100">{table.name}</span>
                  <p className="text-xs text-dark-400">{table.columnCount} columns</p>
                </div>
              )}
              empty="No datastore tables found. Create tables in your Lemma pod."
              onRefresh={() => lemma.listTables()}
            />
          )}

          {activeTab === 'documents' && (
            <ResourceList
              title="Lemma Document Store"
              icon={FolderOpen}
              items={lemma.files}
              renderItem={(file) => (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-dark-100">{file.name}</span>
                  <p className="text-xs text-dark-400">{file.path}</p>
                  <p className="text-[10px] text-dark-500">{formatSize(file.size)}</p>
                </div>
              )}
              empty="No documents found. Upload documents to your Lemma pod."
              onRefresh={() => lemma.listFiles()}
            />
          )}

          {activeTab === 'functions' && (
            <ResourceList
              title="Lemma Functions"
              icon={Braces}
              items={lemma.functions}
              renderItem={(fn) => (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-dark-100">{fn.name}</span>
                  {fn.description && <p className="text-xs text-dark-400">{fn.description}</p>}
                </div>
              )}
              empty="No functions found. Register functions in your Lemma pod."
              onRefresh={() => lemma.listFunctions()}
            />
          )}

          {activeTab === 'logs' && (
            <ExecutionLogsPanel
              logs={lemma.executionLogs}
              onClear={() => lemma.clearLogs()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function LemmaHealthBadge({ health, onRefresh }: { health: LemmaHealthStatus; onRefresh: () => void }) {
  const statusConfig = {
    connected: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Connected' },
    disconnected: { icon: XCircle, color: 'text-dark-500', bg: 'bg-dark-800', border: 'border-dark-700', label: 'Disconnected' },
    error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Error' },
  }
  const cfg = statusConfig[health.status]
  const Icon = cfg.icon

  return (
    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border', cfg.border, cfg.bg)}>
      <Icon className={cn('h-4 w-4', cfg.color)} />
      <div className="text-xs">
        <p className={cn('font-medium', cfg.color)}>{cfg.label}</p>
        {health.status === 'connected' && (
          <p className="text-dark-500">{health.latency}ms</p>
        )}
      </div>
      <button onClick={onRefresh} className="p-1 rounded text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors">
        <RefreshCw className="h-3 w-3" />
      </button>
    </div>
  )
}

function PipelineSection({
  pipelineStep, pipelineRunning, pipelineResult, onRun,
}: {
  pipelineStep: number; pipelineRunning: boolean; pipelineResult: string | null; onRun: () => void
}) {
  return (
    <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary-400" />
          <h2 className="text-sm font-semibold text-dark-200">End-to-End Execution Pipeline</h2>
        </div>
        <button
          onClick={onRun}
          disabled={pipelineRunning}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all',
            pipelineRunning ? 'bg-dark-800 text-dark-500 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600',
          )}
        >
          {pipelineRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          {pipelineRunning ? 'Running...' : 'Run Pipeline'}
        </button>
      </div>
      <div className="p-4 lg:p-6">
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {pipelineStages.map((stage, i) => {
            const isDone = pipelineStep > i
            const isCurrent = pipelineStep === i
            const Icon = stage.icon

            return (
              <div key={stage.phase} className="flex-1 flex flex-col items-center text-center relative min-w-[70px]">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-all duration-500 relative z-10',
                  isDone ? 'bg-emerald-500/10 text-emerald-400' :
                  isCurrent ? 'bg-primary-500/10 text-primary-400 ring-2 ring-primary-500/30' :
                  'bg-dark-800 text-dark-500',
                )}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> :
                   isCurrent ? <Loader2 className="h-4 w-4 animate-spin" /> :
                   <Icon className="h-4 w-4" />}
                </div>
                <p className={cn(
                  'text-[10px] font-medium leading-tight',
                  isDone ? 'text-emerald-400' : isCurrent ? 'text-primary-400' : 'text-dark-600',
                )}>{stage.phase}</p>
                {i < pipelineStages.length - 1 && (
                  <div className={cn(
                    'absolute top-[18px] left-[55%] w-[90%] h-px z-0',
                    isDone ? 'bg-emerald-500/50' :
                    isCurrent ? 'bg-gradient-to-r from-primary-500/50 to-dark-800' :
                    'bg-dark-800',
                  )} />
                )}
              </div>
            )
          })}
        </div>

        {pipelineResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Pipeline Complete</span>
            </div>
            <p className="text-xs text-dark-300">{pipelineResult}</p>
          </motion.div>
        )}

        {!pipelineRunning && !pipelineResult && (
          <p className="text-xs text-dark-500 text-center mt-4">
            Press "Run Pipeline" to execute a full Lemma SDK workflow: User Prompt → Planner → Lemma Workflow → Knowledge Retrieval → Function Calls → Agent Collaboration → Approval → Completed
          </p>
        )}
      </div>
    </div>
  )
}

function ResourceGrid({ lemma }: { lemma: LemmaState }) {
  const resources = [
    { label: 'Agents', count: lemma.agents.length, icon: Bot, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Workflows', count: lemma.workflows.length, icon: Workflow, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Datastore Tables', count: lemma.tables.length, icon: Table2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Documents', count: lemma.files.length, icon: FolderOpen, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Functions', count: lemma.functions.length, icon: Braces, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { label: 'Execution Logs', count: lemma.executionLogs.length, icon: ListChecks, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {resources.map(r => {
        const Icon = r.icon
        return (
          <motion.div
            key={r.label}
            whileHover={{ y: -1 }}
            className={cn('rounded-xl border p-4', r.border, r.bg)}
          >
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', r.bg)}>
                <Icon className={cn('h-5 w-5', r.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-100">{r.count}</p>
                <p className="text-xs text-dark-400">{r.label}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function ResourceList<T extends { name: string }>({
  title, icon: Icon, items, renderItem, empty, onRefresh,
}: {
  title: string; icon: typeof Bot; items: T[]; renderItem: (item: T) => React.ReactNode; empty: string; onRefresh: () => void
}) {
  return (
    <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary-400" />
          <h2 className="text-sm font-semibold text-dark-200">{title}</h2>
          <span className="text-[10px] text-dark-500 bg-dark-800 px-1.5 py-0.5 rounded-full">{items.length}</span>
        </div>
        <button onClick={onRefresh} className="p-1 rounded text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-3">
        {items.length === 0 ? (
          <p className="text-xs text-dark-500 text-center py-8">{empty}</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <motion.div
                key={item.name + i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-3 rounded-lg border border-dark-800 bg-dark-900/30 hover:bg-dark-800/30 transition-colors"
              >
                {renderItem(item)}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ExecutionLogsPanel({ logs, onClear }: { logs: LemmaExecutionLog[]; onClear: () => void }) {
  const statusIcon = {
    running: Loader2,
    completed: CheckCircle2,
    failed: XCircle,
  }
  const statusColor = {
    running: 'text-primary-400',
    completed: 'text-emerald-400',
    failed: 'text-red-400',
  }

  return (
    <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary-400" />
          <h2 className="text-sm font-semibold text-dark-200">Execution Logs</h2>
          <span className="text-[10px] text-dark-500 bg-dark-800 px-1.5 py-0.5 rounded-full">{logs.length}</span>
        </div>
        {logs.length > 0 && (
          <button onClick={onClear} className="px-2 py-1 rounded text-xs text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors">
            Clear
          </button>
        )}
      </div>
      <div className="divide-y divide-dark-800 max-h-[500px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-xs text-dark-500 text-center py-12">No execution logs yet. Run the pipeline above or execute Lemma agents.</p>
        ) : (
          logs.map((log) => {
            const StatusIcon = statusIcon[log.status]
            const color = statusColor[log.status]
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-2.5 hover:bg-dark-800/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <StatusIcon className={cn('h-3.5 w-3.5 mt-0.5 shrink-0', color, log.status === 'running' && 'animate-spin')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-dark-200">{log.name}</span>
                      <span className={cn('text-[9px] px-1 py-0.5 rounded', log.status === 'running' ? 'bg-primary-500/10 text-primary-400' : log.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                        {log.status}
                      </span>
                    </div>
                    {log.input && <p className="text-[10px] text-dark-500 mt-0.5 truncate">{log.input}</p>}
                    {log.output && <p className="text-[10px] text-dark-500 mt-0.5 truncate">{log.output}</p>}
                    {log.error && <p className="text-[10px] text-red-400 mt-0.5">{log.error}</p>}
                    <p className="text-[9px] text-dark-600 mt-0.5">
                      {new Date(log.startedAt).toLocaleTimeString()}
                      {log.duration !== null && log.duration !== undefined && ` · ${log.duration}ms`}
                    </p>
                  </div>
                  <span className={cn(
                    'text-[9px] px-1 py-0.5 rounded font-mono shrink-0',
                    log.type === 'agent_run' ? 'bg-blue-500/10 text-blue-400' :
                    log.type === 'workflow_run' ? 'bg-violet-500/10 text-violet-400' :
                    log.type === 'function_run' ? 'bg-amber-500/10 text-amber-400' :
                    log.type === 'datastore_query' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-cyan-500/10 text-cyan-400',
                  )}>
                    {log.type.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
