import { cn } from '@/utils/cn'
import type { AgentStatus as AgentStatusType } from '@/types/agent'

interface AgentStatusProps {
  status: AgentStatusType
  className?: string
}

const statusColors: Record<AgentStatusType, string> = {
  idle: 'bg-dark-500',
  running: 'bg-primary-500 animate-pulse-soft',
  paused: 'bg-amber-500',
  error: 'bg-red-500',
  completed: 'bg-emerald-500',
}

export function AgentStatus({ status, className }: AgentStatusProps) {
  return (
    <span className={cn('relative flex h-2.5 w-2.5', className)}>
      <span className={cn(
        'absolute inline-flex h-full w-full rounded-full opacity-75',
        status === 'running' && 'animate-ping bg-primary-400',
      )} />
      <span className={cn(
        'relative inline-flex rounded-full h-2.5 w-2.5',
        statusColors[status],
      )} />
    </span>
  )
}
