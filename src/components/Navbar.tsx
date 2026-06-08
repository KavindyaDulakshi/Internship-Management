import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Search, Sparkles } from 'lucide-react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Internships', path: '/internships' },
    { name: 'Resume Analyzer', path: '/resume-analyzer' },
    { name: 'Career Roadmap', path: '/roadmap' },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/internships?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border glass transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 border ${
                    isActive
                      ? 'text-white bg-white/10 border-white/10 shadow-sm'
                      : 'text-text-secondary border-transparent hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Search bar & Auth controls */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs lg:max-w-sm justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[200px] lg:max-w-[240px]">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pr-8 pl-3 bg-surface-hover/30 border-border text-xs rounded-lg"
                icon={<Search className="h-3.5 w-3.5 text-text-muted absolute right-3" />}
              />
            </form>

            <ThemeToggle />

            <Link to="/signin" className="inline-flex">
              <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white">
                Sign In
              </Button>
            </Link>

            <Link to="/signup" className="inline-flex">
              <Button size="sm" className="gradient-primary">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden glass animate-slide-down border-t border-border px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="text"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pr-10 pl-3 w-full bg-surface-hover/30 text-sm"
              icon={<Search className="h-4 w-4 text-text-muted absolute right-3" />}
            />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? 'text-white bg-white/5 border-l-4 border-primary'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <Link to="/signin" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full h-11 text-text-primary border-border">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full">
              <Button className="w-full h-11 gradient-primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
