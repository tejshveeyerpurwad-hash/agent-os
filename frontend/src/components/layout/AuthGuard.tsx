import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { PageSkeleton } from '@/components/ui/Skeleton'

export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <PageSkeleton />
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
