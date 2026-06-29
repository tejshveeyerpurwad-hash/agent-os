import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Sun, Moon, Menu, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useActivityStore } from '@/store/activityStore'
import { cn } from '@/utils/cn'

export function TopNav() {
  const { toggleSidebar, setCommandOpen } = useAppStore()
  const { theme, toggleTheme } = useThemeStore()
  const { user } = useAuthStore()
  const events = useActivityStore(s => s.events)
  const unreadCount = useActivityStore(s => s.unreadCount)
  const markAllRead = useActivityStore(s => s.markAllRead)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [notifOpen])

  const severityIcon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }
  const severityColor = {
    success: 'text-emerald-400 bg-emerald-500/10',
    error: 'text-red-400 bg-red-500/10',
    info: 'text-primary-400 bg-primary-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
  }

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 border-b border-dark-800 bg-dark-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors lg:hidden focus-ring"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onFocus={() => setCommandOpen(true)}
              className="w-48 lg:w-64 pl-9 pr-4 py-1.5 sm:py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
            />
          </div>
          <button
            onClick={() => setCommandOpen(true)}
            className="sm:hidden p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors focus-ring"
            aria-label="Open command palette"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2" ref={notifRef}>
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors focus-ring relative"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary-500 text-[9px] font-semibold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-dark-700 bg-dark-900 shadow-elevation-4 overflow-hidden z-50"
                  role="dialog"
                  aria-label="Notifications"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800">
                    <h3 className="text-xs font-semibold text-dark-200">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] text-primary-400 hover:text-primary-300 transition-colors focus-ring">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {events.length === 0 ? (
                      <p className="text-xs text-dark-500 text-center py-8">No notifications yet</p>
                    ) : (
                      events.slice(0, 10).map(event => {
                        const SeverityIcon = severityIcon[event.severity] || Info
                        const colorClass = severityColor[event.severity] || 'bg-dark-800 text-dark-500'
                        return (
                          <div key={event.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-dark-800/30 transition-colors">
                            <div className={cn('p-1 rounded-lg shrink-0', colorClass)}>
                              <SeverityIcon className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-dark-200 truncate">{event.action}</p>
                              <p className="text-[10px] text-dark-500 truncate mt-0.5">{event.detail}</p>
                              <p className="text-[9px] text-dark-600 mt-0.5">{timeAgo(event.timestamp)}</p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors focus-ring"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-3 pl-1 sm:pl-3 border-l border-dark-800">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-dark-200">{user?.name || 'User'}</p>
              <p className="text-xs text-dark-500">{user?.role || 'Loading...'}</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-semibold shrink-0"
              aria-label={`User avatar: ${user?.name || 'User'}`}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  return `${d}d ago`
}
