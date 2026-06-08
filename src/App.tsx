import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PublicLayout } from './layouts/PublicLayout'
import { ProtectedLayout } from './layouts/ProtectedLayout'
import { AuthLayout } from './layouts/AuthLayout'

import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Internships from './pages/Internships'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import MockInterview from './pages/MockInterview'
import CareerRoadmap from './pages/CareerRoadmap'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

// Guard: redirect to /signin if not authenticated
function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#020617',
        color: '#94A3B8', fontSize: 14, gap: 12
      }}>
        <div style={{
          width: 20, height: 20, border: '2px solid #4F46E5',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }} />
        Loading…
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }
  return user ? children : <Navigate to="/signin" replace />
}

// Guard: redirect to /dashboard if already authenticated
function RedirectIfAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Auth pages — redirect to dashboard if already logged in */}
      <Route element={<AuthLayout />}>
        <Route
          path="/signin"
          element={<RedirectIfAuth><SignIn /></RedirectIfAuth>}
        />
        <Route
          path="/signup"
          element={<RedirectIfAuth><SignUp /></RedirectIfAuth>}
        />
      </Route>

      {/* Protected Dashboard pages */}
      <Route element={<RequireAuth><ProtectedLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/interview" element={<MockInterview />} />
        <Route path="/roadmap" element={<CareerRoadmap />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
