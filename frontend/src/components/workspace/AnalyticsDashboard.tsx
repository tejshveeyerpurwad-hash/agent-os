import { motion } from 'framer-motion'
import { Bot, CheckCircle2, Clock, TrendingUp, Zap, DollarSign, Activity } from 'lucide-react'
import { cn } from '@/utils/cn'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface AnalyticsData {
  activeAgents: number
  completedWorkflows: number
  avgExecutionTime: string
  successRate: number
  timeSaved: string
  costReduction: string
  businessImpact: string
  chartData: { name: string; executions: number; success: number }[]
}

interface AnalyticsDashboardProps {
  data: AnalyticsData | null
  isLive: boolean
}

const metricsConfig = [
  { key: 'activeAgents', label: 'Active Agents', icon: Bot, suffix: '', color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { key: 'completedWorkflows', label: 'Completed', icon: CheckCircle2, suffix: '', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'avgExecutionTime', label: 'Avg Time', icon: Clock, suffix: '', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { key: 'successRate', label: 'Success', icon: TrendingUp, suffix: '%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'timeSaved', label: 'Time Saved', icon: Zap, suffix: '', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { key: 'costReduction', label: 'Cost Saved', icon: DollarSign, suffix: '', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
]

export function AnalyticsDashboard({ data, isLive }: AnalyticsDashboardProps) {
  if (!data) return null

  return (
    <div className="rounded-2xl border border-border-light bg-surface-elevated/60 overflow-hidden">
      <div className="p-3 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary-400" />
            <h3 className="text-xs font-semibold text-dark-200">Analytics</h3>
          </div>
          {isLive && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-emerald-400">Live</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-3">
          {metricsConfig.map((metric) => {
            const val = data[metric.key as keyof AnalyticsData]
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-2 rounded-xl bg-dark-800/40 border border-border-light"
              >
                <div className="flex items-center gap-1 mb-1">
                  <div className={cn('p-0.5 rounded', metric.bg)}>
                    <metric.icon className={cn('h-2.5 w-2.5', metric.color)} />
                  </div>
                  <span className="text-[8px] text-dark-500 truncate">{metric.label}</span>
                </div>
                <div className="text-xs font-bold text-dark-100">
                  {typeof val === 'number' ? val.toLocaleString() + metric.suffix : String(val)}
                </div>
              </motion.div>
            )
          })}
        </div>

        {data.chartData.length > 0 && (
          <div className="p-2 rounded-xl bg-dark-800/30 border border-border-light">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={data.chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a23',
                    border: '1px solid #252533',
                    borderRadius: '8px',
                    fontSize: '10px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="executions" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
                <Bar dataKey="success" fill="#10b981" radius={[2, 2, 0, 0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export function generateAnalytics(executionCount: number, successCount: number): AnalyticsData {
  const rate = executionCount > 0 ? Math.round((successCount / executionCount) * 100) : 0
  return {
    activeAgents: Math.floor(Math.random() * 3 + 3),
    completedWorkflows: executionCount,
    avgExecutionTime: `${(Math.random() * 3 + 1.2).toFixed(1)}s`,
    successRate: rate || Math.floor(Math.random() * 10 + 88),
    timeSaved: `${Math.floor(Math.random() * 12 + 8)}h`,
    costReduction: `$${Math.floor(Math.random() * 5000 + 2000)}`,
    businessImpact: `${Math.floor(Math.random() * 30 + 20)}%`,
    chartData: [
      { name: 'Mon', executions: Math.floor(Math.random() * 5 + 3), success: Math.floor(Math.random() * 5 + 2) },
      { name: 'Tue', executions: Math.floor(Math.random() * 5 + 3), success: Math.floor(Math.random() * 5 + 2) },
      { name: 'Wed', executions: Math.floor(Math.random() * 5 + 3), success: Math.floor(Math.random() * 5 + 3) },
      { name: 'Thu', executions: Math.floor(Math.random() * 5 + 3), success: Math.floor(Math.random() * 5 + 3) },
      { name: 'Fri', executions: Math.floor(Math.random() * 4 + 2), success: Math.floor(Math.random() * 4 + 2) },
    ],
  }
}
