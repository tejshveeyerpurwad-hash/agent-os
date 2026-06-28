import { motion } from 'framer-motion'
import { Workflow, Play, MoreHorizontal } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Workflow as WorkflowType, WorkflowStatus } from '@/types/workflow'

const statusConfig: Record<WorkflowStatus, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  draft: { label: 'Draft', variant: 'default' },
  active: { label: 'Active', variant: 'primary' },
  paused: { label: 'Paused', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  failed: { label: 'Failed', variant: 'danger' },
}

interface WorkflowCardProps {
  workflow: WorkflowType
  index?: number
}

export function WorkflowCard({ workflow, index = 0 }: WorkflowCardProps) {
  const status = statusConfig[workflow.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover className="group">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent-500/10 text-accent-400">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm">{workflow.name}</CardTitle>
              <p className="text-xs text-dark-500 mt-0.5">{workflow.steps.length} steps</p>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-dark-400 line-clamp-2 mb-4">{workflow.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-dark-500">
              <span>{workflow.runCount} runs</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm">
                <Play className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
