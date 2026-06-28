import { type ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
}

export function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-accent-500/10 text-accent-400">
          {icon}
        </div>
        <span className="text-sm text-dark-400">{title}</span>
      </div>
      <p className="text-2xl font-bold text-dark-100">{value}</p>
      {description && (
        <p className="text-xs text-dark-500 mt-1">{description}</p>
      )}
    </Card>
  )
}
