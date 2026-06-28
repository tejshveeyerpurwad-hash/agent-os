import { Bell, Search, Sun, Moon, Menu } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'

export function TopNav() {
  const { toggleSidebar } = useAppStore()
  const { theme, toggleTheme } = useThemeStore()
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-dark-800 bg-dark-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-9 pr-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-500" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3 ml-3 pl-3 border-l border-dark-800">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-dark-200">{user?.name || 'User'}</p>
              <p className="text-xs text-dark-500">{user?.role || 'Loading...'}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
