import { useState, useEffect } from 'react'
import { Search, MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Filter, X, ExternalLink } from 'lucide-react'
import { internshipApi, Internship } from '../lib/api'
import { useAuth } from '../context/AuthContext'

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
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [duration, setDuration] = useState('Any')
  const [location, setLocation] = useState('Any')
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  const fetchInternships = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await internshipApi.getAll({
        search: search.trim() || undefined,
        type: type !== 'All' ? type : undefined,
        duration: duration !== 'Any' ? duration : undefined,
        location: location !== 'Any' ? location : undefined,
      })
      if (res && res.data && res.data.internships) {
        setInternships(res.data.internships)
      } else {
        setInternships([])
      }
    } catch (err: any) {
      console.error('Error loading internships:', err)
      setError(err.message || 'Failed to load internships.')
    } finally {
      setLoading(false)
    }
  }

  // Effect to load internships with search debouncing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchInternships()
    }, 250)

    return () => clearTimeout(delayDebounce)
  }, [search, type, duration, location, user])

  const toggleSave = async (id: string) => {
    if (!user) {
      alert('Please sign in to save internships.')
      return
    }
    try {
      const res = await internshipApi.toggleSave(id)
      setInternships(prev =>
        prev.map(job =>
          job.id === id ? { ...job, saved: res.data.saved } : job
        )
      )
    } catch (err: any) {
      console.error('Failed to toggle save:', err)
    }
  }

  const toggleApply = (id: string) => {
    // Mock apply action locally (since no backend application post endpoint is defined yet)
    setInternships(prev =>
      prev.map(job =>
        job.id === id ? { ...job, applied: !job.applied } : job
      )
    )
  }

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
          {loading ? 'Searching...' : `${internships.length} opportunities matched to your profile`}
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 16, padding: '16px 20px', color: C.error, fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 12 }}>
              <div style={{
                width: 30, height: 30, border: '3px solid #4F46E5',
                borderTopColor: 'transparent', borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }} />
              <div style={{ fontSize: 14, color: C.textSecondary }}>Fetching jobs...</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : internships.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>No matches found</div>
              <div style={{ fontSize: 14, color: C.textSecondary }}>Try adjusting your search or filters</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {internships.map(job => (
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
                        background: job.applied ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                        color: job.applied ? C.success : '#fff',
                        fontSize: 13, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        outline: job.applied ? `1px solid ${C.success}40` : 'none',
                        transition: 'all 0.2s',
                      }}>
                      {job.applied ? '✓ Applied' : <><ExternalLink size={13} /> Apply Now</>}
                    </button>
                    <button onClick={() => toggleSave(job.id)}
                      style={{
                        width: 38, height: 38, borderRadius: 10, cursor: 'pointer',
                        background: job.saved ? 'rgba(79,70,229,0.15)' : 'transparent',
                        border: `1px solid ${job.saved ? C.primary + '50' : C.border}`,
                        color: job.saved ? C.primary : C.textMuted,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}>
                      {job.saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
