import { useState } from 'react'
import { Play, ChevronRight, Star, RotateCcw, Brain, Clock, Lightbulb, ChevronDown, ChevronUp, Briefcase, Award, Sparkles } from 'lucide-react'
import { aiApi, type AIMockQuestion } from '../lib/api'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B',
  success: '#10B981', warning: '#F59E0B', error: '#EF4444',
}

const diffColor = { Easy: C.success, Medium: C.warning, Hard: C.error }
const catColor: Record<string, string> = { Behavioral: '#8B5CF6', Technical: C.secondary, 'System Design': C.primary }

export default function MockInterview() {
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form Configuration
  const [skill, setSkill] = useState('React Frontend Developer')
  const [category, setCategory] = useState('Technical')
  const [difficulty, setDifficulty] = useState('Medium')

  // Interview Session State
  const [questions, setQuestions] = useState<AIMockQuestion[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [evaluations, setEvaluations] = useState<Record<string, { aiScore: number; aiFeedback: string; sampleAnswer: string }>>({})
  const [gradingQuestionId, setGradingQuestionId] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({})

  const startInterview = async () => {
    setError('')
    setLoading(true)
    setStarted(true)
    setQuestions([])
    setUserAnswers({})
    setEvaluations({})
    setShowAnswer({})
    setActive(null)

    try {
      const res = await aiApi.generateInterview(category, difficulty, skill)
      if (res.data?.questions) {
        setQuestions(res.data.questions)
        if (res.data.questions.length > 0) {
          setActive(res.data.questions[0].id)
        }
      } else {
        throw new Error('No questions returned by AI.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions. Please try again.')
      setStarted(false)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async (qId: string, questionText: string) => {
    const answerText = userAnswers[qId]?.trim()
    if (!answerText) return

    setError('')
    setGradingQuestionId(qId)

    try {
      const res = await aiApi.evaluateAnswer(questionText, answerText)
      if (res.data) {
        setEvaluations(prev => ({
          ...prev,
          [qId]: {
            aiScore: res.data.aiScore,
            aiFeedback: res.data.aiFeedback,
            sampleAnswer: res.data.sampleAnswer
          }
        }))
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer. Please try again.')
    } finally {
      setGradingQuestionId(null)
    }
  }

  const toggleAnswer = (id: string) => setShowAnswer(p => ({ ...p, [id]: !p[id] }))

  // Calculations for session overview
  const totalQuestions = questions.length
  const completed = Object.keys(evaluations).length
  const scores = Object.values(evaluations).map(e => e.aiScore)
  const overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  const getScoreRating = (score: number) => {
    if (score === 0) return 'Pending Responses'
    if (score >= 85) return '★ Excellent Performance'
    if (score >= 70) return '● Good Progress'
    return '▲ Needs Improvement'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>
            AI Mock Interview
          </h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            Practice with real-time AI-generated questions tailored to your skills and get constructive grading feedback.
          </p>
        </div>
        {started && !loading && (
          <button onClick={() => setStarted(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.surfaceHover, border: `1px solid ${C.border}`,
              borderRadius: 12, color: '#fff', padding: '10px 20px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
            <RotateCcw size={15} /> End Session
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12, padding: '12px 16px',
          color: C.error, fontSize: 13,
        }}>
          <Lightbulb size={16} /> {error}
        </div>
      )}

      {/* Setup screen */}
      {!started && (
        <div style={{
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)',
          border: `1px solid ${C.border}`, borderRadius: 24, padding: '36px 32px',
          maxWidth: 600, margin: '0 auto', width: '100%', boxSizing: 'border-box'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color={C.secondary} /> Configure AI Recruiter Session
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Target Skill Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>Target Role / Specific Skill</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={15} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  value={skill}
                  onChange={e => setSkill(e.target.value)}
                  placeholder="e.g. React Frontend Engineer, Python Specialist"
                  style={{
                    width: '100%', height: 44, borderRadius: 11,
                    border: `1px solid ${C.border}`, background: C.surfaceHover,
                    color: C.textPrimary, fontSize: 14, outline: 'none',
                    boxSizing: 'border-box', paddingLeft: 40, paddingRight: 14,
                  }}
                />
              </div>
            </div>

            {/* Category selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>Question Focus Category</label>
              <div style={{ position: 'relative' }}>
                <Brain size={15} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{
                    width: '100%', height: 44, borderRadius: 11,
                    border: `1px solid ${C.border}`, background: C.surfaceHover,
                    color: C.textPrimary, fontSize: 14, outline: 'none',
                    boxSizing: 'border-box', paddingLeft: 40, paddingRight: 14,
                    cursor: 'pointer'
                  }}
                >
                  <option value="Technical">Technical (Coding, framework specific, architectural)</option>
                  <option value="Behavioral">Behavioral (STAR method, cultural fit, situations)</option>
                  <option value="System Design">System Design (Scalability, architecture, database schemas)</option>
                </select>
              </div>
            </div>

            {/* Difficulty selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>Difficulty Level</label>
              <div style={{ position: 'relative' }}>
                <Award size={15} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  style={{
                    width: '100%', height: 44, borderRadius: 11,
                    border: `1px solid ${C.border}`, background: C.surfaceHover,
                    color: C.textPrimary, fontSize: 14, outline: 'none',
                    boxSizing: 'border-box', paddingLeft: 40, paddingRight: 14,
                    cursor: 'pointer'
                  }}
                >
                  <option value="Easy">Easy (Fundamentals & definitions)</option>
                  <option value="Medium">Medium (Application, scenarios, debugging)</option>
                  <option value="Hard">Hard (Deep systems optimization, complex cases)</option>
                </select>
              </div>
            </div>

            <button
              onClick={startInterview}
              style={{
                width: '100%', height: 48, borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 10, boxShadow: '0 0 30px rgba(79,70,229,0.3)',
              }}
            >
              Start AI Interview Session <Play size={15} fill="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {started && loading && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: 300, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, gap: 16
        }}>
          <div style={{
            width: 38, height: 38, border: '3px solid #4F46E5',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ fontSize: 14, color: C.textSecondary, fontWeight: 600 }}>
            Analyzing target criteria and generating AI recruiter questions...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Active Session Content */}
      {started && !loading && questions.length > 0 && (
        <>
          {/* Score Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: overallScore >= 70 ? C.success : overallScore > 0 ? C.warning : C.textMuted, lineHeight: 1 }}>
                {overallScore > 0 ? `${overallScore}%` : 'N/A'}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8, fontWeight: 600 }}>Overall AI Rating</div>
              <div style={{ fontSize: 11, color: overallScore >= 85 ? C.success : overallScore >= 70 ? C.secondary : C.textMuted, marginTop: 6, fontWeight: 700 }}>
                {getScoreRating(overallScore)}
              </div>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>Interview Progress</span>
                <span style={{ fontSize: 12, color: C.textMuted }}>{completed} of {totalQuestions} answered</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {questions.map((q, i) => (
                  <div key={q.id} style={{
                    flex: 1, height: 8, borderRadius: 4,
                    background: evaluations[q.id]
                      ? 'linear-gradient(90deg, #4F46E5, #06B6D4)'
                      : 'rgba(255,255,255,0.07)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 11, color: C.textMuted }}>
                <span>Role: <strong>{skill}</strong></span>
                <span>·</span>
                <span>Difficulty: <strong>{difficulty}</strong></span>
              </div>
            </div>
          </div>

          {/* Question Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {questions.map((q, idx) => {
              const isOpen = active === q.id
              const isGraded = !!evaluations[q.id]
              const evaluation = evaluations[q.id]
              const isSubmitting = gradingQuestionId === q.id

              return (
                <div key={q.id} style={{
                  background: C.surface, border: `1px solid ${isOpen ? C.primary + '50' : C.border}`,
                  borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.2s',
                }}>
                  {/* Card Header */}
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

                  {/* Expanded Answering/Feedback Pane */}
                  {isOpen && (
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                      
                      {/* Tips */}
                      <div style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: 14, padding: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, fontWeight: 700, color: C.primary }}>
                          <Lightbulb size={13} /> Evaluation Focus Tips
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {q.tips.map((t, i) => (
                            <div key={i} style={{ fontSize: 13, color: C.textSecondary, display: 'flex', gap: 8 }}>
                              <span style={{ color: C.primary, fontWeight: 700 }}>→</span> {t}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Not yet graded UI */}
                      {!isGraded ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <label style={{ fontSize: 13, fontWeight: 700, color: C.textSecondary }}>Your Answer</label>
                          <textarea
                            value={userAnswers[q.id] || ''}
                            onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder="Type or paste your response here. Aim to be thorough, structure your ideas clearly, and provide relevant examples."
                            style={{
                              width: '100%', minHeight: 120, borderRadius: 12,
                              border: `1px solid ${C.border}`, background: C.surfaceHover,
                              color: C.textPrimary, fontSize: 14, padding: 14, outline: 'none',
                              resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6,
                            }}
                            onFocus={e => (e.target.style.borderColor = C.primary)}
                            onBlur={e => (e.target.style.borderColor = C.border)}
                          />
                          <button
                            onClick={() => submitAnswer(q.id, q.question)}
                            disabled={isSubmitting || !userAnswers[q.id]?.trim()}
                            style={{
                              alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8,
                              background: isSubmitting || !userAnswers[q.id]?.trim() ? 'rgba(79,70,229,0.5)' : C.primary,
                              border: 'none', borderRadius: 10, color: '#fff', padding: '10px 18px',
                              fontSize: 13, fontWeight: 700, cursor: isSubmitting || !userAnswers[q.id]?.trim() ? 'not-allowed' : 'pointer',
                              boxShadow: '0 4px 14px rgba(79,70,229,0.2)'
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <div style={{
                                  width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                                  borderTopColor: '#fff', borderRadius: '50%',
                                  animation: 'spin 0.6s linear infinite'
                                }} />
                                Evaluating Answer...
                              </>
                            ) : (
                              <>Submit Answer to AI Recruiter <ChevronRight size={14} /></>
                            )}
                          </button>
                        </div>
                      ) : (
                        // Graded feedback UI
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {/* Candidate Answer Display */}
                          <div style={{ padding: 14, background: C.surfaceHover, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Your Submitted Response</div>
                            <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{userAnswers[q.id]}</p>
                          </div>

                          {/* Score widget */}
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: C.surfaceHover, borderRadius: 12, padding: '14px 18px',
                            border: `1px solid ${C.border}`,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <Star size={16} color={C.warning} fill={C.warning} />
                              <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>AI Recruiter Grade</span>
                            </div>
                            <span style={{ fontSize: 20, fontWeight: 900, color: evaluation.aiScore >= 80 ? C.success : evaluation.aiScore >= 60 ? C.warning : C.error }}>
                              {evaluation.aiScore}/100
                            </span>
                          </div>

                          {/* AI feedback text */}
                          <div style={{
                            fontSize: 13, color: C.textSecondary, lineHeight: 1.65,
                            background: 'rgba(6,182,212,0.04)', borderRadius: 12, padding: 16, border: `1px solid ${C.secondary}22`
                          }}>
                            <span style={{ fontWeight: 700, color: C.secondary }}>AI Feedback: </span>
                            {evaluation.aiFeedback}
                          </div>

                          {/* Sample answer toggle */}
                          <button onClick={() => toggleAnswer(q.id)}
                            style={{
                              alignSelf: 'flex-start', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 10,
                              color: C.secondary, fontSize: 13, fontWeight: 600, padding: '8px 14px',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = C.surfaceHover)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            {showAnswer[q.id] ? 'Hide Model Answer' : 'View Model Answer'} <ChevronRight size={14} />
                          </button>

                          {showAnswer[q.id] && (
                            <div style={{
                              background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)',
                              borderRadius: 12, padding: 16, fontSize: 13, color: C.textSecondary, lineHeight: 1.65,
                            }}>
                              <span style={{ fontWeight: 700, color: C.secondary }}>Model Response: </span>
                              {evaluation.sampleAnswer}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
