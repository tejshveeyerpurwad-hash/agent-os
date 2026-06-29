import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { AlertCircle, CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react'
import { useExecutionEngine } from '@/store/executionEngine'


export function ApprovalPanel() {
  const { approvals, approveTask, rejectTask } = useExecutionEngine()
  const pending = approvals.filter(a => a.status === 'pending')

  if (pending.length === 0) return null

  return (
    <div className="border-t border-dark-800 bg-dark-950">
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
          <p className="text-xs font-medium text-amber-400">Approvals Required</p>
          <span className="text-[10px] text-dark-500 ml-1">({pending.length})</span>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          <AnimatePresence>
            {pending.map((apr, i) => {
              return (
                <motion.div
                  key={apr.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-dark-800/50 border border-amber-500/10"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                      apr.urgency === 'high' ? 'bg-amber-500/10 text-amber-400' : 'bg-dark-800 text-dark-400',
                    )}>
                      {apr.urgency === 'high' ? <AlertCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-dark-200 truncate">{apr.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-dark-500">
                        <span>{apr.urgency === 'high' ? 'High priority' : 'Standard'}</span>
                        {apr.amount && (
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="h-2.5 w-2.5" /> {apr.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => rejectTask(apr.id)}
                      className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors">
                      <XCircle className="h-4 w-4" />
                    </button>
                    <button onClick={() => approveTask(apr.id)}
                      className="p-1.5 rounded text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
