import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit, ListChecks, Bot, Cpu, Database, FileText, CheckCircle2,
  Loader2, AlertCircle, Clock,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ExecutionPhase } from '@/types/execution'

interface Stage {
  phase: ExecutionPhase
  label: string
  icon: typeof BrainCircuit
  color: string
}

const stages: Stage[] = [
  { phase: 'analyzing', label: 'Analyzing', icon: BrainCircuit, color: 'text-blue-400' },
  { phase: 'planning', label: 'Planning', icon: ListChecks, color: 'text-violet-400' },
  { phase: 'decomposing', label: 'Decomposing', icon: Bot, color: 'text-emerald-400' },
  { phase: 'assigning_agents', label: 'Assigning', icon: Bot, color: 'text-amber-400' },
  { phase: 'executing', label: 'Executing', icon: Cpu, color: 'text-primary-400' },
  { phase: 'querying_knowledge', label: 'Knowledge', icon: Database, color: 'text-cyan-400' },
  { phase: 'awaiting_approval', label: 'Approval', icon: FileText, color: 'text-pink-400' },
  { phase: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
]

const phaseIndex: Record<string, number> = {
  idle: -1,
  analyzing: 0,
  planning: 1,
  decomposing: 2,
  assigning_agents: 3,
  executing: 4,
  querying_knowledge: 5,
  awaiting_approval: 6,
  completed: 7,
  failed: 7,
}

interface WorkflowExecutionProps {
  phase: ExecutionPhase
  completedCount: number
  totalCount: number
  objective: string
}

export function WorkflowExecution({ phase, completedCount, totalCount, objective }: WorkflowExecutionProps) {
  const currentIdx = phaseIndex[phase] ?? -1
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border-light bg-surface-elevated/60 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-500/10">
              <Cpu className="h-4 w-4 text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark-100">Execution Pipeline</h3>
              <p className="text-[10px] text-dark-500 mt-0.5">Real-time workflow execution status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {phase === 'executing' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Loader2 className="h-4 w-4 text-emerald-400 animate-spin" />
              </motion.div>
            )}
            <span className={cn(
              'px-2 py-0.5 rounded-full text-[9px] font-medium',
              phase === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
              phase === 'failed' ? 'bg-red-500/20 text-red-400' :
              phase === 'awaiting_approval' ? 'bg-amber-500/20 text-amber-400' :
              'bg-primary-500/20 text-primary-400',
            )}>
              {phase === 'executing' ? `${progress}%` : phase.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            {stages.map((stage, i) => {
              const isActive = i === currentIdx
              const isDone = i < currentIdx
              const Icon = stage.icon

              return (
                <div key={stage.phase} className="flex flex-col items-center gap-1.5 relative z-10">
                  <motion.div
                    animate={isActive ? {
                      scale: [1, 1.15, 1],
                      transition: { repeat: Infinity, duration: 2 },
                    } : {}}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-500',
                      isDone ? `${stage.color.replace('text', 'bg')}/20 ${stage.color}` :
                      isActive ? `bg-primary-500/20 ${stage.color} ring-2 ring-primary-500/30` :
                      'bg-dark-800/50 text-dark-600',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </motion.div>
                  <span className={cn(
                    'text-[8px] font-medium whitespace-nowrap transition-colors duration-500',
                    isDone ? stage.color : isActive ? 'text-primary-400' : 'text-dark-600',
                  )}>
                    {stage.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="absolute top-3.5 left-0 right-0 h-px bg-dark-800 -z-0">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(currentIdx + 1) / stages.length * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-emerald-400"
            />
          </div>
        </div>

        {phase === 'executing' && totalCount > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] mb-1.5">
              <span className="text-dark-400">Task Progress</span>
              <span className="text-dark-300 font-medium">{completedCount}/{totalCount} completed</span>
            </div>
            <div className="h-1.5 rounded-full bg-dark-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-400"
              />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {currentIdx >= 0 && phase !== 'completed' && phase !== 'failed' && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-border-light"
          >
            <div className="p-3 flex items-center gap-2 text-[10px] text-dark-400">
              <Clock className="h-3 w-3 text-dark-500" />
              <span>Current phase: <span className="text-primary-400 font-medium">{stages[currentIdx]?.label || phase}</span></span>
              <span className="text-dark-700">·</span>
              <span className="text-dark-500">{objective.slice(0, 60)}{objective.length > 60 ? '...' : ''}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'completed' && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="overflow-hidden border-t border-emerald-500/20 bg-emerald-500/[0.02]"
        >
          <div className="p-3 flex items-center gap-2 text-[10px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>All {totalCount} tasks completed successfully</span>
          </div>
        </motion.div>
      )}

      {phase === 'failed' && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="overflow-hidden border-t border-red-500/20 bg-red-500/[0.02]"
        >
          <div className="p-3 flex items-center gap-2 text-[10px] text-red-400">
            <AlertCircle className="h-3 w-3" />
            <span>Execution failed — check agent logs for details</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
