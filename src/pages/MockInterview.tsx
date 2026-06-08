import { useState } from 'react'
import { mockInterviewQuestions, mockInterviewSession } from '../data/mockData'
import { Play, ChevronRight, Star, RotateCcw, Brain, Clock, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B',
  success: '#10B981', warning: '#F59E0B', error: '#EF4444',
}

const diffColor = { Easy: C.success, Medium: C.warning, Hard: C.error }
const catColor: Record<string, string> = { Behavioral: '#8B5CF6', Technical: C.secondary, 'System Design': C.primary }

export default function MockInterview() {
  const [active, setActive] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({})
  const [started, setStarted] = useState(false)

  const toggleAnswer = (id: string) => setShowAnswer(p => ({ ...p, [id]: !p[id] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Mock Interview
          </h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Practice with AI-generated questions and receive instant performance feedback.</p>
        </div>
        <button onClick={() => setStarted(!started)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: started ? C.surfaceHover : 'linear-gradient(135deg, #4F46E5, #06B6D4)',
            border: started ? `1px solid ${C.border}` : 'none',
            borderRadius: 12, color: '#fff', padding: '10px 20px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>
          {started ? <><RotateCcw size={15} /> New Session</> : <><Play size={15} /> Start Interview</>}
        </button>
      </div>

      {/* Score Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: C.textPrimary, lineHeight: 1 }}>{mockInterviewSession.overallScore}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, fontWeight: 600 }}>Overall Score</div>
          <div style={{ fontSize: 11, color: C.success, marginTop: 4 }}>★ Excellent</div>
        </div>
        {mockInterviewSession.breakdown.map(b => (
          <div key={b.category} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 18px' }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{b.category}</div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${b.score}%`, background: 'linear-gradient(90deg, #4F46E5, #06B6D4)', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary }}>{b.score}<span style={{ fontSize: 12, color: C.textMuted }}>/100</span></div>
          </div>
        ))}
      </div>

      {/* Progress Tracker */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Session Progress</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>{mockInterviewSession.completed} / {mockInterviewSession.totalQuestions} answered</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: mockInterviewSession.totalQuestions }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 8, borderRadius: 4,
              background: i < mockInterviewSession.completed
                ? 'linear-gradient(90deg, #4F46E5, #06B6D4)'
                : 'rgba(255,255,255,0.07)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Question Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mockInterviewQuestions.map((q, idx) => {
          const isOpen = active === q.id
          return (
            <div key={q.id} style={{
              background: C.surface, border: `1px solid ${isOpen ? C.primary + '50' : C.border}`,
              borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              {/* Question Header */}
              <div
                onClick={() => setActive(isOpen ? null : q.id)}
                style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: catColor[q.category] + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Brain size={16} color={catColor[q.category]} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      background: catColor[q.category] + '20', color: catColor[q.category],
                      border: `1px solid ${catColor[q.category]}30`,
                      borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700,
                    }}>{q.category}</span>
                    <span style={{
                      background: (diffColor as any)[q.difficulty] + '18', color: (diffColor as any)[q.difficulty],
                      border: `1px solid ${(diffColor as any)[q.difficulty]}30`,
                      borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700,
                    }}>{q.difficulty}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.textMuted }}>
                      <Clock size={11} /> {q.timeLimit}s
                    </span>
                    <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 'auto' }}>Q{idx + 1}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, lineHeight: 1.55, margin: 0 }}>{q.question}</p>
                </div>
                {isOpen ? <ChevronUp size={18} color={C.textMuted} /> : <ChevronDown size={18} color={C.textMuted} />}
              </div>

              {/* Expanded Content */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Tips */}
                  <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 14, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, fontWeight: 700, color: C.primary }}>
                      <Lightbulb size={13} /> Tips
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {q.tips.map((t, i) => (
                        <div key={i} style={{ fontSize: 13, color: C.textSecondary, display: 'flex', gap: 8 }}>
                          <span style={{ color: C.primary, fontWeight: 700 }}>→</span> {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Score */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: C.surfaceHover, borderRadius: 14, padding: '14px 18px',
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Star size={16} color={C.warning} fill={C.warning} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>AI Feedback Score</span>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 900, color: q.aiScore >= 85 ? C.success : C.warning }}>{q.aiScore}/100</span>
                  </div>

                  {/* AI Feedback */}
                  <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65, background: C.surfaceHover, borderRadius: 14, padding: 16, border: `1px solid ${C.border}` }}>
                    <span style={{ fontWeight: 700, color: C.textPrimary }}>AI Feedback: </span>{q.aiFeedback}
                  </div>

                  {/* Sample Answer Toggle */}
                  <button onClick={() => toggleAnswer(q.id)}
                    style={{
                      background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 12,
                      color: C.secondary, fontSize: 13, fontWeight: 600, padding: '10px 16px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.surfaceHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {showAnswer[q.id] ? 'Hide' : 'View'} sample answer <ChevronRight size={14} />
                  </button>

                  {showAnswer[q.id] && (
                    <div style={{
                      background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)',
                      borderRadius: 14, padding: 16, fontSize: 13, color: C.textSecondary, lineHeight: 1.7,
                    }}>
                      <span style={{ fontWeight: 700, color: C.secondary }}>Sample: </span>{q.sampleAnswer}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
