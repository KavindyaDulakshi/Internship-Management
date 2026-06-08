import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Video,
  Map,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { Logo } from './Logo'
import { cn } from '../lib/utils'
import { Button } from './ui/Button'

interface SidebarProps {
  isCollapsed: boolean
  toggleCollapse: () => void
  closeMobile?: () => void
  isMobile?: boolean
}

export function Sidebar({ isCollapsed, toggleCollapse, closeMobile, isMobile = false }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const sidebarLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Internships', path: '/internships', icon: Briefcase },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { name: 'Mock Interview', path: '/interview', icon: Video },
    { name: 'Career Roadmap', path: '/roadmap', icon: Map },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  const handleLogout = () => {
    // Navigate back to home or sign in page
    if (closeMobile) closeMobile()
    navigate('/')
  }

  return (
    <aside
      className={cn(
        'h-full flex flex-col border-r border-border bg-surface/80 backdrop-blur-xl transition-all duration-300 z-30',
        isMobile ? 'w-64' : isCollapsed ? 'w-20' : 'w-64',
        !isMobile && 'sticky top-0'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {isCollapsed && !isMobile ? (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
        ) : (
          <Logo />
        )}

        {/* Desktop Collapse Button */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 rounded-lg hover:bg-surface-hover hover:text-text-primary text-text-muted hidden md:flex"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.path

          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMobile}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'text-white bg-gradient-to-r from-primary/20 to-secondary/10 border-l-2 border-primary shadow-sm shadow-primary/5'
                  : 'text-text-secondary hover:text-white hover:bg-surface-hover'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105',
                  isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
                )}
              />
              {(!isCollapsed || isMobile) && (
                <span className="truncate">{link.name}</span>
              )}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-4 rounded-md bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-primary border border-border shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                  {link.name}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Sidebar Footer (User Action) */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors duration-200 group relative cursor-pointer',
            isCollapsed && !isMobile && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          {(!isCollapsed || isMobile) && <span>Logout</span>}
          {isCollapsed && !isMobile && (
            <div className="absolute left-full ml-4 rounded-md bg-surface px-2.5 py-1.5 text-xs font-semibold text-error border border-border shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}
