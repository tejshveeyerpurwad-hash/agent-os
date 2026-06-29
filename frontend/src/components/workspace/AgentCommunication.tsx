import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ArrowRight, Bot } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface AgentMessage {
  id: string
  from: string
  to: string
  message: string
  timestamp: string
  type: 'request' | 'response' | 'update'
}

const agentColors: Record<string, string> = {
  'agent-ceo': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  'agent-hr': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  'agent-finance': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  'agent-sales': 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  'agent-marketing': 'border-pink-500/30 bg-pink-500/10 text-pink-400',
  'agent-ops': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  'agent-legal': 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
  'agent-support': 'border-orange-500/30 bg-orange-500/10 text-orange-400',
}

const agentNames: Record<string, string> = {
  'agent-ceo': 'CEO',
  'agent-hr': 'HR',
  'agent-finance': 'Finance',
  'agent-sales': 'Sales',
  'agent-marketing': 'Marketing',
  'agent-ops': 'Ops',
  'agent-legal': 'Legal',
  'agent-support': 'Support',
}

const messageTypeIcons: Record<string, typeof ArrowRight> = {
  request: ArrowRight,
  response: ArrowRight,
  update: ArrowRight,
}

interface AgentCommunicationProps {
  messages: AgentMessage[]
  isActive: boolean
}

export function AgentCommunication({ messages, isActive }: AgentCommunicationProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, isActive])

  if (messages.length === 0) return null

  return (
    <div className="rounded-2xl border border-border-light bg-surface-elevated/60 overflow-hidden">
      <div className="p-3 border-b border-border-light">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary-400" />
          <h3 className="text-xs font-semibold text-dark-200">Agent Communication</h3>
          {isActive && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-auto flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-emerald-400">{messages.length} messages</span>
            </motion.span>
          )}
        </div>
      </div>

      <div className="max-h-[240px] overflow-y-auto p-3">
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const Icon = messageTypeIcons[msg.type] || ArrowRight

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: Math.max(0, (i - messages.length + 5) * 0.05) }}
                  className={cn(
                    'p-2.5 rounded-xl border text-[10px] leading-relaxed transition-all',
                    'border-border-light bg-dark-800/30 hover:bg-dark-800/50',
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded-md text-[9px] font-medium border',
                      agentColors[msg.from] || 'border-dark-700 bg-dark-800 text-dark-400',
                    )}>
                      {agentNames[msg.from] || msg.from}
                    </span>
                    <Icon className="h-2.5 w-2.5 text-dark-600" />
                    <span className={cn(
                      'px-1.5 py-0.5 rounded-md text-[9px] font-medium border',
                      agentColors[msg.to] || 'border-dark-700 bg-dark-800 text-dark-400',
                    )}>
                      {agentNames[msg.to] || msg.to}
                    </span>
                    <span className="ml-auto text-[8px] text-dark-600 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-dark-400">{msg.message}</p>
                  {msg.type === 'response' && (
                    <div className="mt-1 flex items-center gap-1 text-[8px] text-emerald-500">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      Response received
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
