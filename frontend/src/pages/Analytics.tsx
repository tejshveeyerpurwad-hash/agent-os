import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'
import { MetricCard } from '@/components/analytics/MetricCard'
import { Chart } from '@/components/analytics/Chart'

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-xl font-bold text-dark-100">Analytics</h1>
        <p className="text-dark-400 mt-1">Deep insights into agent performance and business metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Tasks" value="24,847" icon={<BarChart3 className="h-5 w-5" />} description="+18% from last month" />
        <MetricCard title="Success Rate" value="94.2%" icon={<TrendingUp className="h-5 w-5" />} description="Across all agents" />
        <MetricCard title="Active Users" value="47" icon={<Users className="h-5 w-5" />} description="Currently using platform" />
        <MetricCard title="Avg Response" value="1.2s" icon={<Clock className="h-5 w-5" />} description="Agent response time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Task Completion Over Time" height={350} />
        <Chart title="Agent Performance Comparison" height={350} />
        <Chart title="Workflow Success Rate" height={350} />
        <Chart title="Usage by Agent Type" height={350} />
      </div>
    </div>
  )
}
