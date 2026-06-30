import { create } from 'zustand'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastStore {
  toasts: Toast[]
  addToast: (type: ToastType, title: string, message?: string) => void
  removeToast: (id: string) => void
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, title, message) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    set(state => ({ toasts: [...state.toasts, { id, type, title, message }] }))
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, 4000)
  },
  removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))

const icons: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-400',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  info: 'border-primary-500/30 bg-primary-500/10 text-primary-400',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={cn(
                'pointer-events-auto rounded-xl border p-3 flex items-start gap-2.5 shadow-elevation-3 backdrop-blur-sm',
                colors[toast.type],
              )}
            >
              <Icon className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{toast.title}</p>
                {toast.message && <p className="text-[10px] mt-0.5 opacity-80">{toast.message}</p>}
              </div>
              <button onClick={() => removeToast(toast.id)} className="p-0.5 rounded hover:bg-black/20 transition-colors shrink-0">
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export function useToast() {
  const addToast = useToastStore(s => s.addToast)
  return { toast: addToast }
}
