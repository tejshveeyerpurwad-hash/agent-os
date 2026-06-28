import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { Landing } from '@/pages/Landing'
import { Home } from '@/pages/Home'
import { Workspace } from '@/pages/Workspace'
import { Planner } from '@/pages/Planner'
import { Agents } from '@/pages/Agents'
import { Workflows } from '@/pages/Workflows'
import { Knowledge } from '@/pages/Knowledge'
import { Analytics } from '@/pages/Analytics'
import { Activity } from '@/pages/Activity'
import { Conversations } from '@/pages/Conversations'
import { Calendar } from '@/pages/Calendar'
import { Team } from '@/pages/Team'
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
              <Route path={ROUTES.DASHBOARD} element={<Home />} />
              <Route path={ROUTES.WORKSPACE} element={<Workspace />} />
              <Route path={ROUTES.PLANNER} element={<Planner />} />
              <Route path={ROUTES.AGENTS} element={<Agents />} />
              <Route path={ROUTES.WORKFLOWS} element={<Workflows />} />
              <Route path={ROUTES.KNOWLEDGE} element={<Knowledge />} />
              <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
              <Route path={ROUTES.ACTIVITY} element={<Activity />} />
              <Route path={ROUTES.CONVERSATIONS} element={<Conversations />} />
              <Route path={ROUTES.CALENDAR} element={<Calendar />} />
              <Route path={ROUTES.TEAM} element={<Team />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
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
