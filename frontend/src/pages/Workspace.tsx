import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Terminal, Loader2, Sparkles, CheckCircle2, Clock, XCircle, AlertCircle, Bot, ArrowRight, ListChecks } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExecutionEngine } from '@/store/executionEngine'
import { useAgentsStore } from '@/store/agentsStore'
import { ExecutionPipeline } from '@/components/execution/ExecutionPipeline'
import { ExecutionGraph } from '@/components/execution/ExecutionGraph'
import { PlannerReasoning } from '@/components/execution/PlannerReasoning'
import { ApprovalPanel } from '@/components/execution/ApprovalPanel'

const demos = [
  'Hire two frontend engineers',
  'Launch a marketing campaign',
  'Prepare investor update',
  'Review monthly expenses',
  'Plan product launch',
]

export function Workspace() {
  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const { currentExecution, isProcessing, cancelExecution, executions } = useExecutionEngine()
  const agents = useAgentsStore(s => s.agents)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() || isProcessing) return
    useExecutionEngine.getState().submitObjective(input.trim())
    setInput('')
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const busyAgents = agents.filter(a => a.status === 'running')

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Workspace</h1>
            <p className="text-sm text-dark-400 mt-0.5">
              Enter a business objective. The Planner decomposes it, assigns agents, and executes tasks in parallel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={cn(
            'rounded-xl border transition-all duration-300',
            isProcessing ? 'border-primary-500/30 bg-primary-500/[0.02]' : 'border-dark-800 bg-dark-900/50',
          )}>
            <div className="p-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isProcessing ? 'Execution in progress...' : 'Describe a business objective...'}
                disabled={isProcessing}
                rows={2}
                className="w-full bg-transparent px-4 py-3 text-sm text-dark-100 placeholder:text-dark-500 resize-none focus:outline-none disabled:opacity-50"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-dark-800">
              <div className="flex items-center gap-2 text-xs text-dark-500">
                {isProcessing ? (
                  <span className="flex items-center gap-1.5 text-primary-400">
                    <Loader2 className="h-3 w-3 animate-spin" /> Processing...
                  </span>
                ) : (
                  <>
                    <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] font-mono">Enter</kbd>
                    <span>to submit</span>
                    <span className="text-dark-700 mx-1">·</span>
                    <span className="text-dark-600">Try:</span>
                    {demos.map(d => (
                      <button key={d} type="button" onClick={() => { setInput(d); inputRef.current?.focus() }}
                        className="text-dark-500 hover:text-primary-400 transition-colors truncate max-w-[140px]">
                        {d}
                      </button>
                    ))}
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isProcessing && (
                  <button type="button" onClick={cancelExecution}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                    Cancel
                  </button>
                )}
                <button type="submit"
                  disabled={!input.trim() || isProcessing}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all',
                    isProcessing ? 'bg-dark-800 text-dark-500 cursor-not-allowed' :
                    input.trim() ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-dark-800 text-dark-500 cursor-not-allowed',
                  )}>
                  {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {isProcessing ? 'Executing...' : 'Execute'}
                </button>
              </div>
            </div>
          </form>

          {currentExecution && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Terminal className="h-4 w-4 text-primary-400" />
                  <p className="text-sm font-semibold text-dark-100">{currentExecution.objective}</p>
                </div>
                <ExecutionPipeline
                  phase={currentExecution.phase}
                  completedCount={currentExecution.completedCount}
                  totalCount={currentExecution.totalCount}
                />
              </div>

              {currentExecution.history.length > 0 && (
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                  <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ListChecks className="h-3.5 w-3.5" /> Execution Log
                  </h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {currentExecution.history.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className="flex items-start gap-2 text-xs py-0.5"
                      >
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
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {currentExecution.plan && (
                <>
                  <PlannerReasoning
                    reasoning={currentExecution.plan.reasoning}
                    isActive={currentExecution.phase !== 'completed'}
                  />
                  <ExecutionGraph
                    subtasks={currentExecution.plan.subtasks}
                    currentTaskId={currentExecution.currentTaskId}
                  />
                </>
              )}

              {currentExecution.phase === 'completed' && currentExecution.result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 lg:p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-emerald-400">Objective Completed</h3>
                  </div>
                  <pre className="text-xs text-dark-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {currentExecution.result}
                  </pre>
                </motion.div>
              )}
            </motion.div>
          )}

          {!currentExecution && !isProcessing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <Terminal className="h-8 w-8 text-dark-500" />
              </div>
              <h3 className="text-base font-semibold text-dark-200 mb-2">Ready for Business Execution</h3>
              <p className="text-sm text-dark-500 max-w-lg mx-auto leading-relaxed">
                Describe a business objective and AgentOS will plan, decompose into parallel tasks, assign specialized agents, query knowledge, and execute — all in real time.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {demos.map(ex => (
                  <button key={ex} onClick={() => { setInput(ex); inputRef.current?.focus() }}
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
                <ArrowRight className={cn('h-3.5 w-3.5 transition-transform', showHistory && 'rotate-90')} />
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
                              ex.phase === 'completed' ? 'bg-emerald-400' : ex.phase === 'failed' ? 'bg-red-400' : 'bg-dark-500',
                            )} />
                            <p className="text-xs text-dark-400 truncate">{ex.objective}</p>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-dark-600 shrink-0">
                            <span>{ex.completedCount}/{ex.totalCount} tasks</span>
                            <span>{new Date(ex.createdAt).toLocaleTimeString()}</span>
                          </div>
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

      <ApprovalPanel />
    </div>
  )
}



