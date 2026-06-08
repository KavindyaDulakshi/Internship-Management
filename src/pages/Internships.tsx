import { useState } from 'react'
import { mockInternships } from '../data/mockData'
import { Search, MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Filter, X, ExternalLink } from 'lucide-react'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B',
  success: '#10B981', warning: '#F59E0B', error: '#EF4444',
}

const TYPES = ['All', 'Software Engineering', 'Design', 'AI/ML', 'Data Science']
const DURATIONS = ['Any', '10 weeks', '12 weeks', '14 weeks', '16 weeks']
const LOCATIONS = ['Any', 'Remote', 'San Francisco, CA', 'New York, NY']

export default function Internships() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [duration, setDuration] = useState('Any')
  const [location, setLocation] = useState('Any')
  const [saved, setSaved] = useState<Set<string>>(new Set(['1', '3']))
  const [applied, setApplied] = useState<Set<string>>(new Set(['2']))
  const [showFilters, setShowFilters] = useState(true)

  const filtered = mockInternships.filter(j => {
    const q = search.toLowerCase()
    const matchQ = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q))
    const matchType = type === 'All' || j.type === type
    const matchDur = duration === 'Any' || j.duration === duration
    const matchLoc = location === 'Any' || j.location.includes(location)
    return matchQ && matchType && matchDur && matchLoc
  })

  const toggleSave = (id: string) => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleApply = (id: string) => setApplied(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const matchColor = (score: number) =>
    score >= 90 ? C.success : score >= 80 ? C.secondary : C.warning

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>
          Internship Search
        </h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>
          {filtered.length} opportunities matched to your profile
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search size={17} color={C.textMuted} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          placeholder="Search by role, company or skill..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', height: 50, borderRadius: 14,
            border: `1px solid ${C.border}`, background: C.surface,
            color: C.textPrimary, fontSize: 15, paddingLeft: 48, paddingRight: 16,
            outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = C.primary)}
          onBlur={e => (e.target.style.borderColor = C.border)}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted }}>
            <X size={17} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Filters Sidebar */}
        {showFilters && (
          <div style={{ width: 240, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={15} /> Filters
              </span>
              <button onClick={() => { setType('All'); setDuration('Any'); setLocation('Any') }}
                style={{ background: 'none', border: 'none', fontSize: 12, color: C.secondary, cursor: 'pointer', fontWeight: 600 }}>
                Reset
              </button>
            </div>

            {[
              { label: 'Job Type', value: type, set: setType, options: TYPES },
              { label: 'Duration', value: duration, set: setDuration, options: DURATIONS },
              { label: 'Location', value: location, set: setLocation, options: LOCATIONS },
            ].map(({ label, value, set, options }) => (
              <div key={label}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {options.map(opt => (
                    <button key={opt} onClick={() => set(opt)}
                      style={{
                        textAlign: 'left', padding: '8px 12px', borderRadius: 10, border: 'none',
                        background: value === opt ? `${C.primary}22` : 'transparent',
                        color: value === opt ? C.primary : C.textSecondary,
                        fontSize: 13, fontWeight: value === opt ? 700 : 500,
                        cursor: 'pointer', transition: 'all 0.15s',
                        outline: value === opt ? `1px solid ${C.primary}44` : 'none',
                      }}
                      onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover }}
                      onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>No matches found</div>
              <div style={{ fontSize: 14, color: C.textSecondary }}>Try adjusting your search or filters</div>
            </div>
          ) : filtered.map(job => (
            <div key={job.id} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 20, padding: 22,
              display: 'flex', flexDirection: 'column', gap: 14,
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: job.companyColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0,
                    border: `1px solid ${C.border}`,
                  }}>{job.companyLogo}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, lineHeight: 1.3 }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{job.company} · {job.postedDate}</div>
                  </div>
                </div>
                <span style={{
                  background: matchColor(job.matchScore) + '20',
                  color: matchColor(job.matchScore),
                  border: `1px solid ${matchColor(job.matchScore)}40`,
                  borderRadius: 8, padding: '4px 10px',
                  fontSize: 12, fontWeight: 800, flexShrink: 0,
                }}>{job.matchScore}% match</span>
              </div>

              {/* Details Row */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {[
                  { icon: MapPin, text: job.location },
                  { icon: Clock, text: job.duration },
                  { icon: DollarSign, text: job.salary },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.textSecondary }}>
                    <Icon size={12} color={C.textMuted} /> {text}
                  </span>
                ))}
              </div>

              {/* Skill Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {job.skills.map(s => (
                  <span key={s} style={{
                    background: 'rgba(79,70,229,0.12)', color: '#818cf8',
                    border: '1px solid rgba(79,70,229,0.25)',
                    borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                <button onClick={() => toggleApply(job.id)}
                  style={{
                    flex: 1, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: applied.has(job.id) ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                    color: applied.has(job.id) ? C.success : '#fff',
                    fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    outline: applied.has(job.id) ? `1px solid ${C.success}40` : 'none',
                    transition: 'all 0.2s',
                  }}>
                  {applied.has(job.id) ? '✓ Applied' : <><ExternalLink size={13} /> Apply Now</>}
                </button>
                <button onClick={() => toggleSave(job.id)}
                  style={{
                    width: 38, height: 38, borderRadius: 10, cursor: 'pointer',
                    background: saved.has(job.id) ? 'rgba(79,70,229,0.15)' : 'transparent',
                    border: `1px solid ${saved.has(job.id) ? C.primary + '50' : C.border}`,
                    color: saved.has(job.id) ? C.primary : C.textMuted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                  {saved.has(job.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
