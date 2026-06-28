import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padded?: boolean
  onClick?: () => void
}

export function Card({ className, children, hover = false, padded = true, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        'rounded-xl border border-dark-700 bg-dark-900 shadow-elevation-1',
        hover && 'transition-all duration-200 hover:border-dark-600 hover:shadow-elevation-2',
        padded && 'p-5',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <h3 className={cn('text-lg font-semibold text-dark-100', className)}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}
