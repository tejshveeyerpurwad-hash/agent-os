import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: number; positive: boolean }
  subtitle?: string
  className?: string
  index?: number
}

export function StatCard({ title, value, icon, trend, subtitle, className, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn('relative overflow-hidden group', className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-dark-400">{title}</p>
            <p className="text-2xl font-bold text-dark-100">{value}</p>
            {(trend || subtitle) && (
              <div className="flex items-center gap-2">
                {trend && (
                  <span className={cn('text-xs font-medium', trend.positive ? 'text-emerald-400' : 'text-red-400')}>
                    {trend.positive ? '+' : ''}{trend.value}%
                  </span>
                )}
                {subtitle && <span className="text-xs text-dark-500">{subtitle}</span>}
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors">
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
