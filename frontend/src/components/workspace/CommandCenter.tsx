import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, History, Zap, Bot, Workflow, TrendingUp, ArrowRight, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Suggestion {
  label: string
  icon: typeof Bot
  prompt: string
}

const suggestions: Suggestion[] = [
  { label: 'Hire engineers', icon: Bot, prompt: 'Hire two senior frontend engineers with React expertise' },
  { label: 'Launch campaign', icon: TrendingUp, prompt: 'Launch a Q3 marketing campaign for our AI platform' },
  { label: 'Financial review', icon: Zap, prompt: 'Review Q2 financial performance and prepare budget forecast' },
  { label: 'Contract review', icon: Workflow, prompt: 'Review and redline the supplier agreement from TechCorp' },
]

interface RecentPrompt {
  text: string
  time: string
}

interface CommandCenterProps {
  onSubmit: (prompt: string) => void
  isProcessing: boolean
  recentPrompts: RecentPrompt[]
  onSuggestion: (prompt: string) => void
}

export function CommandCenter({ onSubmit, isProcessing, recentPrompts, onSuggestion }: CommandCenterProps) {
  const [input, setInput] = useState('')
  const [showRecent, setShowRecent] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 100) + 'px'
    }
  }, [input])

  function handleSubmit() {
    if (!input.trim() || isProcessing) return
    onSubmit(input.trim())
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative">
      <div className={cn(
        'rounded-2xl border transition-all duration-500',
        isProcessing
          ? 'border-primary-500/40 bg-gradient-to-b from-primary-500/[0.03] to-transparent shadow-glow'
          : 'border-border-light bg-surface-elevated/80 hover:border-primary-500/20',
      )}>
        <div className="p-1">
          <div className="flex items-start gap-2 px-4 pt-3">
            <div className={cn(
              'p-2 rounded-xl shrink-0 transition-all duration-300',
              isProcessing
                ? 'bg-primary-500/20 text-primary-400'
                : 'bg-dark-800/50 text-dark-500',
            )}>
              {isProcessing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isProcessing ? 'Execution in progress...' : 'Describe a business objective in natural language...'}
              disabled={isProcessing}
              rows={1}
              className="flex-1 bg-transparent py-2.5 text-sm text-dark-100 placeholder:text-dark-500 resize-none focus:outline-none disabled:opacity-50 leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRecent(!showRecent)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all',
                showRecent
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-dark-500 hover:text-dark-400 hover:bg-dark-800/50',
              )}
            >
              <History className="h-3 w-3" />
              Recent
            </button>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[10px] text-dark-600 px-1">Quick:</span>
              {suggestions.slice(0, 2).map((s) => (
                <button
                  key={s.label}
                  onClick={() => onSuggestion(s.prompt)}
                  disabled={isProcessing}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-dark-500 hover:text-dark-300 hover:bg-dark-800/50 transition-all disabled:opacity-30"
                >
                  <s.icon className="h-2.5 w-2.5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-[10px] text-dark-600">
              <kbd className="px-1 py-0.5 rounded bg-dark-800 font-mono text-[9px]">Enter</kbd> to send
            </span>
            <motion.button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              whileHover={input.trim() && !isProcessing ? { scale: 1.02 } : {}}
              whileTap={input.trim() && !isProcessing ? { scale: 0.98 } : {}}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all',
                isProcessing
                  ? 'bg-dark-800 text-dark-500 cursor-not-allowed'
                  : input.trim()
                    ? 'bg-primary-500/90 text-white hover:bg-primary-500 shadow-glow'
                    : 'bg-dark-800 text-dark-500 cursor-not-allowed',
              )}
            >
              {isProcessing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Sparkles className="h-3 w-3" />
                </motion.div>
              ) : (
                <Send className="h-3 w-3" />
              )}
              {isProcessing ? 'Executing...' : 'Execute'}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showRecent && recentPrompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-border-light bg-surface-elevated/90 backdrop-blur-sm p-2">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-[10px] font-medium text-dark-400 uppercase tracking-wider">Recent Prompts</span>
                <button onClick={() => setShowRecent(false)} className="text-dark-500 hover:text-dark-400">
                  <X className="h-3 w-3" />
                </button>
              </div>
              {recentPrompts.map((p, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => { onSuggestion(p.text); setShowRecent(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs text-dark-400 hover:text-dark-200 hover:bg-dark-800/50 transition-all group"
                >
                  <History className="h-3 w-3 shrink-0 text-dark-600" />
                  <span className="truncate flex-1">{p.text}</span>
                  <span className="text-[9px] text-dark-600 shrink-0">{p.time}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-dark-500" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!input && !isProcessing && recentPrompts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSuggestion(s.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800/40 border border-border-light text-xs text-dark-400 hover:text-dark-200 hover:border-primary-500/30 hover:bg-primary-500/[0.03] transition-all group"
              >
                <s.icon className="h-3 w-3 group-hover:text-primary-400 transition-colors" />
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
