import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Search, Play, Loader2, ChevronDown, ChevronUp, ListChecks, Brain } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAgentsStore } from '@/store/agentsStore'
import { useExecutionEngine } from '@/store/executionEngine'

const metaMap: Record<string, { color: string; textColor: string }> = {
  'agent-ceo': { color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20', textColor: 'text-blue-400' },
  'agent-hr': { color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20', textColor: 'text-emerald-400' },
  'agent-finance': { color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20', textColor: 'text-amber-400' },
  'agent-sales': { color: 'from-violet-500/20 to-violet-600/10 border-violet-500/20', textColor: 'text-violet-400' },
  'agent-marketing': { color: 'from-pink-500/20 to-pink-600/10 border-pink-500/20', textColor: 'text-pink-400' },
  'agent-ops': { color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20', textColor: 'text-cyan-400' },
  'agent-legal': { color: 'from-red-500/20 to-red-600/10 border-red-500/20', textColor: 'text-red-400' },
  'agent-support': { color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20', textColor: 'text-indigo-400' },
}

const agentTasks: Record<string, string> = {
  'agent-ceo': 'Generate weekly executive summary with market intelligence',
  'agent-hr': 'Screen candidates and prepare interview pipeline',
  'agent-finance': 'Review monthly expenses and flag anomalies',
  'agent-sales': 'Score leads and prioritize enterprise opportunities',
  'agent-marketing': 'Optimize Q3 campaign performance across channels',
  'agent-ops': 'Audit operational processes and identify bottlenecks',
  'agent-legal': 'Review supplier agreement for compliance issues',
  'agent-support': 'Process ticket queue and update knowledge base',
}

export function Agents() {
  const agents = useAgentsStore(s => s.agents)
  const executeTask = useAgentsStore(s => s.executeTask)
  const agentLogs = useExecutionEngine(s => s.agentLogs)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [runningTask, setRunningTask] = useState<string | null>(null)
  const [memoriesOpen, setMemoriesOpen] = useState<Record<string, boolean>>({})
  const [logsOpen, setLogsOpen] = useState<Record<string, boolean>>({})

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  )

  async function runDemoTask(agentId: string) {
    setRunningTask(agentId)
    const task = agentTasks[agentId] || 'Process assigned business task'
    await executeTask(agentId, task)
    setRunningTask(null)
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-6 max-w-7xl mx-auto overflow-x-hidden">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">AI Agents</h1>
        <p className="text-sm text-dark-400 mt-0.5">
          Eight specialized business agents. Each has real execution logic, memory, and an activity log.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents..."
          aria-label="Search agents"
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-800/50 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus-ring focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((state, i) => {
          const meta = metaMap[state.id] || { color: 'border-dark-700 bg-dark-800/30', textColor: 'text-dark-400' }
          const isExpanded = expandedId === state.id
          const isRunning = runningTask === state.id
          const logs = agentLogs[state.id] || []
          const isMemoryOpen = memoriesOpen[state.id] ?? false
          const isLogOpen = logsOpen[state.id] ?? false

          return (
            <motion.div
              key={state.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn('min-w-0 rounded-xl border bg-dark-900/50 overflow-hidden transition-all duration-200', meta.color)}
            >
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0', meta.color.replace('border-', ''))}>
                      <Bot className={cn('h-5 w-5', meta.textColor)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark-100 truncate">{state.name}</p>
                      <p className="text-[11px] text-dark-500 truncate">{state.role}</p>
                    </div>
                  </div>
                  <div className={cn(
                    'w-2.5 h-2.5 rounded-full border-2 border-dark-900 shrink-0',
                    state.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                    state.status === 'idle' ? 'bg-dark-500' :
                    state.status === 'paused' ? 'bg-amber-400' :
                    state.status === 'error' ? 'bg-red-400' :
                    'bg-dark-500',
                  )} />
                </div>

                <p className="text-[11px] text-dark-400 leading-relaxed mb-3 line-clamp-2 break-words">{state.description}</p>

                {state.currentTask && (
                  <div className="flex items-center gap-1.5 mb-2 px-2 py-1.5 rounded bg-dark-800/50">
                    <Loader2 className="h-3 w-3 animate-spin text-primary-400 shrink-0" />
                    <span className="text-[10px] text-dark-400 truncate">{state.currentTask}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-dark-500">Confidence</span>
                      <span className="text-dark-300 font-medium">{state.confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-500', meta.textColor.replace('text-', 'bg-'))} style={{ width: `${state.confidence}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-dark-200">{state.successRate}%</p>
                    <p className="text-[10px] text-dark-500">success</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-dark-200">{state.taskCount.toLocaleString()}</p>
                    <p className="text-[10px] text-dark-500">tasks</p>
                  </div>
                </div>
              </div>

              <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex items-center gap-2">
                <button
                  onClick={() => runDemoTask(state.id)}
                  disabled={isRunning || state.status === 'running'}
                  aria-label={`Execute ${state.name} task`}
                  className={cn(
                    'flex-1 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all focus-ring',
                    isRunning ? 'bg-dark-800 text-dark-500 cursor-not-allowed' :
                    'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-dark-100',
                  )}
                >
                  {isRunning ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                  {isRunning ? 'Executing...' : 'Execute'}
                </button>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : state.id)}
                  aria-label="Toggle agent details"
                  aria-expanded={isExpanded}
                  aria-controls={`agent-details-${state.id}`}
                  className="p-1.5 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors focus-ring"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`agent-details-${state.id}`}
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-dark-800"
                  >
                    <div className="p-3 sm:p-4 space-y-3">
                      <div>
                        <p className="text-[10px] font-semibold text-dark-500 uppercase tracking-wider mb-1.5">Capabilities</p>
                        <div className="flex flex-wrap gap-1">
                          {state.capabilities.map(c => (
                            <span key={c} className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] text-dark-400">{c}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => setMemoriesOpen(prev => ({ ...prev, [state.id]: !isMemoryOpen }))}
                          aria-label="Toggle memory section"
                          aria-expanded={isMemoryOpen}
                          aria-controls={`memory-${state.id}`}
                          className="flex items-center gap-1 text-[10px] font-semibold text-dark-500 uppercase tracking-wider mb-1.5 focus-ring"
                        >
                          {isMemoryOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          Memory
                        </button>
                        {isMemoryOpen && (
                          <div id={`memory-${state.id}`} className="space-y-1">
                            {state.memory.slice(0, 4).map((m, i) => (
                              <p key={i} className="text-[10px] text-dark-400 flex items-start gap-1.5">
                                <Brain className="h-3 w-3 text-dark-600 shrink-0 mt-0.5" />
                                <span className="truncate">{m}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold text-dark-500 uppercase tracking-wider mb-1.5">Last Action</p>
                        <p className="text-[11px] text-dark-400 break-words">{state.lastAction}</p>
                      </div>

                      {logs.length > 0 && (
                        <div>
                          <button
                            onClick={() => setLogsOpen(prev => ({ ...prev, [state.id]: !isLogOpen }))}
                            aria-label="Toggle activity log"
                            aria-expanded={isLogOpen}
                            aria-controls={`log-${state.id}`}
                            className="text-[10px] font-semibold text-dark-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 focus-ring"
                          >
                            {isLogOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            <ListChecks className="h-3 w-3" /> Activity Log ({logs.length})
                          </button>
                          {isLogOpen && (
                            <div id={`log-${state.id}`} className="space-y-1 max-h-32 overflow-y-auto">
                              {logs.map((log, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-[10px]">
                                  <div className={cn(
                                    'w-1.5 h-1.5 rounded-full mt-1 shrink-0',
                                    log.severity === 'success' ? 'bg-emerald-400' :
                                    log.severity === 'warning' ? 'bg-amber-400' :
                                    log.severity === 'error' ? 'bg-red-400' : 'bg-dark-500',
                                  )} />
                                  <span className="text-dark-500 break-words">{log.detail}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
