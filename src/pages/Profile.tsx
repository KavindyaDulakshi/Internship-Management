import { mockUser, mockInternshipHistory } from '../data/mockData'
import { MapPin, Mail, GraduationCap, Briefcase, Award, FileText, Edit3 } from 'lucide-react'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B',
  success: '#10B981', warning: '#F59E0B',
}

export default function Profile() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Profile Header Card */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24,
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Banner */}
        <div style={{
          height: 120,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.5) 0%, rgba(6,182,212,0.4) 50%, rgba(139,92,246,0.3) 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>

        <div style={{ padding: '0 28px 28px' }}>
          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginTop: -36 }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              border: '4px solid #0F172A',
              background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 900, color: '#fff', overflow: 'hidden',
              flexShrink: 0,
            }}>
              {mockUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: 10, color: C.textSecondary, padding: '8px 14px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s', marginBottom: 4,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary }}
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          </div>

          {/* Name & Info */}
          <div style={{ marginTop: 14 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>{mockUser.name}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
              {[
                { icon: GraduationCap, text: mockUser.university },
                { icon: Briefcase, text: mockUser.degree },
                { icon: MapPin, text: mockUser.location },
                { icon: Mail, text: mockUser.email },
              ].map(({ icon: Icon, text }) => (
                <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textSecondary }}>
                  <Icon size={13} color={C.textMuted} /> {text}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 14, color: C.textSecondary, marginTop: 12, lineHeight: 1.65, maxWidth: 600 }}>{mockUser.bio}</p>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Match Score', value: `${mockUser.matchScore}%`, color: C.primary },
              { label: 'ATS Score', value: `${mockUser.atsScore}%`, color: C.secondary },
              { label: 'Interview Score', value: `${mockUser.interviewScore}%`, color: '#8B5CF6' },
              { label: 'Year', value: mockUser.year, color: C.success },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Skills */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 20 }}>Technical Skills</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mockUser.skills.map(skill => (
              <div key={skill.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>{skill.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.textPrimary }}>{skill.level}%</span>
                </div>
                <div style={{ height: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${skill.level}%`, borderRadius: 4,
                    background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={16} color={C.warning} /> Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockUser.certifications.map(cert => (
              <div key={cert.name} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                background: C.surfaceHover, border: `1px solid ${C.border}`,
                borderRadius: 14, transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <span style={{ fontSize: 24 }}>{cert.badge}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{cert.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{cert.issuer} · {cert.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resume + Internship History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Resume */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={15} color={C.secondary} /> Resume
          </h2>
          <div style={{
            background: C.surfaceHover, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 46, height: 54, borderRadius: 8, background: 'rgba(239,68,68,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(239,68,68,0.25)',
              }}>
                <FileText size={22} color="#EF4444" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>Alex_Johnson_Resume.pdf</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Updated Jun 1, 2026 · 2 pages</div>
                <div style={{ fontSize: 11, color: C.success, marginTop: 2 }}>● ATS Score: 89%</div>
              </div>
            </div>
            <button style={{
              background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 10,
              color: C.textSecondary, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Download
            </button>
          </div>
        </div>

        {/* Internship History */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={15} color={C.primary} /> Internship History
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockInternshipHistory.map(h => (
              <div key={h.id} style={{
                padding: '14px 16px', background: C.surfaceHover,
                border: `1px solid ${C.border}`, borderRadius: 14,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{h.role}</div>
                    <div style={{ fontSize: 12, color: C.secondary, fontWeight: 600 }}>{h.company}</div>
                  </div>
                  <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: 'nowrap' }}>{h.period}</span>
                </div>
                <p style={{ fontSize: 12, color: C.textSecondary, marginTop: 8, lineHeight: 1.6 }}>{h.description}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {h.skills.map(s => (
                    <span key={s} style={{
                      background: 'rgba(79,70,229,0.12)', color: '#818cf8',
                      border: '1px solid rgba(79,70,229,0.25)',
                      borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 600,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
