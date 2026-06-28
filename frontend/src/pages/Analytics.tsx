import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Clock, CheckCircle2, Activity, Zap, DollarSign, ArrowUp, ArrowDown, Bot, Brain, Target, Layers } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { kpis, agents } from '@/store/mockData'

const timeRanges = ['7D', '30D', '90D', '1Y'] as const

const agentPerformance = agents.map(a => ({
  name: a.name,
  role: a.role,
  tasks: a.taskCount,
  successRate: a.successRate,
  confidence: a.confidence,
  status: a.status,
}))

const monthlyData = [
  { month: 'Jan', tasks: 4200, success: 94, cost: 12.4 },
  { month: 'Feb', tasks: 4800, success: 95, cost: 13.1 },
  { month: 'Mar', tasks: 5600, success: 93, cost: 14.8 },
  { month: 'Apr', tasks: 6100, success: 96, cost: 15.2 },
  { month: 'May', tasks: 7200, success: 95, cost: 16.5 },
  { month: 'Jun', tasks: 8400, success: 97, cost: 17.1 },
]

export function Analytics() {
  const [range, setRange] = useState<typeof timeRanges[number]>('30D')

  const avgTasks = Math.round(monthlyData.reduce((s, m) => s + m.tasks, 0) / monthlyData.length)
  const avgSuccess = Math.round(monthlyData.reduce((s, m) => s + m.success, 0) / monthlyData.length)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Analytics</h1>
          <p className="text-sm text-dark-400 mt-0.5">Deep insights into agent performance and business metrics</p>
        </div>
        <div className="flex gap-1 bg-dark-800/50 rounded-lg p-1">
          {timeRanges.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                range === r ? 'bg-dark-800 text-dark-100' : 'text-dark-500 hover:text-dark-300'
              )}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-dark-800 bg-dark-900/50 p-4"
          >
            <p className="text-xs text-dark-500 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-dark-100 tracking-tight">
              {kpi.value}{kpi.unit}
            </p>
            <div className={cn('flex items-center gap-1 mt-1 text-xs', kpi.positive ? 'text-emerald-400' : 'text-red-400')}>
              {kpi.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span>{kpi.change}%</span>
              <span className="text-dark-600 ml-0.5">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardTitle>Agent Performance</CardTitle>
            <CardContent>
              <div className="space-y-3 mt-3">
                {agentPerformance.map((agent, i) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-dark-800/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-dark-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-dark-200">{agent.name}</p>
                        <span className="text-[10px] text-dark-500">{agent.role}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-dark-500">Success rate</span>
                            <span className={cn('font-medium', agent.successRate >= 95 ? 'text-emerald-400' : agent.successRate >= 85 ? 'text-amber-400' : 'text-red-400')}>{agent.successRate}%</span>
                          </div>
                          <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                            <div className={cn('h-full rounded-full transition-all duration-500', agent.successRate >= 95 ? 'bg-emerald-400' : agent.successRate >= 85 ? 'bg-amber-400' : 'bg-red-400')} style={{ width: `${agent.successRate}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-dark-200">{agent.tasks.toLocaleString()}</p>
                      <p className="text-[10px] text-dark-500">tasks</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-dark-200">{agent.confidence}%</p>
                      <p className="text-[10px] text-dark-500">confidence</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Monthly Task Volume</CardTitle>
            <CardContent>
              <div className="mt-3">
                <div className="flex items-end gap-2 h-40">
                  {monthlyData.map((m, i) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-dark-500">{m.tasks > 6000 ? `${(m.tasks / 1000).toFixed(1)}k` : m.tasks}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(m.tasks / 9000) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="w-full rounded-t-md bg-gradient-to-t from-primary-500/30 to-primary-500/10 hover:from-primary-500/50 transition-all cursor-pointer relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-800 px-2 py-1 rounded text-[10px] text-dark-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {m.tasks.toLocaleString()} tasks
                        </div>
                      </motion.div>
                      <span className="text-[10px] text-dark-600">{m.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-800 text-xs text-dark-500">
                  <span>Average: {avgTasks.toLocaleString()} tasks/month</span>
                  <span className="text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5 inline mr-1" />
                    {Math.round((monthlyData[monthlyData.length - 1].tasks / monthlyData[0].tasks - 1) * 100)}% growth
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardTitle>Success Rate</CardTitle>
            <CardContent>
              <div className="mt-3 text-center">
                <p className="text-4xl font-bold text-emerald-400">{avgSuccess}%</p>
                <p className="text-xs text-dark-500 mt-1">Average across all agents</p>
                <div className="mt-4 h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-400" style={{ width: `${avgSuccess}%` }} />
                </div>
                <div className="mt-4 space-y-2">
                  {agentPerformance.sort((a, b) => b.successRate - a.successRate).slice(0, 4).map(a => (
                    <div key={a.name} className="flex items-center justify-between text-xs">
                      <span className="text-dark-400">{a.name}</span>
                      <span className={cn('font-medium', a.successRate >= 95 ? 'text-emerald-400' : 'text-dark-300')}>{a.successRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Quick Stats</CardTitle>
            <CardContent>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-dark-800/30">
                  <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-500">Total Tasks</p>
                    <p className="text-sm font-semibold text-dark-200">{(agentPerformance.reduce((s, a) => s + a.tasks, 0)).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-dark-800/30">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-500">Avg Success Rate</p>
                    <p className="text-sm font-semibold text-dark-200">{avgSuccess}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-dark-800/30">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-500">Active Agents</p>
                    <p className="text-sm font-semibold text-dark-200">{agentPerformance.filter(a => a.status === 'running').length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-dark-800/30">
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-500">Cost Efficiency</p>
                    <p className="text-sm font-semibold text-dark-200">94%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
