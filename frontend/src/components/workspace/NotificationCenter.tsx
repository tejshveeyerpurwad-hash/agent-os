import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, CheckCircle2, AlertCircle, AlertTriangle, Info,
  X, RotateCcw,
} from 'lucide-react'
import { cn } from '@/utils/cn'

export interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionable?: boolean
  actionLabel?: string
  onAction?: () => void
}

const notificationIcons: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const notificationColors: Record<string, string> = {
  success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  error: 'text-red-400 bg-red-500/10 border-red-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  info: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
}

const notificationBg: Record<string, string> = {
  success: 'hover:bg-emerald-500/[0.02]',
  error: 'hover:bg-red-500/[0.02]',
  warning: 'hover:bg-amber-500/[0.02]',
  info: 'hover:bg-primary-500/[0.02]',
}

interface NotificationCenterProps {
  notifications: NotificationItem[]
  onDismiss: (id: string) => void
  onMarkAllRead: () => void
  isLive: boolean
}

export function NotificationCenter({ notifications, onDismiss, onMarkAllRead, isLive }: NotificationCenterProps) {
  const [showAll, setShowAll] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-light">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary-400" />
          <span className="text-xs font-semibold text-dark-200">Notifications</span>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-1.5 py-0.5 rounded-full bg-primary-500/20 text-[9px] font-medium text-primary-400"
            >
              {unreadCount}
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="p-1 rounded-lg text-[9px] text-dark-500 hover:text-dark-300 hover:bg-dark-800/50 transition-all"
              title="Mark all as read"
            >
              <CheckCircle2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-6 w-6 text-dark-600 mb-2" />
            <p className="text-[10px] text-dark-500">No notifications</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            <AnimatePresence initial={false}>
              {displayNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Info

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: 20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className={cn(
                      'relative p-2.5 rounded-xl border transition-all group',
                      notificationColors[notification.type],
                      notificationBg[notification.type],
                      !notification.read && 'ring-1 ring-primary-500/10',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium leading-tight">{notification.title}</p>
                        <p className="text-[9px] opacity-70 mt-0.5 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] opacity-50">
                            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {notification.actionable && notification.actionLabel && (
                            <button
                              onClick={notification.onAction}
                              className="flex items-center gap-1 text-[8px] font-medium opacity-80 hover:opacity-100 transition-opacity"
                            >
                              <RotateCcw className="h-2.5 w-2.5" />
                              {notification.actionLabel}
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onDismiss(notification.id)}
                        className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {notifications.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-2 text-[9px] text-dark-500 hover:text-dark-400 transition-colors text-center"
              >
                {showAll ? 'Show less' : `View all ${notifications.length} notifications`}
              </button>
            )}
          </div>
        )}
      </div>

      {isLive && (
        <div className="p-2 border-t border-border-light">
          <div className="flex items-center gap-1.5 text-[8px] text-dark-600">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
            Connected — receiving live updates
          </div>
        </div>
      )}
    </div>
  )
}
