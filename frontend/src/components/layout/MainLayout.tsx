import { useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { CommandBar } from './CommandBar'
import { ActivityPanel } from './ActivityPanel'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils/cn'

export function MainLayout() {
  const { sidebarOpen, isMobile, setSidebarOpen, setIsMobile } = useAppStore()
  const location = useLocation()

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024
    setIsMobile(mobile)
    if (mobile) {
      setSidebarOpen(false)
    }
  }, [setIsMobile, setSidebarOpen])

  useEffect(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [checkMobile])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile, setSidebarOpen])

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        aria-label="Skip to main content">
        Skip to main content
      </a>
      <Sidebar />
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-dark-950/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 transition-all duration-200',
          !isMobile && (sidebarOpen ? 'ml-60' : 'ml-16'),
        )}
      >
        <CommandBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden" id="main-content" role="main" aria-label="Main content">
          <Outlet />
        </main>
      </div>
      <ActivityPanel />
    </div>
  )
}
