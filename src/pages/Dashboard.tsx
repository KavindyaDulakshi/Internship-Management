import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { mockUser, mockApplications, mockInternships } from '../data/mockData'
import { TrendingUp, Briefcase, FileText, Users, ArrowRight, CheckCircle, Clock, XCircle, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

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

const trendData = [
  { name: 'Wk 1', Applications: 1, Interviews: 0 },
  { name: 'Wk 2', Applications: 3, Interviews: 1 },
  { name: 'Wk 3', Applications: 5, Interviews: 1 },
  { name: 'Wk 4', Applications: 7, Interviews: 2 },
]

function useContainerDimensions() {
  const ref = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return

    const observeTarget = ref.current
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return
      const entry = entries[0]
      const width = entry.contentRect.width
      const height = entry.contentRect.height
      if (width > 0 && height > 0) {
        setDimensions({ width, height })
      }
    })

    resizeObserver.observe(observeTarget)

    const rect = observeTarget.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      setDimensions({ width: rect.width, height: rect.height })
    }

    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [])

  return [ref, dimensions] as const
}

export default function Dashboard() {
  const [trendContainerRef, trendDim] = useContainerDimensions()
  const [skillsContainerRef, skillsDim] = useContainerDimensions()

  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || user?.user_metadata?.fullName || user?.email || 'User'
  const firstName = name.split(' ').filter(Boolean)[0] || 'User'
  const topMatches = mockInternships.slice(0, 3)

  const chartSkillsData = mockUser.skills.map((s, i) => ({
    name: s.name,
    Level: s.level,
    fill: ['#4F46E5', '#06B6D4', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][i % 6]
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Welcome Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Good evening, {firstName} 👋
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
            boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
          }}>
            Explore Jobs <ArrowRight size={15} />
          </button>
        </Link>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {/* Recommended count card */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
          padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'rgba(79,70,229,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary,
            }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.textSecondary, fontWeight: 600 }}>Recommended</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary }}>24 Jobs</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>Matches your Profile & Skills</div>
        </div>

        {/* ATS Score card */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
          padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 12, color: C.textSecondary, fontWeight: 600 }}>ATS Resume Score</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, marginTop: 4 }}>85/100</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Strong Match</div>
          </div>
          <ScoreRing score={85} color={C.secondary} />
        </div>

        {/* Mock Interview count card */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
          padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 12, color: C.textSecondary, fontWeight: 600 }}>Interview Readiness</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, marginTop: 4 }}>72/100</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Average Feedback</div>
          </div>
          <ScoreRing score={72} color={C.primary} />
        </div>

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

      {/* Analytics & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Weekly Trend Area Chart */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
          padding: '24px 20px', minHeight: 300, display: 'flex', flexDirection: 'column',
          minWidth: 0
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>Weekly Application Trend</h3>
          <div ref={trendContainerRef} style={{ flex: 1, width: '100%', height: 220, minWidth: 0 }}>
            {trendDim.width > 0 && trendDim.height > 0 && (
              <AreaChart width={trendDim.width} height={trendDim.height} data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.secondary} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={C.secondary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke={C.textMuted} fontSize={11} tickLine={false} />
                <YAxis stroke={C.textMuted} fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0F172A', border: `1px solid ${C.border}`, borderRadius: 8, color: '#fff', fontSize: 12 }} 
                  itemStyle={{ color: C.textSecondary }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: C.textSecondary, paddingTop: 10 }} />
                <Area type="monotone" dataKey="Applications" stroke={C.secondary} strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="Interviews" stroke={C.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorInts)" />
              </AreaChart>
            )}
          </div>
        </div>

        {/* Skill Levels Bar Chart */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
          padding: '24px 20px', minHeight: 300, display: 'flex', flexDirection: 'column',
          minWidth: 0
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>Core Skills Proficiency</h3>
          <div ref={skillsContainerRef} style={{ flex: 1, width: '100%', height: 220, minWidth: 0 }}>
            {skillsDim.width > 0 && skillsDim.height > 0 && (
              <BarChart width={skillsDim.width} height={skillsDim.height} data={chartSkillsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke={C.textMuted} fontSize={11} tickLine={false} />
                <YAxis stroke={C.textMuted} fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ background: '#0F172A', border: `1px solid ${C.border}`, borderRadius: 8, color: '#fff', fontSize: 12 }}
                  itemStyle={{ color: C.textSecondary }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="Level" radius={[4, 4, 0, 0]} barSize={26} />
              </BarChart>
            )}
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
