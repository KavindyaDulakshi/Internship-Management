import { Outlet, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const C = {
  bg: '#020617', surface: '#0F172A', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textSecondary: '#94A3B8',
}

export function AuthLayout() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: C.bg, color: '#fff',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow blobs */}
      <div style={{
        position: 'fixed', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 600,
        background: 'radial-gradient(ellipse, rgba(79,70,229,0.14) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: -100, right: -200,
        width: 600, height: 600,
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Two-column layout: branding left, form right */}
      <div style={{ display: 'flex', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Left Panel - Branding */}
        <div style={{
          width: '45%', flexShrink: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 64px',
          background: 'linear-gradient(160deg, rgba(79,70,229,0.08) 0%, rgba(6,182,212,0.05) 100%)',
          borderRight: `1px solid ${C.border}`,
        }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>InternHub</span>
          </Link>

          <div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Launch your<br />
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #06B6D4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>tech career</span><br />
              with AI
            </h2>
            <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.75, marginBottom: 40 }}>
              AI-matched internships, ATS resume scoring, mock interviews, and personalized career roadmaps — all in one platform.
            </p>

            {/* Feature list */}
            {[
              { emoji: '🤖', text: 'AI-powered internship matching (96% accuracy)' },
              { emoji: '📄', text: 'ATS resume analyzer with instant improvements' },
              { emoji: '🎤', text: 'Mock interview simulator with AI feedback' },
              { emoji: '🗺️', text: 'Dynamic career roadmap with milestones' },
            ].map(({ emoji, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}

            {/* Social proof */}
            <div style={{
              marginTop: 48, display: 'flex', alignItems: 'center', gap: 14,
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', gap: -4 }}>
                {['#4F46E5', '#8B5CF6', '#06B6D4', '#10B981'].map((c, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: '50%', background: c,
                    border: '2px solid #0F172A', marginLeft: i > 0 ? -8 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: '#fff',
                  }}>
                    {['A','B','C','D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#F59E0B', fontSize: 13 }}>★</span>)}
                </div>
                <div style={{ fontSize: 12, color: C.textSecondary }}><strong style={{ color: '#fff' }}>10,000+</strong> students landed internships</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '60px 48px',
        }}>
          <div style={{ width: '100%', maxWidth: 460 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
