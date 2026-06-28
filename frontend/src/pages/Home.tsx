import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, CheckCircle2, Loader2, AlertCircle, Terminal, Activity, Zap, ArrowUp, Clock, Shield, Users } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExecutionEngine } from '@/store/executionEngine'
import { useAgentsStore } from '@/store/agentsStore'
import { useActivityStore } from '@/store/activityStore'
import { ExecutionPipeline } from '@/components/execution/ExecutionPipeline'

export function Home() {
  const { executions, currentExecution, isProcessing, approvals } = useExecutionEngine()
  const agents = useAgentsStore(s => s.agents)
  const events = useActivityStore(s => s.events)

  const runningAgents = agents.filter(a => a.status === 'running')
  const completedExecs = executions.filter(e => e.phase === 'completed')
  const pendingApprovals = approvals.filter(a => a.status === 'pending')
  const totalTasks = agents.reduce((s, a) => s + a.taskCount, 0)
  const avgSuccess = Math.round(agents.reduce((s, a) => s + a.successRate, 0) / agents.length)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Command Center</h1>
          <p className="text-sm text-dark-400 mt-0.5">Real-time business execution overview</p>
        </div>
        {isProcessing && (
          <div className="flex items-center gap-1.5 text-xs text-primary-400 bg-primary-500/10 px-3 py-1.5 rounded-full">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Execution in progress
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Agents', value: runningAgents.length.toString(), icon: Bot, detail: `${agents.length} total`, change: runningAgents.length > 0 ? `${runningAgents.length} running` : 'All idle', positive: true },
          { label: 'Tasks Completed', value: totalTasks.toLocaleString(), icon: CheckCircle2, detail: 'All time', change: `+${executions.length} executions`, positive: true },
          { label: 'Success Rate', value: `${avgSuccess}%`, icon: Shield, detail: `Across ${agents.length} agents`, change: '+2.1%', positive: true },
          { label: 'Pending Approvals', value: pendingApprovals.length.toString(), icon: AlertCircle, detail: 'Requires action', change: pendingApprovals.length > 0 ? `${pendingApprovals.length} pending` : 'None', positive: pendingApprovals.length === 0 },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-dark-800 bg-dark-900/50 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-dark-800">
                  <Icon className="h-4 w-4 text-dark-400" />
                </div>
                <span className="text-xs text-dark-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-dark-100">{stat.value}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={cn('text-xs', stat.positive ? 'text-emerald-400' : 'text-amber-400')}>
                  {stat.change}
                </span>
                <span className="text-[11px] text-dark-600">{stat.detail}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {currentExecution && (
            <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-dark-800 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary-400" />
                <h2 className="text-sm font-semibold text-dark-200 flex-1">Current Execution</h2>
                <span className="text-xs text-dark-500">{currentExecution.completedCount}/{currentExecution.totalCount} tasks</span>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-dark-100 mb-3">{currentExecution.objective}</p>
                <ExecutionPipeline
                  phase={currentExecution.phase}
                  completedCount={currentExecution.completedCount}
                  totalCount={currentExecution.totalCount}
                />
                {currentExecution.plan && (
                  <div className="mt-3 space-y-1.5">
                    {currentExecution.plan.subtasks.slice(0, 5).map((task, i) => {
                      const agent = agents.find(a => a.id === task.agentId)
                      return (
                        <div key={task.id} className="flex items-center gap-2.5 text-xs">
                          <div className={cn(
                            'w-4 h-4 rounded flex items-center justify-center shrink-0',
                            task.status === 'completed' ? 'bg-emerald-500/10' :
                            task.status === 'running' ? 'bg-primary-500/10' :
                            task.status === 'awaiting_approval' ? 'bg-amber-500/10' :
                            'bg-dark-800',
                          )}>
                            {task.status === 'completed' ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> :
                             task.status === 'running' ? <Loader2 className="h-3 w-3 animate-spin text-primary-400" /> :
                             task.status === 'awaiting_approval' ? <AlertCircle className="h-3 w-3 text-amber-400" /> :
                             <span className="text-[9px] text-dark-500">{i + 1}</span>}
                          </div>
                          <span className={cn(
                            'flex-1',
                            task.status === 'completed' ? 'text-dark-500' :
                            task.status === 'running' ? 'text-primary-400' :
                            task.status === 'awaiting_approval' ? 'text-amber-400' :
                            'text-dark-400',
                          )}>{task.description}</span>
                          {agent && <span className="text-[10px] text-dark-600">{agent.name}</span>}
                        </div>
                      )
                    })}
                  </div>
                )}
                {currentExecution.phase === 'completed' && currentExecution.result && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-xs text-emerald-400 font-medium mb-1">Result</p>
                    <pre className="text-xs text-dark-400 whitespace-pre-wrap font-sans">{currentExecution.result}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-dark-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-dark-200 flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary-400" /> Agent Status
              </h2>
              <span className="text-xs text-dark-500">{runningAgents.length} running</span>
            </div>
            <div className="divide-y divide-dark-800">
              {agents.slice(0, 5).map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-dark-800/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-dark-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-dark-200">{agent.name}</p>
                    <p className="text-[10px] text-dark-500">{agent.currentTask || agent.role}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <span className="text-dark-500">{agent.confidence}%</span>
                    <span className="text-dark-600">{agent.taskCount.toLocaleString()} tasks</span>
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      agent.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                      agent.status === 'idle' ? 'bg-dark-500' :
                      agent.status === 'paused' ? 'bg-amber-400' :
                      agent.status === 'error' ? 'bg-red-400' :
                      'bg-dark-500',
                    )} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-dark-800">
              <h2 className="text-sm font-semibold text-dark-200 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary-400" /> Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-dark-800">
              {events.slice(0, 6).map((event) => (
                <div key={event.id} className="flex items-start gap-3 px-4 py-2.5">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-1.5 shrink-0',
                    event.severity === 'success' ? 'bg-emerald-400' :
                    event.severity === 'warning' ? 'bg-amber-400' :
                    event.severity === 'error' ? 'bg-red-400' : 'bg-dark-500',
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-dark-200">{event.action}</p>
                    <p className="text-[10px] text-dark-500 truncate">{event.detail}</p>
                  </div>
                  <span className="text-[10px] text-dark-600 shrink-0">
                    {timeAgo(event.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {currentExecution && (
            <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
              <h2 className="text-sm font-semibold text-dark-200 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary-400" /> Execution Status
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-dark-500">Phase</span>
                  <span className={cn(
                    'font-medium',
                    currentExecution.phase === 'completed' ? 'text-emerald-400' :
                    currentExecution.phase === 'failed' ? 'text-red-400' :
                    'text-primary-400',
                  )}>{currentExecution.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-500">Completed</span>
                  <span className="text-dark-200">{currentExecution.completedCount}/{currentExecution.totalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-500">Agents Active</span>
                  <span className="text-dark-200">{runningAgents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-500">Pending Approvals</span>
                  <span className={cn(pendingApprovals.length > 0 ? 'text-amber-400' : 'text-dark-200')}>{pendingApprovals.length}</span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
            <h2 className="text-sm font-semibold text-dark-200 mb-3">System Health</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-dark-500">Online agents</span>
                <span className="text-emerald-400 font-medium">{agents.filter(a => a.status !== 'error').length}/{agents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Avg confidence</span>
                <span className="text-dark-200 font-medium">{Math.round(agents.reduce((s, a) => s + a.confidence, 0) / agents.length)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Avg success rate</span>
                <span className="text-emerald-400 font-medium">{avgSuccess}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Executions today</span>
                <span className="text-dark-200 font-medium">{completedExecs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Total tasks</span>
                <span className="text-dark-200 font-medium">{totalTasks.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
            <h2 className="text-sm font-semibold text-dark-200 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'New Execution', href: '/workspace', icon: Terminal },
                { label: 'View Planner', href: '/planner', icon: Activity },
                { label: 'Agent Overview', href: '/agents', icon: Users },
              ].map(action => {
                const Icon = action.icon
                return (
                  <a key={action.label} href={action.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-dark-400 bg-dark-800/30 hover:bg-dark-800 hover:text-dark-200 transition-all border border-transparent hover:border-dark-700">
                    <Icon className="h-3.5 w-3.5" />
                    {action.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  return `${d}d ago`
}
