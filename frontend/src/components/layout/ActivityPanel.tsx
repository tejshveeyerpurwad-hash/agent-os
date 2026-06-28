import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Bell, CheckCircle, AlertCircle, Info, AlertTriangle,
  Bot, TrendingUp, Users, Globe, Zap, Layers, Shield,
  ChevronDown, ChevronUp,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { activities, notifications, type BusinessActivity, type Notification } from '@/store/mockData'
import { cn } from '@/utils/cn'

const typeIcons: Record<string, typeof CheckCircle> = {
  success: CheckCircle, error: AlertCircle, info: Info, warning: AlertTriangle,
}
const typeColors: Record<string, string> = {
  success: 'text-emerald-400 bg-emerald-500/10',
  error: 'text-red-400 bg-red-500/10',
  info: 'text-primary-400 bg-primary-500/10',
  warning: 'text-amber-400 bg-amber-500/10',
}

const agentIcons: Record<string, typeof Bot> = {
  HR: Users, Finance: TrendingUp, Marketing: Globe, Sales: Zap,
  Operations: Layers, Legal: Shield, Support: Bot, CEO: Bot,
}

export function ActivityPanel() {
  const { rightPanelOpen, setRightPanelOpen, isMobile } = useAppStore()
  const [activeTab, setActiveTab] = useState<'activity' | 'notifications'>('activity')
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => n.unread).length)

  if (isMobile && rightPanelOpen) {
    return (
      <div className="fixed inset-0 z-30 bg-dark-950/90 backdrop-blur-sm" onClick={() => setRightPanelOpen(false)}>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-dark-950 border-l border-dark-800 p-4" onClick={e => e.stopPropagation()}>
          <PanelContent activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} setUnreadCount={setUnreadCount} onClose={() => setRightPanelOpen(false)} />
        </div>
      </div>
    )
  }

  if (!rightPanelOpen) return null

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="hidden lg:flex flex-col border-l border-dark-800 bg-dark-950 shrink-0 overflow-hidden"
      style={{ width: 320 }}
    >
      <PanelContent activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} setUnreadCount={setUnreadCount} onClose={() => setRightPanelOpen(false)} />
    </motion.aside>
  )
}

function PanelContent({ activeTab, setActiveTab, unreadCount, setUnreadCount, onClose }: {
  activeTab: 'activity' | 'notifications'; setActiveTab: (t: 'activity' | 'notifications') => void
  unreadCount: number; setUnreadCount: (n: number) => void; onClose: () => void
}) {
  const [showAll, setShowAll] = useState(false)
  const displayActivities = showAll ? activities : activities.slice(0, 5)

  function handleMarkRead(id: string) {
    setUnreadCount(Math.max(0, unreadCount - 1))
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 h-14 border-b border-dark-800 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab('activity')}
            className={cn('text-xs font-medium transition-colors', activeTab === 'activity' ? 'text-dark-100' : 'text-dark-500 hover:text-dark-300')}>
            Activity
          </button>
          <button onClick={() => setActiveTab('notifications')}
            className={cn('text-xs font-medium transition-colors relative', activeTab === 'notifications' ? 'text-dark-100' : 'text-dark-500 hover:text-dark-300')}>
            Alerts
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-3 w-4 h-4 rounded-full bg-primary-500 text-[10px] font-semibold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <button onClick={onClose} className="p-1 rounded text-dark-500 hover:text-dark-300 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'activity' ? (
          <div className="p-3 space-y-1">
            {displayActivities.map((act) => (
              <ActivityItem key={act.id} activity={act} />
            ))}
            {activities.length > 5 && (
              <button onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-1 py-2 text-xs text-dark-500 hover:text-dark-300 transition-colors">
                {showAll ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showAll ? 'Show less' : `Show all ${activities.length} activities`}
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-dark-800 shrink-0">
        <div className="flex items-center gap-2 text-xs text-dark-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>All agents connected</span>
          <span className="ml-auto">{activities.length} events today</span>
        </div>
      </div>
    </>
  )
}

function ActivityItem({ activity }: { activity: BusinessActivity }) {
  const TypeIcon = typeIcons[activity.type] || Info
  const AgentIcon = agentIcons[activity.agentRole as keyof typeof agentIcons] || Bot

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-dark-800/50 transition-colors group"
    >
      <div className={cn('p-1.5 rounded-lg shrink-0', typeColors[activity.type] || 'bg-dark-800 text-dark-500')}>
        <AgentIcon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-dark-200 leading-relaxed">
          <span className="font-medium text-dark-100">{activity.agentName}</span>
          {' '}{activity.action}
        </p>
        <p className="text-[11px] text-dark-500 mt-0.5">{activity.detail}</p>
        <p className="text-[10px] text-dark-600 mt-0.5">{activity.timestamp}</p>
      </div>
    </motion.div>
  )
}

function NotificationItem({ notification, onMarkRead }: { notification: Notification; onMarkRead: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start gap-3 p-2.5 rounded-lg transition-colors group',
        notification.unread ? 'bg-primary-500/5' : 'hover:bg-dark-800/50',
      )}
      onClick={() => notification.unread && onMarkRead(notification.id)}
    >
      <div className={cn(
        'p-1.5 rounded-lg shrink-0',
        notification.unread ? 'bg-primary-500/10 text-primary-400' : 'bg-dark-800 text-dark-500',
      )}>
        <Bell className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs leading-relaxed', notification.unread ? 'text-dark-100 font-medium' : 'text-dark-400')}>
          {notification.message}
        </p>
        <p className="text-[10px] text-dark-600 mt-0.5">{notification.timeAgo}</p>
      </div>
    </motion.div>
  )
}
