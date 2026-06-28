import { Clock, Bot, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

const activities = [
  { id: '1', type: 'agent', message: 'DataAnalysis agent completed extraction', time: '2 min ago', status: 'success' },
  { id: '2', type: 'workflow', message: 'CustomerOnboarding workflow failed at step 3', time: '15 min ago', status: 'error' },
  { id: '3', type: 'agent', message: 'ContentGen agent started new task', time: '1 hour ago', status: 'running' },
  { id: '4', type: 'agent', message: 'SentimentAnalysis agent processed 1.2k records', time: '2 hours ago', status: 'success' },
  { id: '5', type: 'workflow', message: 'MonthlyReport workflow completed successfully', time: '3 hours ago', status: 'success' },
]

const statusIcons = {
  success: CheckCircle,
  error: AlertCircle,
  running: Clock,
}

const statusColors = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  running: 'text-primary-400',
}

export function ActivityFeed() {
  return (
    <Card>
      <CardTitle>Recent Activity</CardTitle>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity) => {
            const StatusIcon = statusIcons[activity.status as keyof typeof statusIcons]
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-800/50 transition-colors"
              >
                <div className={cn('p-1.5 rounded-lg bg-dark-800', statusColors[activity.status as keyof typeof statusColors])}>
                  {activity.type === 'agent' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <StatusIcon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-200 truncate">{activity.message}</p>
                  <p className="text-xs text-dark-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
