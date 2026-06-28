import { Play, Bot, FileText, Database } from 'lucide-react'
import { Card, CardTitle, CardContent } from '@/components/ui/Card'

const actions = [
  { label: 'Run Workflow', icon: Play, color: 'text-primary-400 bg-primary-500/10' },
  { label: 'Create Agent', icon: Bot, color: 'text-accent-400 bg-accent-500/10' },
  { label: 'New Report', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10' },
  { label: 'Manage Data', icon: Database, color: 'text-amber-400 bg-amber-500/10' },
]

export function QuickActions() {
  return (
    <Card>
      <CardTitle>Quick Actions</CardTitle>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-dark-700 bg-dark-800/50 hover:bg-dark-800 hover:border-dark-600 transition-all duration-200 group"
            >
              <div className={`p-2.5 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-dark-300">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
