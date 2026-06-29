import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Bot, CheckCircle2, Loader2, ShieldAlert, Clock, ChevronRight } from 'lucide-react'
import type { Subtask } from '@/types/execution'

interface ExecutionGraphProps {
  subtasks: Subtask[]
  currentTaskId: string | null
}

const agentColors: Record<string, string> = {
  'agent-ceo': 'border-blue-500/30 bg-blue-500/5',
  'agent-hr': 'border-emerald-500/30 bg-emerald-500/5',
  'agent-finance': 'border-amber-500/30 bg-amber-500/5',
  'agent-sales': 'border-violet-500/30 bg-violet-500/5',
  'agent-marketing': 'border-pink-500/30 bg-pink-500/5',
  'agent-ops': 'border-cyan-500/30 bg-cyan-500/5',
  'agent-legal': 'border-red-500/30 bg-red-500/5',
  'agent-support': 'border-indigo-500/30 bg-indigo-500/5',
}

const agentLabels: Record<string, string> = {
  'agent-ceo': 'CEO',
  'agent-hr': 'HR',
  'agent-finance': 'Finance',
  'agent-sales': 'Sales',
  'agent-marketing': 'Marketing',
  'agent-ops': 'Ops',
  'agent-legal': 'Legal',
  'agent-support': 'Support',
}

export function ExecutionGraph({ subtasks, currentTaskId }: ExecutionGraphProps) {
  const maxDepth = Math.max(...subtasks.map(s => s.depth), 0)

  const groupedByDepth: Subtask[][] = []
  for (let d = 0; d <= maxDepth; d++) {
    const tasks = subtasks.filter(s => s.depth === d)
    if (tasks.length > 0) groupedByDepth.push(tasks)
  }

  return (
    <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-3 sm:p-4 overflow-x-auto" role="region" aria-label="Execution DAG graph">
      <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <Bot className="h-3.5 w-3.5" aria-hidden="true" /> Execution Graph — Parallel Groups
      </h3>

      <div className="space-y-3 min-w-[280px]">
        {groupedByDepth.map((group, gi) => (
          <motion.div
            key={gi}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-medium text-dark-500 bg-dark-800 px-1.5 py-0.5 rounded">
                Group {gi + 1}
              </span>
              {group.length > 1 && (
                <span className="text-[10px] text-dark-600 flex items-center gap-1">
                  <Bot className="h-3 w-3" aria-hidden="true" /> {group.length} parallel tasks
                </span>
              )}
            </div>
            <div className={cn(
              'grid gap-1.5 sm:gap-2',
              group.length === 1 ? 'grid-cols-1' :
              group.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            )}>
              {group.map((task, ti) => {
                const colorClass = agentColors[task.agentId] || 'border-dark-700 bg-dark-800/30'
                const isRunning = task.id === currentTaskId && task.status === 'running'
                const isCompleted = task.status === 'completed'
                const isAwaiting = task.status === 'awaiting_approval'

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1, scale: 1,
                      transition: { delay: ti * 0.06 },
                    }}
                    whileHover={{ y: -1 }}
                    className={cn(
                      'rounded-lg border p-2 sm:p-2.5 transition-all duration-300',
                      isRunning ? 'border-primary-500/40 bg-primary-500/5 ring-1 ring-primary-500/20' :
                      isCompleted ? 'border-emerald-500/30 bg-emerald-500/[0.03]' :
                      isAwaiting ? 'border-amber-500/30 bg-amber-500/[0.03]' :
                      colorClass,
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        'w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5',
                        isCompleted ? 'bg-emerald-500/10' :
                        isRunning ? 'bg-primary-500/10' :
                        isAwaiting ? 'bg-amber-500/10' :
                        'bg-dark-800',
                      )}>
                        {isCompleted ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> :
                         isRunning ? <Loader2 className="h-3 w-3 animate-spin text-primary-400" /> :
                         isAwaiting ? <ShieldAlert className="h-3 w-3 text-amber-400" /> :
                         <span className="text-[8px] text-dark-500 font-mono">{task.agentId === 'agent-ceo' ? 'C' : task.agentId === 'agent-hr' ? 'H' : task.agentId === 'agent-finance' ? 'F' : task.agentId === 'agent-sales' ? 'S' : task.agentId === 'agent-marketing' ? 'M' : task.agentId === 'agent-ops' ? 'O' : task.agentId === 'agent-legal' ? 'L' : task.agentId === 'agent-support' ? 'S' : '?'}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-[11px] leading-snug',
                          isCompleted ? 'text-dark-400' :
                          isRunning ? 'text-primary-400 font-medium' :
                          isAwaiting ? 'text-amber-400' :
                          'text-dark-300',
                        )}>{task.description}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={cn(
                            'text-[9px] px-1 py-0.5 rounded font-medium',
                            isCompleted ? 'bg-emerald-500/10 text-emerald-400' :
                            isRunning ? 'bg-primary-500/10 text-primary-400' :
                            isAwaiting ? 'bg-amber-500/10 text-amber-400' :
                            'bg-dark-800 text-dark-500',
                          )}>
                            {agentLabels[task.agentId] || task.agentId}
                          </span>
                          {task.priority === 'high' && (
                            <span className="text-[9px] text-dark-600 flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" aria-hidden="true" /> High
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            {gi < groupedByDepth.length - 1 && (
              <div className="flex justify-center my-2">
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-dark-600 rotate-90" aria-hidden="true" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
