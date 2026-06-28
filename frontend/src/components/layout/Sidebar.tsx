import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Bot,
  Workflow,
  Brain,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hexagon,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { SIDEBAR_ITEMS } from '@/utils/constants'
import { useAppStore } from '@/store/appStore'

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard,
  Bot,
  Workflow,
  Brain,
  BarChart3,
  Settings,
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 64 }}
      className="fixed left-0 top-0 h-screen bg-dark-950 border-r border-dark-800 z-40 flex flex-col"
    >
      <div className={cn('flex items-center h-16 px-4 border-b border-dark-800', sidebarOpen ? 'justify-between' : 'justify-center')}>
        <AnimatePresence mode="wait">
          {sidebarOpen ? (
            <motion.div
              key="logo-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Hexagon className="h-8 w-8 text-primary-500" />
              <span className="text-lg font-bold text-dark-100">AgentOS</span>
            </motion.div>
          ) : (
            <motion.div
              key="logo-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hexagon className="h-8 w-8 text-primary-500" />
            </motion.div>
          )}
        </AnimatePresence>
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800',
                  !sidebarOpen && 'justify-center px-2',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </nav>

      {!sidebarOpen && (
        <div className="p-2 border-t border-dark-800">
          <button
            onClick={toggleSidebar}
            className="w-full p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
          >
            <ChevronRight className="h-4 w-4 mx-auto" />
          </button>
        </div>
      )}
    </motion.aside>
  )
}
