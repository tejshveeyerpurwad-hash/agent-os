import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Lightbulb, CheckCircle2, ListOrdered, ArrowRight, BrainCircuit } from 'lucide-react'

interface PlannerReasoningProps {
  reasoning: string[]
  isActive?: boolean
}

export function PlannerReasoning({ reasoning, isActive = true }: PlannerReasoningProps) {
  return (
    <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
      <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <BrainCircuit className="h-3.5 w-3.5 text-primary-400" />
        Planner Reasoning
      </h3>
      <div className="space-y-2">
        {reasoning.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2.5"
          >
            <div className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300',
              i === reasoning.length - 1 ? 'bg-emerald-500/10' :
              isActive ? 'bg-primary-500/10' :
              'bg-dark-800',
            )}>
              {i === reasoning.length - 1 ? (
                <CheckCircle2 className={cn('h-3 w-3', i === reasoning.length - 1 ? 'text-emerald-400' : 'text-primary-400')} />
              ) : i === 0 ? (
                <Lightbulb className="h-3 w-3 text-amber-400" />
              ) : (
                <ListOrdered className={cn('h-3 w-3', isActive ? 'text-primary-400' : 'text-dark-500')} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-xs leading-relaxed',
                i === reasoning.length - 1 ? 'text-emerald-400 font-medium' :
                isActive ? 'text-dark-400' :
                'text-dark-500',
              )}>{step}</p>
              {i < reasoning.length - 1 && (
                <ArrowRight className="h-3 w-3 text-dark-700 mt-1" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
