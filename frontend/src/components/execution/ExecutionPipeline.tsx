import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Bot, BrainCircuit, CheckCircle2, Loader2, Workflow, Terminal, ShieldCheck, Sparkles } from 'lucide-react'
import type { ExecutionPhase } from '@/types/execution'

interface Stage {
  phase: ExecutionPhase
  label: string
  icon: typeof Bot
  description: string
}

const stages: Stage[] = [
  { phase: 'analyzing', label: 'Analyze', icon: BrainCircuit, description: 'Understanding objective' },
  { phase: 'planning', label: 'Plan', icon: Workflow, description: 'Creating execution plan' },
  { phase: 'decomposing', label: 'Decompose', icon: Bot, description: 'Breaking into tasks' },
  { phase: 'assigning_agents', label: 'Assign', icon: Bot, description: 'Assigning agents' },
  { phase: 'executing', label: 'Execute', icon: Terminal, description: 'Running tasks in parallel' },
  { phase: 'completed', label: 'Complete', icon: ShieldCheck, description: 'Objective achieved' },
]

interface ExecutionPipelineProps {
  phase: ExecutionPhase
  completedCount?: number
  totalCount?: number
}

export function ExecutionPipeline({ phase, completedCount = 0, totalCount = 0 }: ExecutionPipelineProps) {
  const currentIdx = stages.findIndex(s => s.phase === phase)
  const displayIdx = currentIdx >= 0 ? currentIdx : (phase === 'awaiting_approval' ? 4 : 0)

  return (
    <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary-400" />
          <h2 className="text-sm font-semibold text-dark-200">Execution Pipeline</h2>
        </div>
        <span className={cn(
          'text-xs font-medium px-2 py-0.5 rounded-full',
          phase === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
          phase === 'failed' ? 'bg-red-500/10 text-red-400' :
          phase === 'awaiting_approval' ? 'bg-amber-500/10 text-amber-400' :
          'bg-primary-500/10 text-primary-400',
        )}>
          {phase === 'awaiting_approval' ? 'awaiting approval' : phase}
        </span>
      </div>
      <div className="p-4 lg:p-6">
        <div className="flex items-start gap-0">
          {stages.map((stage, i) => {
            const isDone = i < displayIdx
            const isCurrent = i === displayIdx
            const isPending = i > displayIdx
            const Icon = stage.icon

            return (
              <div key={stage.phase} className="flex-1 flex flex-col items-center text-center relative">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-500 relative z-10',
                  isDone ? 'bg-emerald-500/10 text-emerald-400' :
                  isCurrent ? 'bg-primary-500/10 text-primary-400 ring-2 ring-primary-500/30' :
                  'bg-dark-800 text-dark-500',
                )}>
                  {isDone ? <CheckCircle2 className="h-5 w-5" /> :
                   isCurrent && phase === 'executing' ? <Loader2 className="h-5 w-5 animate-spin" /> :
                   isCurrent && phase === 'awaiting_approval' ? <ShieldCheck className="h-5 w-5 text-amber-400" /> :
                   <Icon className="h-5 w-5" />}
                </div>
                <p className={cn(
                  'text-[11px] font-medium leading-tight mb-0.5',
                  isDone ? 'text-emerald-400' : isCurrent ? 'text-primary-400' : 'text-dark-600',
                )}>{stage.label}</p>
                <p className={cn(
                  'text-[10px] hidden sm:block',
                  isDone ? 'text-dark-500' : isCurrent ? 'text-dark-400' : 'text-dark-700',
                )}>{stage.description}</p>
                {i < stages.length - 1 && (
                  <div className={cn(
                    'hidden lg:block absolute top-5 left-[55%] w-[90%] h-px z-0',
                    isDone ? 'bg-emerald-500/50' :
                    isCurrent ? 'bg-gradient-to-r from-primary-500/50 to-dark-800' :
                    'bg-dark-800',
                  )} />
                )}
              </div>
            )
          })}
        </div>

        {totalCount > 0 && (
          <div className="mt-4 pt-3 border-t border-dark-800 flex items-center justify-between text-xs">
            <span className="text-dark-500">
              Progress: {completedCount}/{totalCount} tasks
            </span>
            <div className="flex-1 mx-4 h-1.5 bg-dark-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-400"
              />
            </div>
            <span className="text-dark-500 font-medium">
              {Math.round((completedCount / totalCount) * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
