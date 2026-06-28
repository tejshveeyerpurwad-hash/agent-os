import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bot, Workflow, CheckCircle2, Clock, AlertCircle, Terminal, BrainCircuit, Activity, Users, ArrowUp, ArrowDown, Zap, DollarSign, Loader2, Hexagon, Play, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExecutionEngine } from '@/store/executionEngine'
import { useAgentsStore } from '@/store/agentsStore'
import { useActivityStore } from '@/store/activityStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Home() {
  const { executions, currentExecution, approvals, isProcessing } = useExecutionEngine()
  const agents = useAgentsStore(s => s.agents)
  const events = useActivityStore(s => s.events)
  const [showAllAgents, setShowAllAgents] = useState(false)

  const runningAgents = agents.filter(a => a.status === 'running')
  const completedExecs = executions.filter(e => e.phase === 'completed')
  const pendingApprovals = approvals.filter(a => a.status === 'pending')

  const totalTasks = agents.reduce((s, a) => s + a.taskCount, 0)
  const avgSuccess = Math.round(agents.reduce((s, a) => s + a.successRate, 0) / agents.length)
  const avgConfidence = Math.round(agents.reduce((s, a) => s + a.confidence, 0) / agents.length)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Command Center</h1>
          <p className="text-sm text-dark-400 mt-0.5">Real-time business execution overview</p>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <div className="flex items-center gap-1.5 text-xs text-primary-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Executing...
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Agents', value: agents.filter(a => a.status === 'running').length.toString(), icon: Bot, change: '+2', positive: true, detail: `${agents.length} total` },
          { label: 'Tasks Completed', value: totalTasks.toLocaleString(), icon: CheckCircle2, change: '+12.3%', positive: true, detail: 'All time' },
          { label: 'Success Rate', value: `${avgSuccess}%`, icon: Activity, change: '+3.1%', positive: true, detail: `Across ${agents.length} agents` },
          { label: 'Pending Approvals', value: pendingApprovals.length.toString(), icon: AlertCircle, change: pendingApprovals.length > 0 ? '+1' : '0', positive: pendingApprovals.length === 0, detail: 'Requires attention' },
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
                <span className={cn('text-xs', stat.positive ? 'text-emerald-400' : 'text-red-400')}>
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
              <div className="px-4 py-3 border-b border-dark-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-dark-200 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary-400" /> Current Execution
                </h2>
                <Badge variant={
                  currentExecution.phase === 'completed' ? 'success' :
                  currentExecution.phase === 'failed' ? 'danger' :
                  currentExecution.phase === 'awaiting_approval' ? 'warning' : 'primary'
                } size="sm">
                  {currentExecution.phase}
                </Badge>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-dark-200 mb-3">{currentExecution.objective}</p>
                {currentExecution.plan && (
                  <div className="space-y-1.5">
                    {currentExecution.plan.subtasks.slice(0, 5).map((task, i) => {
                      const agent = agents.find(a => a.id === task.agentId)
                      return (
                        <div key={task.id} className="flex items-center gap-2.5 text-xs">
                          <div className={cn(
                            'w-4 h-4 rounded flex items-center justify-center shrink-0',
                            task.status === 'completed' ? 'bg-emerald-500/10' :
                            task.status === 'running' ? 'bg-primary-500/10' : 'bg-dark-800',
                          )}>
                            {task.status === 'completed' ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> :
                             task.status === 'running' ? <Loader2 className="h-3 w-3 animate-spin text-primary-400" /> :
                             <span className="text-[9px] text-dark-500">{i + 1}</span>}
                          </div>
                          <span className={cn(
                            'flex-1',
                            task.status === 'completed' ? 'text-dark-500' :
                            task.status === 'running' ? 'text-primary-400' : 'text-dark-400',
                          )}>{task.description}</span>
                          {agent && <span className="text-[10px] text-dark-600">{agent.name}</span>}
                        </div>
                      )
                    })}
                    {currentExecution.plan.subtasks.length > 5 && (
                      <p className="text-[11px] text-dark-500 pl-6">+{currentExecution.plan.subtasks.length - 5} more tasks</p>
                    )}
                  </div>
                )}
                {currentExecution.phase === 'completed' && currentExecution.result && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-xs text-emerald-400 font-medium mb-1">Result</p>
                    <p className="text-xs text-dark-400">{currentExecution.result}</p>
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
              {(showAllAgents ? agents : agents.slice(0, 4)).map((agent, i) => (
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
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-dark-500">{agent.confidence}%</span>
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
            {agents.length > 4 && (
              <button onClick={() => setShowAllAgents(!showAllAgents)}
                className="w-full px-4 py-2 text-[11px] text-dark-500 hover:text-dark-400 border-t border-dark-800 transition-colors">
                {showAllAgents ? 'Show less' : `Show all ${agents.length} agents`}
              </button>
            )}
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
                    <p className="text-[10px] text-dark-500">{event.detail}</p>
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
          {pendingApprovals.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-amber-500/10 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-amber-400">Pending Approvals</h2>
              </div>
              <div className="divide-y divide-amber-500/10">
                {pendingApprovals.map(apr => {
                  const exec = executions.find(e => e.id === apr.executionId)
                  return (
                    <div key={apr.id} className="p-3">
                      <p className="text-xs font-medium text-dark-200 mb-1">{apr.title}</p>
                      {exec && <p className="text-[10px] text-dark-500 mb-2">{exec.objective}</p>}
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded text-[11px] bg-dark-800 text-dark-400 hover:text-dark-300 transition-colors">Details</button>
                        <button onClick={() => useExecutionEngine.getState().rejectTask(apr.id)}
                          className="px-3 py-1 rounded text-[11px] text-red-400 hover:bg-red-500/10 transition-colors">Reject</button>
                        <button onClick={() => useExecutionEngine.getState().approveTask(apr.id)}
                          className="px-3 py-1 rounded text-[11px] bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">Approve</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
            <h2 className="text-sm font-semibold text-dark-200 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary-400" /> System Health
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-dark-500">Agent Availability</span>
                <span className="text-emerald-400 font-medium">
                  {agents.filter(a => a.status === 'running' || a.status === 'idle').length}/{agents.length} online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-500">Avg Confidence</span>
                <span className="text-dark-200 font-medium">{avgConfidence}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-500">Avg Success Rate</span>
                <span className="text-emerald-400 font-medium">{avgSuccess}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-500">Executions Today</span>
                <span className="text-dark-200 font-medium">{completedExecs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-500">Total Tasks</span>
                <span className="text-dark-200 font-medium">{totalTasks.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
            <h2 className="text-sm font-semibold text-dark-200 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" size="sm" leftIcon={<Terminal className="h-3.5 w-3.5" />} className="w-full justify-start" onClick={() => window.location.href = '/workspace'}>
                New Execution
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Bot className="h-3.5 w-3.5" />} className="w-full justify-start" onClick={() => window.location.href = '/agents'}>
                View Agents
              </Button>
              <Button variant="outline" size="sm" leftIcon={<BrainCircuit className="h-3.5 w-3.5" />} className="w-full justify-start" onClick={() => window.location.href = '/planner'}>
                Open Planner
              </Button>
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
