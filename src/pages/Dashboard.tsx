import { Link } from 'react-router-dom'
import { mockUser, mockApplications, mockInternships } from '../data/mockData'
import { TrendingUp, Briefcase, FileText, Users, ArrowRight, CheckCircle, Clock, XCircle, Star } from 'lucide-react'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B',
  success: '#10B981', warning: '#F59E0B', error: '#EF4444',
}

function ScoreRing({ score, color, size = 80 }: { score: number, color: string, size?: number }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x={size/2} y={size/2 + 6} textAnchor="middle" fill="#fff"
        style={{ transform: `rotate(90deg) translate(0, -${size}px)`, fontSize: 16, fontWeight: 800 }}>
        {score}%
      </text>
    </svg>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string, bg: string, icon: any }> = {
    'Applied': { color: C.secondary, bg: 'rgba(6,182,212,0.12)', icon: Clock },
    'In Review': { color: C.warning, bg: 'rgba(245,158,11,0.12)', icon: Clock },
    'Interview': { color: C.primary, bg: 'rgba(79,70,229,0.12)', icon: Star },
    'Rejected': { color: C.error, bg: 'rgba(239,68,68,0.12)', icon: XCircle },
    'Accepted': { color: C.success, bg: 'rgba(16,185,129,0.12)', icon: CheckCircle },
  }
  const s = map[status] || map['Applied']
  const Icon = s.icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color, border: `1px solid ${s.color}30`,
      borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700,
    }}>
      <Icon size={11} /> {status}
    </span>
  )
}

export default function Dashboard() {
  const topMatches = mockInternships.slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Welcome Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Good evening, {mockUser.name.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            Here's your career progress for this week — keep going!
          </p>
        </div>
        <Link to="/internships" style={{ textDecoration: 'none' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
            border: 'none', borderRadius: 12, color: '#fff',
            padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>
            Browse Internships <ArrowRight size={15} />
          </button>
        </Link>
      </div>

      {/* Score Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Internship Match Score', score: mockUser.matchScore, color: C.primary, icon: TrendingUp, sub: 'Top 8% match rate' },
          { label: 'Resume ATS Score', score: mockUser.atsScore, color: C.secondary, icon: FileText, sub: '+12% vs last upload' },
          { label: 'Interview Readiness', score: mockUser.interviewScore, color: '#8B5CF6', icon: Users, sub: 'Great progress!' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
              padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 12, textAlign: 'center',
            }}>
              <div style={{ position: 'relative' }}>
                <ScoreRing score={item.score} color={item.color} size={90} />
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={item.color} style={{ marginTop: -2 }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{item.label}</div>
                <div style={{ fontSize: 11, color: item.color, marginTop: 3, fontWeight: 500 }}>{item.sub}</div>
              </div>
            </div>
          )
        })}

        {/* Applications count card */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
          padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8,
        }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: C.textPrimary }}>7</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>Applications Sent</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>3 in review · 1 interview</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            {[C.secondary, C.warning, C.primary, C.error].map((c, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: c, opacity: 0.7 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recommended + Recent Applications + Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recommended Internships */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Recommended Matches</h2>
            <Link to="/internships" style={{ fontSize: 12, color: C.secondary, textDecoration: 'none', fontWeight: 600 }}>
              See all →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topMatches.map(job => (
              <div key={job.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '12px 14px', borderRadius: 14, border: `1px solid ${C.border}`,
                background: C.surfaceHover, transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: job.companyColor, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff',
                    border: `1px solid ${C.border}`,
                  }}>{job.companyLogo}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{job.company} · {job.location}</div>
                  </div>
                </div>
                <span style={{
                  background: 'rgba(16,185,129,0.12)', color: C.success,
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                }}>{job.matchScore}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications + Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Recent Applications */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>Recent Applications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mockApplications.map(app => (
                <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, background: app.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
                    }}>{app.company[0]}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary }}>{app.role}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{app.date}</div>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Skill Progress */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>Skill Progress</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockUser.skills.slice(0, 4).map(skill => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary }}>{skill.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary }}>{skill.level}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, width: `${skill.level}%`,
                      background: 'linear-gradient(90deg, #4F46E5, #06B6D4)',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
