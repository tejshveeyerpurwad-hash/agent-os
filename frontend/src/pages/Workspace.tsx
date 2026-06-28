import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Terminal, Bot, CheckCircle2, Loader2, XCircle, ArrowRight, BrainCircuit, Workflow, FileText, Clock, User, AlertCircle, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExecutionEngine } from '@/store/executionEngine'
import { useAgentsStore } from '@/store/agentsStore'
import { useActivityStore } from '@/store/activityStore'
import type { ExecutionPhase } from '@/types/execution'

const phaseLabels: Record<ExecutionPhase, string> = {
  idle: 'Ready',
  planning: 'Planning...',
  decomposing: 'Decomposing objective...',
  assigning_agents: 'Assigning agents...',
  executing: 'Executing tasks...',
  querying_knowledge: 'Querying knowledge...',
  awaiting_approval: 'Awaiting approval',
  completed: 'Completed',
  failed: 'Failed',
}

const phaseSteps: { phase: ExecutionPhase; label: string; icon: typeof Bot }[] = [
  { phase: 'planning', label: 'Analyze Objective', icon: BrainCircuit },
  { phase: 'decomposing', label: 'Create Plan', icon: Workflow },
  { phase: 'assigning_agents', label: 'Assign Agents', icon: Bot },
  { phase: 'executing', label: 'Execute Tasks', icon: Terminal },
  { phase: 'completed', label: 'Generate Result', icon: CheckCircle2 },
]

export function Workspace() {
  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const { currentExecution, isProcessing, submitObjective, cancelExecution, approvals, approveTask, rejectTask, executions } = useExecutionEngine()
  const agents = useAgentsStore(s => s.agents)
  const events = useActivityStore(s => s.events)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const busyAgents = agents.filter(a => a.status === 'running')

  function handleSubmit() {
    if (!input.trim() || isProcessing) return
    submitObjective(input.trim())
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px'
    }
  }, [input])

  const getPhaseIndex = () => {
    if (!currentExecution) return -1
    return phaseSteps.findIndex(p => p.phase === currentExecution.phase)
  }

  const phaseIndex = getPhaseIndex()

  const executionEvents = currentExecution
    ? events.filter(e => e.executionId === currentExecution.id).slice(0, 10)
    : []

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Workspace</h1>
            <p className="text-sm text-dark-400 mt-0.5">Enter a business objective and watch AgentOS execute it</p>
          </div>

          <div className="relative">
            <div className={cn(
              'rounded-xl border transition-all duration-300',
              isProcessing ? 'border-primary-500/30 bg-primary-500/[0.02]' : 'border-dark-800 bg-dark-900/50',
            )}>
              <div className="p-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isProcessing ? 'Execution in progress...' : 'Describe a business objective. For example: "Hire two frontend engineers" or "Generate Q3 marketing campaign"...'}
                  disabled={isProcessing}
                  rows={2}
                  className="w-full bg-transparent px-4 py-3 text-sm text-dark-100 placeholder:text-dark-500 resize-none focus:outline-none disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-dark-800">
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  {isProcessing ? (
                    <span className="flex items-center gap-1.5 text-primary-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] font-mono">Enter</kbd>
                      <span>to submit</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isProcessing && (
                    <button onClick={cancelExecution}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isProcessing}
                    className={cn(
                      'px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all',
                      isProcessing ? 'bg-dark-800 text-dark-500 cursor-not-allowed' :
                      input.trim() ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-dark-800 text-dark-500 cursor-not-allowed',
                    )}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {isProcessing ? 'Executing...' : 'Execute'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {currentExecution && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-dark-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-dark-400" />
                    <h2 className="text-sm font-semibold text-dark-200">Execution Pipeline</h2>
                  </div>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    currentExecution.phase === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    currentExecution.phase === 'failed' ? 'bg-red-500/10 text-red-400' :
                    currentExecution.phase === 'awaiting_approval' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-primary-500/10 text-primary-400',
                  )}>
                    {phaseLabels[currentExecution.phase]}
                  </span>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="flex items-start gap-4">
                    {phaseSteps.map((step, i) => {
                      const isDone = phaseIndex > i
                      const isCurrent = phaseIndex === i
                      const isPending = phaseIndex < i
                      const Icon = step.icon
                      return (
                        <div key={step.phase} className="flex-1 flex flex-col items-center text-center">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-300',
                            isDone ? 'bg-emerald-500/10 text-emerald-400' :
                            isCurrent ? 'bg-primary-500/10 text-primary-400 ring-2 ring-primary-500/30' :
                            'bg-dark-800 text-dark-500',
                          )}>
                            {isDone ? <CheckCircle2 className="h-5 w-5" /> :
                             isCurrent ? <Loader2 className="h-5 w-5 animate-spin" /> :
                             <Icon className="h-5 w-5" />}
                          </div>
                          <p className={cn(
                            'text-[11px] font-medium leading-tight',
                            isDone ? 'text-dark-400' : isCurrent ? 'text-primary-400' : 'text-dark-600',
                          )}>{step.label}</p>
                          {i < phaseSteps.length - 1 && (
                            <div className={cn(
                              'hidden lg:block absolute top-5 left-[60%] w-[80%] h-px',
                              isDone ? 'bg-emerald-500/50' : isCurrent ? 'bg-primary-500/30' : 'bg-dark-800',
                            )} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {currentExecution.plan && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3">Execution Plan</h3>
                  <div className="space-y-2">
                    {currentExecution.plan.subtasks.map((task, i) => {
                      const agent = agents.find(a => a.id === task.agentId)
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={cn(
                            'flex items-center gap-3 p-2.5 rounded-lg transition-all',
                            task.status === 'running' ? 'bg-primary-500/5 border border-primary-500/20' :
                            task.status === 'completed' ? 'bg-emerald-500/5 border border-emerald-500/20' :
                            'bg-dark-800/30 border border-transparent',
                          )}
                        >
                          <div className={cn(
                            'w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0',
                            task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            task.status === 'running' ? 'bg-primary-500/10 text-primary-400' :
                            'bg-dark-800 text-dark-500',
                          )}>
                            {task.status === 'completed' ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                             task.status === 'running' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
                             i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-xs',
                              task.status === 'completed' ? 'text-dark-400' :
                              task.status === 'running' ? 'text-primary-400' : 'text-dark-300',
                            )}>{task.description}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {agent && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-800 text-dark-500">{agent.name}</span>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {currentExecution.history.length > 0 && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3">Execution Log</h3>
                  <div className="space-y-1.5">
                    {currentExecution.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-[10px] text-dark-600 font-mono shrink-0 w-16">
                          {new Date(h.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={cn(
                          'text-[10px] font-medium shrink-0 w-20',
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

              {currentExecution.phase === 'completed' && currentExecution.result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 lg:p-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-emerald-400">Completed</h3>
                  </div>
                  <p className="text-sm text-dark-300">{currentExecution.result}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {!currentExecution && !isProcessing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <Terminal className="h-8 w-8 text-dark-500" />
              </div>
              <h3 className="text-base font-semibold text-dark-200 mb-2">Ready to Execute</h3>
              <p className="text-sm text-dark-500 max-w-md mx-auto leading-relaxed">
                Enter a business objective above. AgentOS will plan, assign agents, query knowledge, and execute tasks automatically.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['Hire two frontend engineers', 'Generate Q3 marketing campaign', 'Review quarterly budget', 'Close enterprise deal with TechCorp'].map(ex => (
                  <button key={ex} onClick={() => { setInput(ex); setTimeout(() => inputRef.current?.focus(), 50) }}
                    className="px-3 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700 text-xs text-dark-400 hover:text-dark-300 hover:border-dark-600 transition-all">
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {executions.length > 0 && (
            <div className="rounded-xl border border-dark-800 bg-dark-900/50">
              <button onClick={() => setShowHistory(!showHistory)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs text-dark-400 hover:text-dark-300">
                <span>Recent Executions ({executions.length})</span>
                <span>{showHistory ? 'Hide' : 'Show'}</span>
              </button>
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-dark-800"
                  >
                    <div className="divide-y divide-dark-800">
                      {executions.slice(0, 10).map(ex => (
                        <div key={ex.id} className="px-4 py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={cn(
                              'w-1.5 h-1.5 rounded-full shrink-0',
                              ex.phase === 'completed' ? 'bg-emerald-400' :
                              ex.phase === 'failed' ? 'bg-red-400' : 'bg-dark-500',
                            )} />
                            <p className="text-xs text-dark-400 truncate">{ex.objective}</p>
                          </div>
                          <span className="text-[10px] text-dark-600 shrink-0 ml-2">
                            {new Date(ex.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {approvals.filter(a => a.status === 'pending').length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="border-t border-dark-800 bg-dark-950"
          >
            <div className="max-w-4xl mx-auto p-3 space-y-2">
              <p className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Pending Approvals
              </p>
              {approvals.filter(a => a.status === 'pending').slice(0, 3).map(apr => (
                <div key={apr.id} className="flex items-center justify-between p-2.5 rounded-lg bg-dark-800/50 border border-amber-500/10">
                  <div className="min-w-0">
                    <p className="text-xs text-dark-200">{apr.title}</p>
                    <p className="text-[10px] text-dark-500">{apr.urgency === 'high' ? 'High priority' : 'Standard'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => rejectTask(apr.id)}
                      className="px-2.5 py-1 rounded text-[11px] text-red-400 hover:bg-red-500/10 transition-colors">Reject</button>
                    <button onClick={() => approveTask(apr.id)}
                      className="px-2.5 py-1 rounded text-[11px] bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">Approve</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
