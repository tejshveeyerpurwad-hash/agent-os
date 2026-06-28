import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { Agents } from '@/pages/Agents'
import { Workflows } from '@/pages/Workflows'
import { Knowledge } from '@/pages/Knowledge'
import { Analytics } from '@/pages/Analytics'
import { Settings } from '@/pages/Settings'
import { ROUTES } from '@/utils/constants'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<Landing />} />

          <Route element={<AuthGuard />}>
            <Route element={<MainLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.AGENTS} element={<Agents />} />
              <Route path={ROUTES.WORKFLOWS} element={<Workflows />} />
              <Route path={ROUTES.KNOWLEDGE} element={<Knowledge />} />
              <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-dark-950">
              <h1 className="text-4xl font-bold text-dark-100 mb-4">404</h1>
              <p className="text-dark-400">Page not found</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
