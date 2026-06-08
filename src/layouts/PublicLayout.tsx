import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#020617', color: '#ffffff' }}>
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#64748b' }}>
        <p>© {new Date().getFullYear()} InternHub. Powered by AI for Career Development.</p>
      </footer>
    </div>
  )
}
