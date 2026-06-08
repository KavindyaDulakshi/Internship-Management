import { Link } from 'react-router-dom'
import {
  Sparkles, ArrowRight, Brain, FileSearch, Video, Map,
  Users, Briefcase, Building2, ChevronRight
} from 'lucide-react'

// ── tiny inline-style helpers so we don't depend on Tailwind scanning ────────
const C = {
  bg: '#020617',
  surface: '#0F172A',
  surfaceHover: '#1E293B',
  border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5',
  secondary: '#06B6D4',
  textPrimary: '#ffffff',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: 'linear-gradient(135deg, #6366f1 0%, #06B6D4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>
      {children}
    </span>
  )
}

function StatCard({ value, label, icon: Icon, gradStart, gradEnd }: {
  value: string, label: string, icon: any, gradStart: string, gradEnd: string
}) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 20,
      padding: '24px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: '1 1 240px',
      minWidth: 200,
      transition: 'transform 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.16)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}
    >
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.textPrimary, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} color="#fff" />
      </div>
    </div>
  )
}

function FeatureCard({ title, desc, icon: Icon, accent }: {
  title: string, desc: string, icon: any, accent: string
}) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 20,
      padding: '28px 28px',
      display: 'flex',
      gap: 20,
      alignItems: 'flex-start',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.16)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: accent + '1A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={22} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65 }}>{desc}</div>
      </div>
    </div>
  )
}

export default function Landing() {
  const stats = [
    { value: '10,000+', label: 'Active Students', icon: Users, gradStart: '#4F46E5', gradEnd: '#6366F1' },
    { value: '5,000+', label: 'AI Internship Matches', icon: Briefcase, gradStart: '#06B6D4', gradEnd: '#0891B2' },
    { value: '500+', label: 'Partner Companies', icon: Building2, gradStart: '#8B5CF6', gradEnd: '#7C3AED' },
  ]

  const features = [
    { title: 'AI Internship Matcher', desc: 'Semantic AI scoring instantly matches your profile skills against thousands of active listings with personalized fit percentages.', icon: Brain, accent: '#6366F1' },
    { title: 'ATS Resume Analyzer', desc: 'Upload your resume for instant ATS scoring, missing keywords identification, and structural improvement suggestions.', icon: FileSearch, accent: '#06B6D4' },
    { title: 'AI Mock Interviews', desc: 'Simulate real interviews with AI-generated questions. Receive detailed performance ratings, speaking tips, and model answers.', icon: Video, accent: '#8B5CF6' },
    { title: 'Dynamic Career Roadmap', desc: 'Auto-generated career milestone timelines with curated study resources, weekly skill objectives, and progress tracking.', icon: Map, accent: '#10B981' },
  ]

  const mockMatches = [
    { title: 'Frontend Developer Intern', company: 'Vercel', match: '96%' },
    { title: 'Software Engineer Intern', company: 'Linear', match: '92%' },
    { title: 'Product UI Developer', company: 'Stripe', match: '88%' },
  ]

  return (
    <div style={{ backgroundColor: C.bg, overflowX: 'hidden', position: 'relative' }}>

      {/* ── Background Glow Blobs ─────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 600,
        background: 'radial-gradient(ellipse at center, rgba(79,70,229,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', right: -200,
        width: 600, height: 600,
        background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center',
        padding: '100px 24px 60px',
        maxWidth: 900,
        margin: '0 auto',
      }}>
        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999, padding: '6px 16px',
            fontSize: 12, fontWeight: 600, color: C.textSecondary,
            letterSpacing: '0.05em',
          }}>
            <Sparkles size={13} color={C.secondary} />
            Empower your search with AI Matcher v2.0
            <ChevronRight size={13} color={C.textMuted} />
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 76px)',
          fontWeight: 900, lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          marginBottom: 28,
        }}>
          Find Your Dream<br />
          <GradientText>Internship Faster</GradientText>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 18, color: C.textSecondary, lineHeight: 1.75,
          maxWidth: 620, margin: '0 auto 44px',
          fontWeight: 400,
        }}>
          Use state-of-the-art AI to discover internships, optimize your resume,
          simulate interviews, and build your career roadmap — all in one place.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '14px 32px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s',
              boxShadow: '0 0 30px rgba(79,70,229,0.35)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
            >
              Get Started <ArrowRight size={16} />
            </button>
          </Link>
          <Link to="/internships" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: C.textPrimary,
              border: `1px solid ${C.border}`,
              borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              Explore Internships
            </button>
          </Link>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW CARD ───────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto', padding: '20px 24px 80px',
      }}>
        <div style={{
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          padding: 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          boxShadow: '0 0 80px rgba(79,70,229,0.15), 0 40px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Window bar */}
          <div style={{
            background: C.surface, borderRadius: '20px 20px 0 0',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px',
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[C.error, C.warning, C.success].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />
              ))}
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '4px 16px', fontSize: 12, color: C.textMuted, fontWeight: 500,
            }}>
              internhub.ai/dashboard
            </div>
            <div style={{ width: 60 }} />
          </div>

          {/* Mock Dashboard Content */}
          <div style={{
            background: 'rgba(2,6,23,0.9)', borderRadius: '0 0 20px 20px',
            display: 'grid', gridTemplateColumns: '1fr 1fr 300px',
            gap: 20, padding: 24, minHeight: 220,
          }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: '10px 16px',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>ATS Matching Engine</span>
              </div>
              {[100, 90, 65].map((w, i) => (
                <div key={i} style={{
                  height: 10, width: `${w}%`, borderRadius: 6,
                  background: 'rgba(255,255,255,0.07)', border: `1px solid ${C.border}`,
                }} />
              ))}
            </div>

            {/* Center column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'ATS Resume Score', value: '89%', sub: '+12% vs last week', subColor: C.success },
                { label: 'Interview Readiness', value: 'Excellent', sub: 'Top 10% of users', subColor: C.secondary },
                { label: 'Skill Match Rate', value: '94%', sub: 'React · TypeScript', subColor: C.textMuted },
                { label: 'Applications Sent', value: '7', sub: '3 in review', subColor: C.warning },
              ].map((item, i) => (
                <div key={i} style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: '14px 16px',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{item.value}</div>
                  <div style={{ fontSize: 11, color: item.subColor, marginTop: 3, fontWeight: 500 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Right sidebar */}
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: '16px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>Recommended Matches</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mockMatches.map((job, i) => (
                  <div key={i} style={{
                    background: C.surfaceHover, border: `1px solid ${C.border}`,
                    borderRadius: 10, padding: '10px 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{job.title}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{job.company}</div>
                    </div>
                    <span style={{
                      background: 'rgba(16,185,129,0.15)', color: C.success,
                      border: '1px solid rgba(16,185,129,0.25)',
                      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700,
                    }}>{job.match}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999, padding: '5px 16px',
            fontSize: 11, fontWeight: 700, color: C.secondary,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20,
          }}>Platform Features</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 14 }}>
            AI-Powered Career Toolkit
          </h2>
          <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Everything you need to level up and land competitive tech internships.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.18) 0%, rgba(15,23,42,0.9) 50%, rgba(6,182,212,0.12) 100%)',
          border: `1px solid rgba(255,255,255,0.1)`,
          borderRadius: 28,
          padding: '72px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -100, right: -100,
            width: 400, height: 400,
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.1), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 18 }}>
            Ready to launch your career?
          </h2>
          <p style={{ fontSize: 17, color: C.textSecondary, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Join thousands of students already optimizing their portfolios and landing tech internships.
          </p>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '16px 40px', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s',
              boxShadow: '0 0 40px rgba(79,70,229,0.4)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
            >
              Create Free Account <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
