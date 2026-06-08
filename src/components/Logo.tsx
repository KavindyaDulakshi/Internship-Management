import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center space-x-2 group ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105">
        <Sparkles className="h-5 w-5 animate-pulse" />
        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-text-secondary bg-clip-text text-transparent group-hover:to-white transition-all duration-300">
        Intern<span className="text-secondary font-extrabold">Hub</span>
      </span>
    </Link>
  )
}
