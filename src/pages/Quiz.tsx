import { useState } from 'react'
import { Award, Brain, Clock, ChevronRight, HelpCircle, Check, X, RotateCcw, Sparkles, BookOpen } from 'lucide-react'
import { aiApi, type AIQuizQuestion } from '../lib/api'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B',
  success: '#10B981', warning: '#F59E0B', error: '#EF4444',
}

interface LocalQuiz {
  id: string
  title: string
  category: string
  difficulty: string
  icon: string
  questions: AIQuizQuestion[]
}

const DEFAULT_QUIZZES: LocalQuiz[] = [
  {
    id: 'react-basics',
    title: 'React Fundamentals',
    category: 'Frontend',
    difficulty: 'Medium',
    icon: '⚛️',
    questions: [
      {
        id: 'r1',
        question: 'What is the primary purpose of React Router?',
        options: [
          'To manage global state across all components',
          'To navigate between different components as pages without full-page reloading',
          'To make HTTP API requests asynchronously',
          'To build responsive layout flex-grids dynamically'
        ],
        correctAnswer: 'B',
        explanation: 'React Router enables client-side routing, allowing single-page applications to navigate between views without full-page reloads.'
      },
      {
        id: 'r2',
        question: 'Which hook should be used to run side-effects in functional components?',
        options: ['useState', 'useContext', 'useEffect', 'useMemo'],
        correctAnswer: 'C',
        explanation: 'useEffect is specifically designed for side-effects, such as data fetching, subscriptions, or manual DOM manipulations.'
      },
      {
        id: 'r3',
        question: "What does 'lifting state up' mean in React?",
        options: [
          'Moving state to a global Redux store',
          'Storing state in localStorage',
          'Moving shared state to the closest common ancestor of the components that need it',
          'Increasing component render priority'
        ],
        correctAnswer: 'C',
        explanation: 'Lifting state up involves moving state to a common ancestor so multiple sibling components can share and stay in sync with the same data.'
      },
      {
        id: 'r4',
        question: "Why is a 'key' prop required when rendering a list of elements in React?",
        options: [
          'To uniquely identify elements and help React identify which items have changed, been added, or removed',
          'To style individual items in CSS',
          'To bind click handlers automatically',
          'To encrypt the rendering output'
        ],
        correctAnswer: 'A',
        explanation: 'Keys help React\'s virtual DOM reconciliation algorithm keep track of list items efficiently during updates.'
      },
      {
        id: 'r5',
        question: 'What is the virtual DOM in React?',
        options: [
          'A direct copy of the browser\'s window object',
          'A lightweight, in-memory representation of the real DOM that React uses to optimize rendering',
          'A database wrapper for indexing components',
          'A browser extension for debugging elements'
        ],
        correctAnswer: 'B',
        explanation: 'The virtual DOM is a programming concept where a virtual representation of a UI is kept in memory and synced with the real DOM via reconciliation.'
      }
    ]
  },
  {
    id: 'python-basics',
    title: 'Python Core Programming',
    category: 'Backend',
    difficulty: 'Easy',
    icon: '🐍',
    questions: [
      {
        id: 'p1',
        question: 'Which of the following data structures in Python is unordered and mutable?',
        options: ['Tuple', 'List', 'Set', 'String'],
        correctAnswer: 'C',
        explanation: 'Sets are unordered collections of unique elements that are mutable (you can add/remove items).'
      },
      {
        id: 'p2',
        question: 'What is the output of print(type([1, 2])) in Python?',
        options: ["<class 'tuple'>", "<class 'list'>", "<class 'set'>", "<class 'array'>"],
        correctAnswer: 'B',
        explanation: 'Square brackets define a list object in Python.'
      },
      {
        id: 'p3',
        question: 'How do you start a comments section or add a single line comment in Python?',
        options: ['//', '/*', '#', '--'],
        correctAnswer: 'C',
        explanation: 'The hash character (#) is used to begin single line comments in Python.'
      },
      {
        id: 'p4',
        question: "What is the difference between 'is' and '==' in Python?",
        options: [
          'There is no difference between them',
          "'is' checks for object identity (same memory address), while '==' checks for equality (same values)",
          "'is' is used for numbers, '==' is used for strings",
          "'is' checks values, '==' checks memory addresses"
        ],
        correctAnswer: 'B',
        explanation: "'is' checks if both variables refer to the exact same object in memory, while '==' compares their values."
      },
      {
        id: 'p5',
        question: 'What is a generator in Python?',
        options: [
          'A tool to compile Python code into machine language',
          'A class used to build database models',
          'A function that returns an iterator using the \'yield\' keyword to produce values lazily',
          'A package manager like pip'
        ],
        correctAnswer: 'C',
        explanation: 'Generators are functions that generate values one at a time using \'yield\', yielding high memory efficiency for large datasets.'
      }
    ]
  },
  {
    id: 'typescript-basics',
    title: 'TypeScript Essentials',
    category: 'Languages',
    difficulty: 'Medium',
    icon: '📘',
    questions: [
      {
        id: 't1',
        question: 'What does the "unknown" type represent in TypeScript?',
        options: [
          'A type that can accept any value and allows executing any method on it without checking',
          'A type-safe counterpart to "any" that requires narrowing or type checking before performing operations',
          'A variable that has not been defined yet',
          'An internal compiler type that represents errors'
        ],
        correctAnswer: 'B',
        explanation: '"unknown" represents any value but is type-safe because you cannot perform operations on it without casting or narrowing.'
      },
      {
        id: 't2',
        question: 'How do you define a read-only property in a TypeScript interface?',
        options: [
          'property: readonly type',
          'readonly property: type',
          'property: read type',
          'const property: type'
        ],
        correctAnswer: 'B',
        explanation: 'Using the "readonly" prefix before the property name in an interface definition makes it immutable.'
      },
      {
        id: 't3',
        question: 'What is a TypeScript "Union Type"?',
        options: [
          'A type that combines values of two databases',
          'A variable that can hold values of multiple specified types (e.g. string | number)',
          'A special function for joining strings together',
          'A structure for binding event listeners'
        ],
        correctAnswer: 'B',
        explanation: 'Union types allow a variable to be one of several specified types, separated by a vertical pipe (|).'
      },
      {
        id: 't4',
        question: 'What is the output of compiling TypeScript code?',
        options: [
          'Native binary machine executable files',
          'Standard browser-compatible JavaScript code',
          'WebAssembly modules',
          'Compressed JSON structures'
        ],
        correctAnswer: 'B',
        explanation: 'The TypeScript compiler (tsc) transpiles TypeScript into plain JavaScript that can run in any browser or Node.js environment.'
      },
      {
        id: 't5',
        question: 'What is the utility type "Partial<T>" used for?',
        options: [
          'To create a type containing only half the fields of T',
          'To make all properties in type T optional',
          'To make all properties in type T read-only',
          'To remove properties from type T'
        ],
        correctAnswer: 'B',
        explanation: 'Partial<T> construct a type with all properties of T set to optional, which is useful for updates or patches.'
      }
    ]
  },
  {
    id: 'css-layouts',
    title: 'CSS Grid & Flexbox Layouts',
    category: 'Design',
    difficulty: 'Easy',
    icon: '🎨',
    questions: [
      {
        id: 'c1',
        question: 'Which property is used in CSS Flexbox to align items along the main axis?',
        options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
        correctAnswer: 'B',
        explanation: 'justify-content aligns flex items along the main axis (horizontal by default), while align-items aligns them along the cross axis.'
      },
      {
        id: 'c2',
        question: 'What is the difference between display: grid and display: inline-grid?',
        options: [
          'grid layout has rows, inline-grid has only columns',
          'grid displays as a block-level container, inline-grid displays as an inline-level container',
          'grid is for flexbox, inline-grid is for positioning',
          'There is no functional difference'
        ],
        correctAnswer: 'B',
        explanation: 'display: grid creates a block-level grid container, occupying the full width of the parent, while inline-grid is inline and only occupies its content width.'
      },
      {
        id: 'c3',
        question: 'Which property is used in CSS Grid to specify the sizes of columns?',
        options: ['grid-template-columns', 'grid-column-gap', 'grid-auto-flow', 'grid-columns'],
        correctAnswer: 'A',
        explanation: 'grid-template-columns defines the columns template with size specifications (e.g., px, %, fr units).'
      },
      {
        id: 'c4',
        question: 'In CSS Flexbox, what does flex-shrink: 0 do?',
        options: [
          'Prevents the flex item from shrinking when parent space is tight',
          'Forces the item to take up all remaining space',
          'Hides the element if the screen width is small',
          'Resets the size of the element'
        ],
        correctAnswer: 'A',
        explanation: 'flex-shrink: 0 guarantees that the item remains at its flex-basis or defined width and will not contract to accommodate parent sizing.'
      },
      {
        id: 'c5',
        question: 'What does the CSS calc() function do?',
        options: [
          'Runs numerical loops in CSS styles',
          'Allows performing basic mathematical calculations directly in CSS property values (e.g., width: calc(100% - 20px))',
          'Analyzes browser window size',
          'Calculates animation speeds'
        ],
        correctAnswer: 'B',
        explanation: 'The calc() function lets you specify dynamic mathematical expressions as CSS property values, facilitating complex responsive alignments.'
      }
    ]
  }
]

export default function Quiz() {
  const [activeTab, setActiveTab] = useState<'default' | 'custom'>('default')

  // Setup custom AI Quiz state
  const [customSkill, setCustomSkill] = useState('')
  const [customDifficulty, setCustomDifficulty] = useState('Medium')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  // Playing state
  const [playingQuiz, setPlayingQuiz] = useState<AIQuizQuestion[] | null>(null)
  const [quizTitle, setQuizTitle] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [finished, setFinished] = useState(false)

  const startDefaultQuiz = (quiz: LocalQuiz) => {
    setPlayingQuiz(quiz.questions)
    setQuizTitle(quiz.title)
    setCurrentIdx(0)
    setSelectedOpt(null)
    setAnswered(false)
    setScore(0)
    setUserAnswers({})
    setFinished(false)
  }

  const generateAIQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customSkill.trim()) return

    setError('')
    setGenerating(true)
    try {
      const res = await aiApi.generateQuiz(customSkill.trim(), customDifficulty)
      if (res.data?.questions && res.data.questions.length > 0) {
        setPlayingQuiz(res.data.questions)
        setQuizTitle(`AI Quiz: ${customSkill.trim()}`)
        setCurrentIdx(0)
        setSelectedOpt(null)
        setAnswered(false)
        setScore(0)
        setUserAnswers({})
        setFinished(false)
      } else {
        throw new Error('AI failed to output questions.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz. Please verify backend configurations.')
    } finally {
      setGenerating(false)
    }
  }

  const selectOption = (opt: string) => {
    if (answered) return
    setSelectedOpt(opt)
  }

  const submitQuestionAnswer = () => {
    if (selectedOpt === null || !playingQuiz) return
    const correctOpt = playingQuiz[currentIdx].correctAnswer

    setUserAnswers(prev => ({ ...prev, [currentIdx]: selectedOpt }))
    setAnswered(true)

    if (selectedOpt.toUpperCase() === correctOpt.toUpperCase()) {
      setScore(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (!playingQuiz) return
    if (currentIdx + 1 < playingQuiz.length) {
      setCurrentIdx(prev => prev + 1)
      setSelectedOpt(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  const resetQuiz = () => {
    setPlayingQuiz(null)
    setQuizTitle('')
    setCurrentIdx(0)
    setSelectedOpt(null)
    setAnswered(false)
    setScore(0)
    setUserAnswers({})
    setFinished(false)
  }

  const getOptionLetter = (idx: number) => {
    return ['A', 'B', 'C', 'D'][idx]
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Skills Assessment Quiz
          </h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            Test your knowledge with pre-seeded programming assessments or generate custom quizzes with AI.
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12, padding: '12px 16px',
          color: C.error, fontSize: 13,
        }}>
          <HelpCircle size={16} /> {error}
        </div>
      )}

      {/* Main Quizzes Dash */}
      {!playingQuiz && (
        <>
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, borderBottom: `1px solid ${C.border}`, paddingBottom: 1 }}>
            <button
              onClick={() => setActiveTab('default')}
              style={{
                background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === 'default' ? C.secondary : 'transparent'}`,
                color: activeTab === 'default' ? C.textPrimary : C.textSecondary,
                padding: '8px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Default Assessments
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              style={{
                background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === 'custom' ? C.secondary : 'transparent'}`,
                color: activeTab === 'custom' ? C.textPrimary : C.textSecondary,
                padding: '8px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Generate AI Custom Quiz
            </button>
          </div>

          {/* TAB 1: Default Quizzes Grid */}
          {activeTab === 'default' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {DEFAULT_QUIZZES.map(quiz => (
                <div key={quiz.id} style={{
                  background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
                  padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 30 }}>{quiz.icon}</span>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0 }}>{quiz.title}</h3>
                        <span style={{ fontSize: 12, color: C.textMuted }}>{quiz.category} · {quiz.questions.length} Questions</span>
                      </div>
                    </div>
                    <span style={{
                      background: quiz.difficulty === 'Easy' ? C.success + '20' : C.warning + '20',
                      color: quiz.difficulty === 'Easy' ? C.success : C.warning,
                      border: `1px solid ${quiz.difficulty === 'Easy' ? C.success : C.warning}30`,
                      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700,
                    }}>{quiz.difficulty}</span>
                  </div>
                  <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
                    Assess your core comprehension of standard programming patterns and library features.
                  </p>
                  <button
                    onClick={() => startDefaultQuiz(quiz)}
                    style={{
                      width: '100%', height: 40, borderRadius: 10, border: 'none',
                      background: C.surfaceHover, color: C.secondary, fontSize: 13,
                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 6, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.secondary + '20'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.surfaceHover; e.currentTarget.style.color = C.secondary }}
                  >
                    Start Quiz <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Custom AI Generator Form */}
          {activeTab === 'custom' && (
            <div style={{
              background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)',
              border: `1px solid ${C.border}`, borderRadius: 24, padding: '36px 32px',
              maxWidth: 600, width: '100%', boxSizing: 'border-box'
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color={C.secondary} /> Generate AI Skill Quiz
              </h2>
              {generating ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '40px 0' }}>
                  <div style={{
                    width: 32, height: 32, border: '3px solid #06B6D4',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <p style={{ fontSize: 13, color: C.textSecondary, fontWeight: 600 }}>Synthesizing MCQ questions and explanations...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              ) : (
                <form onSubmit={generateAIQuiz} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>Target Skill</label>
                    <div style={{ position: 'relative' }}>
                      <BookOpen size={15} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        value={customSkill}
                        onChange={e => setCustomSkill(e.target.value)}
                        placeholder="e.g. Docker, GraphQL, Kubernetes, Rust"
                        required
                        style={{
                          width: '100%', height: 44, borderRadius: 11,
                          border: `1px solid ${C.border}`, background: C.surfaceHover,
                          color: C.textPrimary, fontSize: 14, outline: 'none',
                          boxSizing: 'border-box', paddingLeft: 40, paddingRight: 14,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>Difficulty</label>
                    <div style={{ position: 'relative' }}>
                      <Award size={15} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <select
                        value={customDifficulty}
                        onChange={e => setCustomDifficulty(e.target.value)}
                        style={{
                          width: '100%', height: 44, borderRadius: 11,
                          border: `1px solid ${C.border}`, background: C.surfaceHover,
                          color: C.textPrimary, fontSize: 14, outline: 'none',
                          boxSizing: 'border-box', paddingLeft: 40, paddingRight: 14,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%', height: 48, borderRadius: 12, border: 'none',
                      background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                      color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      marginTop: 10, boxShadow: '0 0 30px rgba(79,70,229,0.3)',
                    }}
                  >
                    Generate AI Quiz <Sparkles size={14} fill="#fff" />
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}

      {/* Playing state */}
      {playingQuiz && !finished && (
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: '32px 28px',
          maxWidth: 700, width: '100%', boxSizing: 'border-box', alignSelf: 'center', margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 16, marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary, margin: 0 }}>{quizTitle}</h2>
              <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4, display: 'block' }}>Question {currentIdx + 1} of {playingQuiz.length}</span>
            </div>
            <button onClick={resetQuiz} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Quit</button>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 28 }}>
            <div style={{ height: '100%', width: `${((currentIdx) / playingQuiz.length) * 100}%`, background: 'linear-gradient(90deg, #4F46E5, #06B6D4)', transition: 'width 0.3s' }} />
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, lineHeight: 1.5, margin: 0 }}>
              {playingQuiz[currentIdx].question}
            </h3>
          </div>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {playingQuiz[currentIdx].options.map((opt, i) => {
              const letter = getOptionLetter(i)
              const isSelected = selectedOpt === letter
              const isCorrect = letter.toUpperCase() === playingQuiz[currentIdx].correctAnswer.toUpperCase()

              let itemBg = C.surfaceHover
              let itemBorder = C.border
              let letterBg = 'rgba(255,255,255,0.06)'
              let letterColor = C.textSecondary

              if (answered) {
                if (isCorrect) {
                  // highlight correct green
                  itemBg = 'rgba(16,185,129,0.1)'
                  itemBorder = 'rgba(16,185,129,0.4)'
                  letterBg = C.success
                  letterColor = '#fff'
                } else if (isSelected) {
                  // highlight wrong red
                  itemBg = 'rgba(239,68,68,0.1)'
                  itemBorder = 'rgba(239,68,68,0.4)'
                  letterBg = C.error
                  letterColor = '#fff'
                }
              } else if (isSelected) {
                itemBg = `${C.secondary}12`
                itemBorder = `${C.secondary}60`
                letterBg = C.secondary
                letterColor = '#fff'
              }

              return (
                <div
                  key={i}
                  onClick={() => selectOption(letter)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                    borderRadius: 14, border: `1px solid ${itemBorder}`, background: itemBg,
                    cursor: answered ? 'default' : 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!answered && !isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
                  onMouseLeave={e => { if (!answered && !isSelected) e.currentTarget.style.borderColor = C.border }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: letterBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: letterColor, flexShrink: 0
                  }}>
                    {letter}
                  </div>
                  <span style={{ fontSize: 14, color: C.textPrimary, fontWeight: 500, lineHeight: 1.4 }}>{opt}</span>
                </div>
              )
            })}
          </div>

          {/* Explanation pane (reveals on answered) */}
          {answered && (
            <div style={{
              background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)',
              borderRadius: 14, padding: 18, marginBottom: 24, fontSize: 13, color: C.textSecondary, lineHeight: 1.6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.secondary, fontWeight: 700, marginBottom: 6 }}>
                <Brain size={14} /> Concept Explanation
              </div>
              {playingQuiz[currentIdx].explanation}
            </div>
          )}

          {/* Control Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!answered ? (
              <button
                onClick={submitQuestionAnswer}
                disabled={selectedOpt === null}
                style={{
                  height: 42, padding: '0 24px', borderRadius: 10, border: 'none',
                  background: selectedOpt === null ? 'rgba(6,182,212,0.4)' : C.secondary,
                  color: '#fff', fontSize: 13, fontWeight: 700, cursor: selectedOpt === null ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                Submit Answer <Check size={14} />
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                style={{
                  height: 42, padding: '0 24px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                  color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {currentIdx + 1 === playingQuiz.length ? 'Show Results' : 'Next Question'} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Summary Results Screen */}
      {playingQuiz && finished && (
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: '36px 32px',
          maxWidth: 600, width: '100%', boxSizing: 'border-box', alignSelf: 'center', margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            border: '2px solid rgba(16,185,129,0.3)'
          }}>
            <Award size={36} color={C.success} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, marginBottom: 6 }}>Quiz Completed!</h2>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24 }}>Here is your score for: <strong>{quizTitle}</strong></p>

          <div style={{
            background: C.surfaceHover, border: `1px solid ${C.border}`, borderRadius: 18,
            padding: '24px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
            marginBottom: 28, maxWidth: 400, margin: '0 auto 28px'
          }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.secondary }}>{score} / {playingQuiz.length}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Correct Answers</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.success }}>{Math.round((score / playingQuiz.length) * 100)}%</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Success Rate</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={resetQuiz}
              style={{
                height: 44, padding: '0 20px', borderRadius: 11, border: `1px solid ${C.border}`,
                background: C.surfaceHover, color: C.textPrimary, fontSize: 13,
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <RotateCcw size={14} /> Back to Quizzes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
