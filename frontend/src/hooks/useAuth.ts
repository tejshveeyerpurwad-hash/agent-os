import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    if (!store.isAuthenticated && store.isLoading) {
      store.checkAuth()
    }
  }, [store])

  return store
}
