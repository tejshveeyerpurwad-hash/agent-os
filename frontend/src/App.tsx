import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { ROUTES } from '@/utils/constants'

const Landing = lazy(() => import('@/pages/Landing'))
const Home = lazy(() => import('@/pages/Home'))
const Workspace = lazy(() => import('@/pages/Workspace'))
const Planner = lazy(() => import('@/pages/Planner'))
const Agents = lazy(() => import('@/pages/Agents'))
const Workflows = lazy(() => import('@/pages/Workflows'))
const Knowledge = lazy(() => import('@/pages/Knowledge'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Activity = lazy(() => import('@/pages/Activity'))
const Integration = lazy(() => import('@/pages/Integration'))
const Conversations = lazy(() => import('@/pages/Conversations'))
const Calendar = lazy(() => import('@/pages/Calendar'))
const Team = lazy(() => import('@/pages/Team'))
const Settings = lazy(() => import('@/pages/Settings'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-400 rounded-full animate-spin" />
        <p className="text-xs text-dark-500">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
          <Route element={<AuthGuard />}>
            <Route element={<MainLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
              <Route path={ROUTES.WORKSPACE} element={<Suspense fallback={<PageLoader />}><Workspace /></Suspense>} />
              <Route path={ROUTES.PLANNER} element={<Suspense fallback={<PageLoader />}><Planner /></Suspense>} />
              <Route path={ROUTES.AGENTS} element={<Suspense fallback={<PageLoader />}><Agents /></Suspense>} />
              <Route path={ROUTES.WORKFLOWS} element={<Suspense fallback={<PageLoader />}><Workflows /></Suspense>} />
              <Route path={ROUTES.KNOWLEDGE} element={<Suspense fallback={<PageLoader />}><Knowledge /></Suspense>} />
              <Route path={ROUTES.ANALYTICS} element={<Suspense fallback={<PageLoader />}><Analytics /></Suspense>} />
              <Route path={ROUTES.ACTIVITY} element={<Suspense fallback={<PageLoader />}><Activity /></Suspense>} />
              <Route path={ROUTES.INTEGRATION} element={<Suspense fallback={<PageLoader />}><Integration /></Suspense>} />
              <Route path={ROUTES.CONVERSATIONS} element={<Suspense fallback={<PageLoader />}><Conversations /></Suspense>} />
              <Route path={ROUTES.CALENDAR} element={<Suspense fallback={<PageLoader />}><Calendar /></Suspense>} />
              <Route path={ROUTES.TEAM} element={<Suspense fallback={<PageLoader />}><Team /></Suspense>} />
              <Route path={ROUTES.SETTINGS} element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
            </Route>
          </Route>
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-dark-950 p-8">
              <h1 className="text-4xl font-bold text-dark-100 mb-3">404</h1>
              <p className="text-dark-400 text-sm">This page doesn't exist.</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
