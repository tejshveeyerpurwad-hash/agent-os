import { create } from 'zustand'
import type { User, LoginCredentials } from '@/types/user'
import { authService } from '@/services/auth'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('agentos_token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null })
    try {
      const { user, token } = await authService.login(credentials)
      localStorage.setItem('agentos_token', token)
      set({ user, token, isAuthenticated: true, isLoading: false })
    } catch {
      set({ error: 'Invalid credentials', isLoading: false })
      throw new Error('Login failed')
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('agentos_token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('agentos_token')
    if (!token) {
      set({ isAuthenticated: false, isLoading: false })
      return
    }
    try {
      const user = await authService.getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('agentos_token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },

  setUser: (user: User | null) => set({ user }),
}))
