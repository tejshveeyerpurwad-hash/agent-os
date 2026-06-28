import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { CommandBar } from './CommandBar'
import { ActivityPanel } from './ActivityPanel'
import { useAppStore } from '@/store/appStore'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

export function MainLayout() {
  const { sidebarOpen, rightPanelOpen, setIsMobile } = useAppStore()
  const isMobileView = useMediaQuery('(max-width: 1024px)')
  const location = useLocation()

  useEffect(() => {
    setIsMobile(isMobileView)
    if (isMobileView) {
      useAppStore.getState().setSidebarOpen(false)
      useAppStore.getState().setRightPanelOpen(false)
    } else {
      useAppStore.getState().setSidebarOpen(true)
      useAppStore.getState().setRightPanelOpen(true)
    }
  }, [isMobileView, setIsMobile])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      <div className={cn(
        'flex flex-col flex-1 min-w-0 transition-all duration-200',
        sidebarOpen ? 'ml-60' : 'ml-16',
      )}>
        <CommandBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ActivityPanel />
    </div>
  )
}
