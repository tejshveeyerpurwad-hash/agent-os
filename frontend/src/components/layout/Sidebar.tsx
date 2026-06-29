import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Bot, Workflow, Brain, BarChart3, MessageSquare,
  Calendar, Users, Settings, ChevronLeft, ChevronRight, Hexagon,
  Terminal, BrainCircuit, Activity as ActivityIcon, Box,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { NAV_ITEMS } from '@/utils/constants'
import { useAppStore } from '@/store/appStore'

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard, Bot, Workflow, Brain, BarChart3,
  MessageSquare, Calendar, Users, Settings,
  Terminal, BrainCircuit, Activity: ActivityIcon, Box,
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, isMobile } = useAppStore()
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 64 }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-dark-950 border-r border-dark-800 z-40 flex flex-col',
        isMobile && !sidebarOpen && 'hidden',
      )}
    >
      <div className={cn(
        'flex items-center h-14 px-3 border-b border-dark-800 shrink-0',
        sidebarOpen ? 'justify-between' : 'justify-center',
      )}>
        <NavLink to="/" className="flex items-center gap-2.5">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
            <Hexagon className="h-7 w-7 text-primary-400" />
          </motion.div>
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-base font-bold text-dark-100 tracking-tight"
              >
                AgentOS
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
        {sidebarOpen && (
          <button onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800',
                !sidebarOpen && 'justify-center px-2',
              )}
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
        <div className="p-2 border-t border-dark-800 shrink-0">
          <button onClick={toggleSidebar}
            className="w-full p-2 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors">
            <ChevronRight className="h-4 w-4 mx-auto" />
          </button>
        </div>
      )}
    </motion.aside>
  )
}
