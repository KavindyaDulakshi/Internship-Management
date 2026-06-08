import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
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

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Protected Dashboard */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/roadmap" element={<CareerRoadmap />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
