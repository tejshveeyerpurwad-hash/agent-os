import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Bot, FileText, ListChecks, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExecutionEngine } from '@/store/executionEngine'
import { useAgentsStore } from '@/store/agentsStore'
import { ExecutionGraph } from '@/components/execution/ExecutionGraph'
import { PlannerReasoning } from '@/components/execution/PlannerReasoning'

export function Planner() {
  const { currentExecution, executions } = useExecutionEngine()
  const agents = useAgentsStore(s => s.agents)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const display = selectedId
    ? executions.find(e => e.id === selectedId) || currentExecution
    : currentExecution

  const plan = display?.plan

  const agentSummary = useMemo(() => {
    if (!plan) return []
    const ids = [...new Set(plan.subtasks.map(s => s.agentId))]
    return ids.map(id => {
      const agent = agents.find(a => a.id === id)
      const tasks = plan.subtasks.filter(s => s.agentId === id)
      return { id, name: agent?.name || id, role: agent?.role || '', tasks: tasks.length, completed: tasks.filter(t => t.status === 'completed').length }
    })
  }, [plan, agents])

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Planner</h1>
        <p className="text-sm text-dark-400 mt-0.5">The brain of AgentOS — plan decomposition, reasoning chain, and parallel execution graph</p>
      </div>

      {!display ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="h-8 w-8 text-dark-500" />
          </div>
          <h3 className="text-base font-semibold text-dark-200 mb-2">No Active Plan</h3>
          <p className="text-sm text-dark-500 max-w-md mx-auto leading-relaxed">
            Submit a business objective in the Workspace to see the Planner analyze, decompose into parallel groups, assign agents, and track execution in real time.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                display.phase === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                display.phase === 'failed' ? 'bg-red-500/10 text-red-400' :
                display.phase === 'awaiting_approval' ? 'bg-amber-500/10 text-amber-400' :
                'bg-primary-500/10 text-primary-400',
              )}>
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-100">{display.objective}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-dark-500">Phase: {display.phase}</span>
                  {display.totalCount > 0 && (
                    <span className="text-xs text-dark-500">
                      {display.completedCount}/{display.totalCount} tasks
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {plan && (
                <>
                  <PlannerReasoning
                    reasoning={plan.reasoning}
                    isActive={display.phase !== 'completed'}
                  />
                  <ExecutionGraph
                    subtasks={plan.subtasks}
                    currentTaskId={display.currentTaskId}
                  />
                </>
              )}

              {display.history.length > 0 && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ListChecks className="h-3.5 w-3.5" /> Execution Timeline
                  </h3>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {display.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs py-0.5">
                        <span className="text-[10px] text-dark-600 font-mono shrink-0 w-14">
                          {new Date(h.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={cn(
                          'text-[10px] font-medium shrink-0 w-16',
                          h.phase === 'completed' ? 'text-emerald-400' :
                          h.phase === 'awaiting_approval' ? 'text-amber-400' :
                          h.phase === 'failed' ? 'text-red-400' :
                          'text-primary-400',
                        )}>{h.phase}</span>
                        <span className="text-dark-400">{h.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {plan && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5" /> Agent Assignment
                  </h3>
                  <div className="space-y-2">
                    {agentSummary.map((a, i) => (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-dark-800/30"
                      >
                        <div className="w-7 h-7 rounded-lg bg-dark-800 flex items-center justify-center">
                          <Bot className="h-3.5 w-3.5 text-dark-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-dark-200">{a.name}</p>
                          <p className="text-[10px] text-dark-500">{a.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-dark-200">{a.completed}/{a.tasks}</p>
                          <p className="text-[10px] text-dark-500">tasks</p>
                        </div>
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          a.completed === a.tasks ? 'bg-emerald-400' :
                          agents.find(ag => ag.id === a.id)?.status === 'running' ? 'bg-primary-400 animate-pulse' :
                          'bg-dark-500',
                        )} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {plan && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3">Plan Summary</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-dark-400">
                      <span>Total subtasks</span>
                      <span className="text-dark-200 font-medium">{plan.subtasks.length}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>Parallel groups</span>
                      <span className="text-dark-200 font-medium">{plan.depthLevels + 1}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>Agents involved</span>
                      <span className="text-dark-200 font-medium">{agentSummary.length}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>Completed</span>
                      <span className="text-emerald-400 font-medium">{plan.subtasks.filter(s => s.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>Running</span>
                      <span className={cn(
                        plan.subtasks.filter(s => s.status === 'running').length > 0 ? 'text-primary-400' : 'text-dark-400',
                      )}>{plan.subtasks.filter(s => s.status === 'running').length}</span>
                    </div>
                  </div>
                </div>
              )}

              {executions.filter(e => e.plan).length > 0 && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3">Previous Plans</h3>
                  <div className="space-y-1">
                    {executions.filter(e => e.plan).slice(0, 6).map(ex => (
                      <button key={ex.id} onClick={() => setSelectedId(ex.id)}
                        className={cn(
                          'w-full text-left p-2 rounded-lg text-xs transition-colors',
                          selectedId === ex.id ? 'bg-primary-500/10 text-primary-400' : 'text-dark-400 hover:text-dark-300 hover:bg-dark-800/50',
                        )}>
                        <p className="truncate">{ex.objective}</p>
                        <p className="text-[10px] text-dark-600 mt-0.5">{ex.plan?.subtasks.length} tasks · {ex.phase}</p>
                      </button>
                    ))}
                    {selectedId && (
                      <button onClick={() => { setSelectedId(null); useExecutionEngine.getState() }}
                        className="w-full text-center text-[10px] text-primary-400 hover:text-primary-300 pt-1">
                        Back to current
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
