import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, TrendingUp, Zap } from 'lucide-react'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B',
  success: '#10B981', warning: '#F59E0B', error: '#EF4444',
}

const missingSkills = ['Docker', 'Kubernetes', 'GraphQL', 'Redis', 'System Design']
const suggestions = [
  { type: 'error' as const, text: 'Use bullet points instead of paragraphs in Experience section', impact: 'High' },
  { type: 'warning' as const, text: 'Add measurable metrics to project descriptions (e.g., "improved speed by 40%")', impact: 'High' },
  { type: 'warning' as const, text: 'Skills section lacks industry-standard keyword "CI/CD"', impact: 'Medium' },
  { type: 'success' as const, text: 'Education section is well-formatted and complete', impact: 'Low' },
  { type: 'success' as const, text: 'Contact information is clearly visible at the top', impact: 'Low' },
]

function ScoreGauge({ score }: { score: number }) {
  const angle = -135 + (score / 100) * 270
  const color = score >= 80 ? C.success : score >= 60 ? C.warning : C.error
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 140, height: 100 }}>
        <svg width={140} height={120} viewBox="0 0 140 120">
          <path d="M 20 100 A 50 50 0 1 1 120 100" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} strokeLinecap="round" />
          <path d="M 20 100 A 50 50 0 1 1 120 100" fill="none" stroke={color} strokeWidth={10}
            strokeDasharray={`${157.08 * score / 100} 157.08`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }} />
          <text x={70} y={88} textAnchor="middle" fill="#fff" fontSize={26} fontWeight={900}>{score}</text>
          <text x={70} y={104} textAnchor="middle" fill={C.textMuted} fontSize={11} fontWeight={600}>/ 100</text>
        </svg>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>
        {score >= 80 ? '🟢 Excellent ATS Score' : score >= 60 ? '🟡 Needs Improvement' : '🔴 Poor ATS Score'}
      </div>
    </div>
  )
}

export default function ResumeAnalyzer() {
  const [uploaded, setUploaded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [done, setDone] = useState(false)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    setAnalyzing(true)
    setTimeout(() => { setAnalyzing(false); setDone(true) }, 2200)
  }

  const handleFile = () => { setUploaded(true); setTimeout(handleUpload, 300) }

  const iconMap = { error: <XCircle size={16} color={C.error} />, warning: <AlertTriangle size={16} color={C.warning} />, success: <CheckCircle size={16} color={C.success} /> }
  const bgMap = { error: 'rgba(239,68,68,0.08)', warning: 'rgba(245,158,11,0.08)', success: 'rgba(16,185,129,0.08)' }
  const borderMap = { error: 'rgba(239,68,68,0.2)', warning: 'rgba(245,158,11,0.2)', success: 'rgba(16,185,129,0.2)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>
          Resume Analyzer
        </h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Upload your resume to get an ATS score, missing skills, and actionable improvements.</p>
      </div>

      {!done ? (
        /* Upload Zone */
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile() }}
          style={{
            border: `2px dashed ${drag ? C.primary : C.border}`,
            borderRadius: 24, padding: '80px 40px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
            background: drag ? `${C.primary}08` : C.surface,
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFile} />
          {analyzing ? (
            <>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                border: `3px solid ${C.border}`, borderTopColor: C.primary,
                animation: 'spin 0.8s linear infinite',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary }}>Analyzing your resume…</div>
              <div style={{ fontSize: 14, color: C.textSecondary }}>Our AI is scanning for ATS compatibility, keywords, and structure</div>
            </>
          ) : (
            <>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Upload size={30} color={C.primary} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, marginBottom: 8 }}>Drop your resume here</div>
                <div style={{ fontSize: 14, color: C.textSecondary }}>or click to browse · PDF, DOC, DOCX supported</div>
              </div>
              <span style={{
                background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                color: '#fff', borderRadius: 12, padding: '10px 24px',
                fontSize: 14, fontWeight: 700, marginTop: 8,
              }}>Upload Resume</span>
            </>
          )}
        </div>
      ) : (
        /* Results */
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Left: ATS Score */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>ATS Compatibility Score</div>
              <ScoreGauge score={89} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
                {[{ label: 'Keywords', val: '94%' }, { label: 'Formatting', val: '88%' }, { label: 'Sections', val: '92%' }, { label: 'Length', val: '75%' }].map(({ label, val }) => (
                  <div key={label} style={{ background: C.surfaceHover, borderRadius: 10, padding: '10px 12px', border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={15} color={C.warning} /> Missing Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {missingSkills.map(s => (
                  <span key={s} style={{
                    background: 'rgba(245,158,11,0.1)', color: C.warning,
                    border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600,
                  }}>+ {s}</span>
                ))}
              </div>
            </div>

            <button onClick={() => setDone(false)}
              style={{
                width: '100%', height: 44, borderRadius: 12, border: `1px solid ${C.border}`,
                background: 'transparent', color: C.textSecondary, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.surfaceHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <FileText size={15} /> Upload Different Resume
            </button>
          </div>

          {/* Right: Suggestions */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <TrendingUp size={17} color={C.secondary} />
              <span style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>AI Improvement Suggestions</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{
                  background: bgMap[s.type], border: `1px solid ${borderMap[s.type]}`,
                  borderRadius: 14, padding: '14px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <div style={{ flexShrink: 0, marginTop: 1 }}>{iconMap[s.type]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, lineHeight: 1.5 }}>{s.text}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Impact: <strong style={{ color: s.impact === 'High' ? C.error : s.impact === 'Medium' ? C.warning : C.textMuted }}>{s.impact}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
