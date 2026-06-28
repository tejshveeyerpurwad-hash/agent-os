import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, CheckCircle2, Loader2, ArrowRight, Bot, FileText, Network, ListOrdered, Lightbulb, ChevronRight, Clock, User, Zap } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExecutionEngine } from '@/store/executionEngine'
import { useAgentsStore } from '@/store/agentsStore'

export function Planner() {
  const { currentExecution, executions } = useExecutionEngine()
  const agents = useAgentsStore(s => s.agents)
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null)

  const displayExecution = selectedExecutionId
    ? executions.find(e => e.id === selectedExecutionId) || currentExecution
    : currentExecution

  const plan = displayExecution?.plan

  const assignedAgents = useMemo(() => {
    if (!plan) return []
    const agentIds = [...new Set(plan.subtasks.map(s => s.agentId))]
    return agentIds.map(id => agents.find(a => a.id === id)).filter(Boolean)
  }, [plan, agents])

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Planner</h1>
        <p className="text-sm text-dark-400 mt-0.5">The brain of AgentOS — plan decomposition, reasoning, and execution graph</p>
      </div>

      {!displayExecution ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="h-8 w-8 text-dark-500" />
          </div>
          <h3 className="text-base font-semibold text-dark-200 mb-2">No Active Plan</h3>
          <p className="text-sm text-dark-500 max-w-md mx-auto leading-relaxed">
            Submit a business objective in the Workspace to see the Planner analyze, decompose, and assign agents in real time.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                displayExecution.phase === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                displayExecution.phase === 'failed' ? 'bg-red-500/10 text-red-400' :
                'bg-primary-500/10 text-primary-400',
              )}>
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-100">{displayExecution.objective}</p>
                <p className="text-xs text-dark-500">Phase: {displayExecution.phase}</p>
              </div>
              <span className="text-[10px] text-dark-600 shrink-0">
                {new Date(displayExecution.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {plan && (
                <>
                  <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                    <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" /> Reasoning Chain
                    </h3>
                    <div className="space-y-2">
                      {plan.reasoning.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-2.5"
                        >
                          <div className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 mt-0.5',
                            i < plan.reasoning.length - 1 ? 'bg-primary-500/10 text-primary-400' : 'bg-emerald-500/10 text-emerald-400',
                          )}>
                            {i < plan.reasoning.length - 1 ? (
                              <ListOrdered className="h-3 w-3" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                          </div>
                          <p className="text-xs text-dark-400 leading-relaxed">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                    <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Network className="h-3.5 w-3.5" /> Execution Graph
                    </h3>
                    <div className="relative">
                      <div className="space-y-2">
                        {plan.subtasks.map((task, i) => {
                          const agent = agents.find(a => a.id === task.agentId)
                          return (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className={cn(
                                'relative flex items-center gap-3 p-3 rounded-lg border transition-all',
                                task.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' :
                                task.status === 'running' ? 'border-primary-500/30 bg-primary-500/5' :
                                task.status === 'failed' ? 'border-red-500/20 bg-red-500/5' :
                                'border-dark-800 bg-dark-800/30',
                              )}
                            >
                              <div className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium shrink-0',
                                task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                task.status === 'running' ? 'bg-primary-500/10 text-primary-400' :
                                task.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                'bg-dark-800 text-dark-500',
                              )}>
                                {task.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                                 task.status === 'running' ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                 task.status === 'failed' ? <span className="text-red-400">!</span> :
                                 i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  'text-xs',
                                  task.status === 'completed' ? 'text-dark-400 line-through' :
                                  task.status === 'running' ? 'text-primary-400' :
                                  task.status === 'failed' ? 'text-red-400' :
                                  'text-dark-300',
                                )}>{task.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {agent && (
                                    <span className="flex items-center gap-1 text-[10px] text-dark-500">
                                      <Bot className="h-3 w-3" /> {agent.name}
                                    </span>
                                  )}
                                  {task.dependsOn.length > 0 && (
                                    <span className="text-[10px] text-dark-600">
                                      after task {plan.subtasks.findIndex(s => s.id === task.dependsOn[0]) + 1}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {task.result && task.status === 'completed' && (
                                <div className="hidden lg:block max-w-xs">
                                  <p className="text-[10px] text-dark-500 line-clamp-1">{task.result}</p>
                                </div>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              {plan && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5" /> Assigned Agents
                  </h3>
                  <div className="space-y-2">
                    {assignedAgents.map((agent, i) => agent && (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-dark-800/30"
                      >
                        <div className="w-7 h-7 rounded-lg bg-dark-800 flex items-center justify-center">
                          <Bot className="h-3.5 w-3.5 text-dark-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-dark-200">{agent.name}</p>
                          <p className="text-[10px] text-dark-500">{agent.role}</p>
                        </div>
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          agent.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                          agent.status === 'idle' ? 'bg-dark-500' :
                          'bg-amber-400',
                        )} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Plan Summary
                </h3>
                {plan ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-dark-400">
                      <span>Subtasks</span>
                      <span className="text-dark-200 font-medium">{plan.subtasks.length}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>Agents</span>
                      <span className="text-dark-200 font-medium">{assignedAgents.length}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>Completed</span>
                      <span className="text-emerald-400 font-medium">{plan.subtasks.filter(s => s.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>Running</span>
                      <span className="text-primary-400 font-medium">{plan.subtasks.filter(s => s.status === 'running').length}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-dark-500">No plan generated yet</p>
                )}
              </div>

              {executions.length > 0 && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3">Previous Plans</h3>
                  <div className="space-y-1">
                    {executions.filter(e => e.plan).slice(0, 5).map(ex => (
                      <button key={ex.id} onClick={() => setSelectedExecutionId(ex.id)}
                        className={cn(
                          'w-full text-left p-2 rounded-lg text-xs transition-colors',
                          selectedExecutionId === ex.id ? 'bg-primary-500/10 text-primary-400' : 'text-dark-400 hover:text-dark-300 hover:bg-dark-800/50',
                        )}>
                        <p className="truncate">{ex.objective}</p>
                        <p className="text-[10px] text-dark-600 mt-0.5">{ex.plan?.subtasks.length} tasks</p>
                      </button>
                    ))}
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
