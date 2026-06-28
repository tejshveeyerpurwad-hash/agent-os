import { cn } from '@/utils/cn'
import type { WorkflowStatus as WorkflowStatusType } from '@/types/workflow'

interface WorkflowStatusProps {
  status: WorkflowStatusType
  className?: string
}

const statusColors: Record<WorkflowStatusType, string> = {
  draft: 'bg-dark-500',
  active: 'bg-primary-500',
  paused: 'bg-amber-500',
  completed: 'bg-emerald-500',
  failed: 'bg-red-500',
}

export function WorkflowStatus({ status, className }: WorkflowStatusProps) {
  return (
    <span className={cn('h-2.5 w-2.5 rounded-full inline-block', statusColors[status], className)} />
  )
}
