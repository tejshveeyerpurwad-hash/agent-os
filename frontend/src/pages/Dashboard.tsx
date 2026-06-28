import { Bot, Workflow, Brain, Activity } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Chart } from '@/components/analytics/Chart'

const stats = [
  { title: 'Active Agents', value: '12', icon: <Bot className="h-6 w-6" />, trend: { value: 8, positive: true }, subtitle: 'vs last week' },
  { title: 'Workflows Running', value: '5', icon: <Workflow className="h-6 w-6" />, trend: { value: 3, positive: false }, subtitle: 'vs last week' },
  { title: 'Knowledge Items', value: '2,847', icon: <Brain className="h-6 w-6" />, trend: { value: 12, positive: true }, subtitle: 'this month' },
  { title: 'Tasks Completed', value: '1,423', icon: <Activity className="h-6 w-6" />, trend: { value: 24, positive: true }, subtitle: 'today' },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-xl font-bold text-dark-100">Dashboard</h1>
        <p className="text-dark-400 mt-1">Overview of your AI operations and system health.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chart title="Agent Performance" height={320} />
        </div>
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <Chart title="Workflow Activity" height={320} />
      </div>
    </div>
  )
}
