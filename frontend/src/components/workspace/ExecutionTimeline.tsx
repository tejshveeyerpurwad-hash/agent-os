import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, Loader2, AlertCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ExecutionPhase } from '@/types/execution'

interface TimelineEntry {
  phase: ExecutionPhase
  timestamp: string
  detail: string
}

interface ExecutionTimelineProps {
  history: TimelineEntry[]
  isActive: boolean
}

const phaseColors: Record<string, string> = {
  analyzing: 'text-blue-400 bg-blue-500/10',
  planning: 'text-violet-400 bg-violet-500/10',
  decomposing: 'text-emerald-400 bg-emerald-500/10',
  assigning_agents: 'text-amber-400 bg-amber-500/10',
  executing: 'text-primary-400 bg-primary-500/10',
  querying_knowledge: 'text-cyan-400 bg-cyan-500/10',
  awaiting_approval: 'text-pink-400 bg-pink-500/10',
  completed: 'text-emerald-400 bg-emerald-500/10',
  failed: 'text-red-400 bg-red-500/10',
}

const phaseIcons: Record<string, typeof CheckCircle2> = {
  analyzing: Loader2,
  planning: Loader2,
  decomposing: Loader2,
  assigning_agents: Loader2,
  executing: Loader2,
  querying_knowledge: Loader2,
  awaiting_approval: AlertTriangle,
  completed: CheckCircle2,
  failed: AlertCircle,
}

export function ExecutionTimeline({ history, isActive }: ExecutionTimelineProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [history.length, isActive])

  if (history.length === 0) return null

  return (
    <div className="rounded-2xl border border-border-light bg-surface-elevated/60 overflow-hidden">
      <div className="p-3 border-b border-border-light">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-400" />
          <h3 className="text-xs font-semibold text-dark-200">Execution Timeline</h3>
          {isActive && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1.5 ml-auto"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-emerald-400">Live</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-h-[280px] overflow-y-auto p-3">
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-dark-800" />

          <div className="space-y-0">
            <AnimatePresence initial={false}>
              {history.map((entry, i) => {
                const isLast = i === history.length - 1
                const Icon = phaseIcons[entry.phase] || Loader2
                const isCurrentPhase = isLast && isActive

                return (
                  <motion.div
                    key={`${entry.timestamp}-${i}`}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    transition={{ duration: 0.3, delay: isCurrentPhase ? 0 : 0 }}
                    className="relative pl-8 pb-3 last:pb-0"
                  >
                    <div className={cn(
                      'absolute left-[5px] p-1 rounded-full transition-all duration-500',
                      entry.phase === 'completed' ? 'bg-emerald-500/20' :
                      entry.phase === 'failed' ? 'bg-red-500/20' :
                      entry.phase === 'awaiting_approval' ? 'bg-amber-500/20' :
                      'bg-primary-500/20',
                      isCurrentPhase && 'ring-2 ring-primary-500/30',
                    )}>
                      {isCurrentPhase ? (
                        <Icon className="h-3 w-3 animate-spin text-primary-400" />
                      ) : (
                        <Icon className={cn(
                          'h-3 w-3',
                          entry.phase === 'completed' ? 'text-emerald-400' :
                          entry.phase === 'failed' ? 'text-red-400' :
                          entry.phase === 'awaiting_approval' ? 'text-amber-400' :
                          'text-primary-400',
                        )} />
                      )}
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={cn(
                            'text-[9px] font-medium px-1.5 py-0.5 rounded',
                            phaseColors[entry.phase] || 'text-dark-400 bg-dark-800',
                          )}>
                            {entry.phase.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[9px] text-dark-600 font-mono">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-dark-400 leading-relaxed mt-0.5">{entry.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
