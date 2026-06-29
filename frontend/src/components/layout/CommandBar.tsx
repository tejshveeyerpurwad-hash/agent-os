import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bot, Loader2, CheckCircle2, ArrowRight, X, Command, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { commandExamples, createExecution, type WorkflowExecution } from '@/store/mockData'
import { useAppStore } from '@/store/appStore'

export function CommandBar() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [execution, setExecution] = useState<WorkflowExecution | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const filteredExamples = useMemo(() => {
    if (input.trim()) {
      return commandExamples.filter(c => c.toLowerCase().includes(input.toLowerCase()))
    }
    return commandExamples
  }, [input])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setShowResults(false)
        setExecution(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(-1)
  }, [input])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showResults) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, filteredExamples.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        selectExample(filteredExamples[activeIndex])
      } else if (e.key === 'Enter' && input.trim()) {
        e.preventDefault()
        executePrompt(input.trim())
      }
    }
  }

  function executePrompt(prompt: string) {
    setInput(prompt)
    setShowResults(true)
    const exec = createExecution(prompt)
    setExecution(exec)
    const steps = [...exec.steps]
    let stepIndex = 0
    const runStep = () => {
      if (stepIndex >= steps.length) {
        setExecution(prev => prev ? { ...prev, status: 'completed', result: `Successfully executed: "${prompt}"` } : prev)
        return
      }
      setExecution(prev => {
        if (!prev) return prev
        const updatedSteps = prev.steps.map((s, i) => ({
          ...s,
          status: i === stepIndex ? 'active' as const : i < stepIndex ? 'done' as const : 'pending' as const,
        }))
        return { ...prev, steps: updatedSteps, status: 'executing' as const }
      })
      setTimeout(() => {
        setExecution(prev => {
          if (!prev) return prev
          const updatedSteps = prev.steps.map((s, i) => ({
            ...s,
            status: i <= stepIndex ? 'done' as const : 'pending' as const,
          }))
          return { ...prev, steps: updatedSteps }
        })
        stepIndex++
        setTimeout(runStep, 600)
      }, 800)
    }
    runStep()
  }

  function selectExample(example: string) {
    executePrompt(example)
  }

  const isOpen = useAppStore(s => s.commandOpen)
  const setCommandOpen = useAppStore(s => s.setCommandOpen)

  return (
    <>
      <div className="px-3 sm:px-4 py-2 border-b border-dark-800 bg-dark-950/80 backdrop-blur-sm">
        <button
          onClick={() => setCommandOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700 text-xs text-dark-500 hover:text-dark-400 hover:border-dark-600 transition-all focus-ring"
          aria-label="Open command palette"
        >
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Ask AgentOS anything...</span>
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] text-dark-500 font-mono">
              <Command className="h-2.5 w-2.5 inline" aria-hidden="true" />K
            </kbd>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] bg-black/60 backdrop-blur-sm"
            onClick={() => { setCommandOpen(false); setShowResults(false); setExecution(null) }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl rounded-xl border border-dark-700 bg-dark-900 shadow-elevation-4 overflow-hidden mx-3 sm:mx-4"
            >
              <div className="flex items-center gap-3 px-3 sm:px-4 py-3 border-b border-dark-800">
                <Search className="h-4 w-4 text-dark-500 shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AgentOS to do something..."
                  aria-label="Command input"
                  aria-autocomplete="list"
                  aria-activedescendant={activeIndex >= 0 ? `cmd-item-${activeIndex}` : undefined}
                  role="combobox"
                  aria-expanded={!showResults}
                  className="flex-1 bg-transparent text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none min-w-0"
                />
                {showResults && (
                  <button onClick={() => { setShowResults(false); setExecution(null) }}
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors shrink-0 focus-ring"
                    aria-label="Back to suggestions">
                    Back
                  </button>
                )}
                <button onClick={() => { setCommandOpen(false); setShowResults(false); setExecution(null) }}
                  className="p-1 rounded text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors shrink-0 focus-ring"
                  aria-label="Close command palette">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {!showResults ? (
                <div className="p-2 max-h-72 overflow-y-auto" ref={listRef} role="listbox" aria-label="Suggestions">
                  <p className="px-2 py-1.5 text-xs text-dark-500 font-medium">Suggestions</p>
                  {filteredExamples.map((example, i) => (
                    <button
                      key={i}
                      id={`cmd-item-${i}`}
                      onClick={() => selectExample(example)}
                      role="option"
                      aria-selected={i === activeIndex}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all group focus-ring',
                        i === activeIndex ? 'bg-dark-800/70 text-dark-200' : 'text-dark-300 hover:bg-dark-800/50 hover:text-dark-200',
                      )}
                    >
                      <Sparkles className={cn('h-3.5 w-3.5 shrink-0', i === activeIndex ? 'text-primary-400' : 'text-dark-500 group-hover:text-primary-400')} aria-hidden="true" />
                      <span className="truncate">{example}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-dark-600 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 sm:p-4 max-h-72 overflow-y-auto">
                  {execution && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-800/30 border border-dark-800">
                        <Bot className="h-4 w-4 text-primary-400 shrink-0" aria-hidden="true" />
                        <span className="text-xs text-dark-300 truncate">{execution.prompt}</span>
                      </div>
                      <div className="space-y-1.5" role="list" aria-label="Execution steps">
                        {execution.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg transition-all" role="listitem">
                            <div className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                              step.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
                              step.status === 'active' ? 'bg-primary-500/10 text-primary-400' :
                              'bg-dark-800 text-dark-500',
                            )}>
                              {step.status === 'done' ? <CheckCircle2 className="h-3 w-3" /> :
                               step.status === 'active' ? <Loader2 className="h-3 w-3 animate-spin" /> :
                               <div className="h-1.5 w-1.5 rounded-full bg-dark-600" />}
                            </div>
                            <span className={cn(
                              'text-xs truncate',
                              step.status === 'done' ? 'text-dark-400' :
                              step.status === 'active' ? 'text-primary-400 font-medium' :
                              'text-dark-600',
                            )}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                      {execution.status === 'completed' && execution.result && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                          role="status"
                          aria-label="Execution completed"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                            <span className="text-xs font-medium text-emerald-400">Completed</span>
                          </div>
                          <p className="text-xs text-dark-400">{execution.result}</p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
