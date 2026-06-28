import { motion } from 'framer-motion'
import { Bot, Play, Pause, MoreHorizontal } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import type { Agent, AgentStatus } from '@/types/agent'

const statusConfig: Record<AgentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' | 'primary' }> = {
  idle: { label: 'Idle', variant: 'default' },
  running: { label: 'Running', variant: 'primary' },
  paused: { label: 'Paused', variant: 'warning' },
  error: { label: 'Error', variant: 'danger' },
  completed: { label: 'Completed', variant: 'success' },
}

interface AgentCardProps {
  agent: Agent
  index?: number
}

export function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const status = statusConfig[agent.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover className="group">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2.5 rounded-lg',
              agent.status === 'running' ? 'bg-primary-500/10 text-primary-400' :
              agent.status === 'error' ? 'bg-red-500/10 text-red-400' :
              'bg-dark-800 text-dark-400',
            )}>
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm">{agent.name}</CardTitle>
              <p className="text-xs text-dark-500 mt-0.5">{agent.model}</p>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-dark-400 line-clamp-2 mb-4">{agent.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-dark-500">
              <span>{agent.taskCount} tasks</span>
              <span>{agent.successRate}% success</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm">
                {agent.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
