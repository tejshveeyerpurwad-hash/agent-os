import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils/cn'

export function MainLayout() {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-200',
          sidebarOpen ? 'ml-60' : 'ml-16',
        )}
      >
        <TopNav />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
