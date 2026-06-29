import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Brain, Activity, Clock, ChevronDown, ChevronUp, Cpu, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { AgentState } from '@/store/agentsStore'

const agentIcons: Record<string, typeof Bot> = {
  'agent-ceo': Bot,
  'agent-hr': Bot,
  'agent-finance': Bot,
  'agent-sales': Bot,
  'agent-marketing': Bot,
  'agent-ops': Bot,
  'agent-legal': Bot,
  'agent-support': Bot,
}

const agentAccents: Record<string, string> = {
  'agent-ceo': 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  'agent-hr': 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
  'agent-finance': 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
  'agent-sales': 'from-violet-500/20 to-violet-600/5 border-violet-500/20',
  'agent-marketing': 'from-pink-500/20 to-pink-600/5 border-pink-500/20',
  'agent-ops': 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
  'agent-legal': 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20',
  'agent-support': 'from-orange-500/20 to-orange-600/5 border-orange-500/20',
}

const accentColors: Record<string, string> = {
  'agent-ceo': 'text-blue-400',
  'agent-hr': 'text-emerald-400',
  'agent-finance': 'text-amber-400',
  'agent-sales': 'text-violet-400',
  'agent-marketing': 'text-pink-400',
  'agent-ops': 'text-cyan-400',
  'agent-legal': 'text-indigo-400',
  'agent-support': 'text-orange-400',
}

const accentBgs: Record<string, string> = {
  'agent-ceo': 'bg-blue-500/10',
  'agent-hr': 'bg-emerald-500/10',
  'agent-finance': 'bg-amber-500/10',
  'agent-sales': 'bg-violet-500/10',
  'agent-marketing': 'bg-pink-500/10',
  'agent-ops': 'bg-cyan-500/10',
  'agent-legal': 'bg-indigo-500/10',
  'agent-support': 'bg-orange-500/10',
}

interface AgentOrchestratorProps {
  agents: AgentState[]
  agentLogs: Record<string, { timestamp: string; action: string; detail: string; severity: string }[]>
}

function statusDot(status: string) {
  switch (status) {
    case 'running': return <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>
    case 'idle': return <span className="h-2 w-2 rounded-full bg-dark-600" />
    case 'paused': return <span className="h-2 w-2 rounded-full bg-amber-400" />
    case 'error': return <span className="h-2 w-2 rounded-full bg-red-400" />
    default: return <span className="h-2 w-2 rounded-full bg-dark-600" />
  }
}

export function AgentOrchestrator({ agents, agentLogs }: AgentOrchestratorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const activeCount = agents.filter(a => a.status === 'running').length

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-light">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary-400" />
          <span className="text-xs font-semibold text-dark-200">Agent Orchestrator</span>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-[9px] font-medium text-emerald-400"
            >
              {activeCount} active
            </motion.span>
          )}
          <span className="text-[10px] text-dark-500">{agents.length} agents</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {agents.map((agent, i) => {
          const isExpanded = expandedId === agent.id
          const logs = agentLogs[agent.id] || []
          const memoryUsage = Math.min(100, Math.round((agent.memory.length / 10) * 100))
          const Icon = agentIcons[agent.id] || Bot

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                'rounded-xl border transition-all duration-300 overflow-hidden',
                agent.status === 'running'
                  ? `bg-gradient-to-br ${agentAccents[agent.id] || 'border-primary-500/20'} shadow-sm`
                  : 'border-border-light bg-surface-elevated/50 hover:border-dark-700',
                isExpanded && 'ring-1 ring-primary-500/20',
              )}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : agent.id)}
                className="w-full flex items-center gap-2.5 p-2.5"
              >
                <div className={cn(
                  'p-1.5 rounded-lg shrink-0 transition-colors',
                  agent.status === 'running' ? accentBgs[agent.id] || 'bg-dark-800' : 'bg-dark-800/50',
                )}>
                  <Icon className={cn('h-3.5 w-3.5', accentColors[agent.id] || 'text-dark-400')} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-dark-200 truncate">{agent.name}</span>
                    {statusDot(agent.status)}
                  </div>
                  <p className="text-[10px] text-dark-500 truncate mt-0.5">{agent.role}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {agent.status === 'running' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    >
                      <Loader2 className="h-3 w-3 text-emerald-400" />
                    </motion.div>
                  )}
                  <div className="hidden sm:flex items-center gap-1">
                    <Cpu className="h-2.5 w-2.5 text-dark-600" />
                    <span className="text-[9px] text-dark-500">{memoryUsage}%</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3 text-dark-500" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-dark-500" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border-light"
                  >
                    <div className="p-2.5 space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="p-1.5 rounded-lg bg-dark-800/50">
                          <div className="text-[9px] text-dark-500">Tasks</div>
                          <div className="text-xs font-semibold text-dark-200">{agent.taskCount.toLocaleString()}</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-dark-800/50">
                          <div className="text-[9px] text-dark-500">Success</div>
                          <div className="text-xs font-semibold text-emerald-400">{agent.successRate}%</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-dark-800/50">
                          <div className="text-[9px] text-dark-500">Confidence</div>
                          <div className="text-xs font-semibold text-primary-400">{agent.confidence}%</div>
                        </div>
                      </div>

                      {agent.currentTask && (
                        <div className={cn(
                          'p-2 rounded-lg text-[10px] leading-relaxed',
                          'bg-primary-500/5 border border-primary-500/10 text-dark-300',
                        )}>
                          <div className="flex items-center gap-1 mb-1">
                            <Activity className="h-2.5 w-2.5 text-primary-400" />
                            <span className="text-[9px] font-medium text-primary-400">Current Task</span>
                          </div>
                          {agent.currentTask}
                        </div>
                      )}

                      {agent.memory.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-1.5">
                            <Brain className="h-2.5 w-2.5 text-dark-500" />
                            <span className="text-[9px] font-medium text-dark-500 uppercase tracking-wider">Memory</span>
                          </div>
                          <div className="space-y-1">
                            {agent.memory.slice(0, 3).map((m, j) => (
                              <div key={j} className="flex items-start gap-1.5 text-[9px] text-dark-400">
                                <div className="w-0.5 h-0.5 rounded-full bg-dark-600 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {logs.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-1.5">
                            <Clock className="h-2.5 w-2.5 text-dark-500" />
                            <span className="text-[9px] font-medium text-dark-500 uppercase tracking-wider">Activity Log</span>
                          </div>
                          <div className="space-y-0.5 max-h-24 overflow-y-auto">
                            {logs.slice(-5).reverse().map((log, j) => (
                              <div key={j} className="flex items-start gap-1.5 text-[9px]">
                                <span className="text-dark-600 shrink-0 font-mono">
                                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className={cn(
                                  log.severity === 'success' ? 'text-emerald-400' :
                                  log.severity === 'error' ? 'text-red-400' :
                                  log.severity === 'warning' ? 'text-amber-400' :
                                  'text-dark-400',
                                )}>{log.action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[9px] text-dark-600">
                        <Clock className="h-2.5 w-2.5" />
                        Last: {agent.lastAction}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
