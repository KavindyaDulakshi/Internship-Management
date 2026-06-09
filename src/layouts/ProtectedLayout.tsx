import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, FileText, Video, Map,
  User, Settings, Bell, Search, LogOut, ChevronLeft, ChevronRight,
  Sparkles, Menu, X, Award,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const C = {
  bg: '#020617', surface: '#0F172A', surfaceHover: '#1E293B',
  border: 'rgba(255,255,255,0.08)', primary: '#4F46E5', secondary: '#06B6D4',
  textPrimary: '#ffffff', textSecondary: '#94A3B8', textMuted: '#64748B',
}

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/internships', icon: Briefcase, label: 'Internships' },
  { to: '/resume-analyzer', icon: FileText, label: 'Resume Analyzer' },
  { to: '/interview', icon: Video, label: 'Mock Interview' },
  { to: '/roadmap', icon: Map, label: 'Career Roadmap' },
  { to: '/quiz', icon: Award, label: 'Skills Quiz' },
]
const NAV_BOTTOM = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function SidebarContent({ collapsed, onClose }: { collapsed: boolean, onClose?: () => void }) {
  const { signOut } = useAuth()
  return (
    <div style={{
      width: collapsed ? 72 : 240, height: '100%',
      display: 'flex', flexDirection: 'column',
      background: C.surface, borderRight: `1px solid ${C.border}`,
      transition: 'width 0.3s ease', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Logo */}
      <Link to="/dashboard" onClick={onClose} style={{
        height: 64, display: 'flex', alignItems: 'center',
        padding: collapsed ? '0 18px' : '0 20px',
        borderBottom: `1px solid ${C.border}`,
        gap: 10, overflow: 'hidden',
        textDecoration: 'none',
        cursor: 'pointer'
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={16} color="#fff" />
        </div>
        {!collapsed && (
          <span style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary, whiteSpace: 'nowrap' }}>
            InternHub
          </span>
        )}
      </Link>

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {!collapsed && (
          <span style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px 8px', display: 'block' }}>
            Main Menu
          </span>
        )}
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '10px 18px' : '10px 12px',
                borderRadius: 12,
                background: isActive ? `${C.primary}22` : 'transparent',
                color: isActive ? C.primary : C.textSecondary,
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s',
                overflow: 'hidden', whiteSpace: 'nowrap',
                outline: isActive ? `1px solid ${C.primary}33` : 'none',
              }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = C.surfaceHover }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_BOTTOM.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '10px 18px' : '10px 12px',
                borderRadius: 12,
                background: isActive ? `${C.primary}22` : 'transparent',
                color: isActive ? C.primary : C.textSecondary,
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s', overflow: 'hidden', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = C.surfaceHover }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && label}
              </div>
            )}
          </NavLink>
        ))}
        {/* Logout */}
        <div
          onClick={signOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: collapsed ? '10px 18px' : '10px 12px',
            borderRadius: 12, color: '#EF4444', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && 'Sign Out'}
        </div>
      </div>
    </div>
  )
}

export function ProtectedLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.bg, color: C.textPrimary, position: 'relative' }}>

      {/* Desktop Sidebar */}
      <div style={{ display: 'flex', position: 'sticky', top: 0, height: '100vh', zIndex: 30 }}>
        <SidebarContent collapsed={collapsed} />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute', right: -14, top: 80,
            width: 28, height: 28, borderRadius: '50%',
            background: C.surface, border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: C.textMuted, zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = C.textPrimary)}
          onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', width: 240, height: '100%', zIndex: 1 }}>
            <button onClick={() => setMobileOpen(false)} style={{
              position: 'absolute', top: 16, right: -12, zIndex: 2,
              width: 28, height: 28, borderRadius: '50%',
              background: C.surface, border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: C.textMuted,
            }}>
              <X size={14} />
            </button>
            <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 20, height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', borderBottom: `1px solid ${C.border}`,
          background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(16px)',
          gap: 16,
        }}>
          {/* Left: mobile menu + search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setMobileOpen(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted,
              display: 'flex', padding: 4,
            }}>
              <Menu size={22} />
            </button>
            <div style={{ position: 'relative' }}>
              <Search size={15} color={C.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                placeholder="Search internships…"
                style={{
                  height: 38, width: 260, borderRadius: 10,
                  border: `1px solid ${C.border}`, background: C.surfaceHover,
                  color: C.textPrimary, fontSize: 13, paddingLeft: 36, paddingRight: 12,
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = C.primary)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </div>
          </div>

          {/* Right: bell + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{
              width: 38, height: 38, borderRadius: 10, background: 'transparent',
              border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: C.textSecondary, position: 'relative', transition: 'all 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.surfaceHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Bell size={17} />
              <span style={{
                position: 'absolute', top: 8, right: 9,
                width: 7, height: 7, borderRadius: '50%',
                background: C.secondary, border: '2px solid #020617',
              }} />
            </button>
            <div
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '6px 12px', borderRadius: 10, border: `1px solid ${C.border}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.surfaceHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff',
              }}>
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase()
                  : user?.email?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, lineHeight: 1.2 }}>
                  {user?.user_metadata?.full_name || user?.email || 'User'}
                </span>
                <span style={{ fontSize: 11, color: C.textMuted }}>
                  {user?.user_metadata?.university || 'University'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
