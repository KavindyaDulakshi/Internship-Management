import { mockRoadmapItems } from '../data/mockData'
import { CheckCircle, Circle, Clock, Target, ChevronRight } from 'lucide-react'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B',
  success: '#10B981', warning: '#F59E0B', error: '#EF4444',
}

const statusConfig = {
  completed: { color: C.success, bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', label: 'Completed', icon: CheckCircle },
  'in-progress': { color: C.primary, bg: 'rgba(79,70,229,0.12)', border: 'rgba(79,70,229,0.25)', label: 'In Progress', icon: Clock },
  planned: { color: C.textMuted, bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', label: 'Planned', icon: Circle },
}

export default function CareerRoadmap() {
  const completed = mockRoadmapItems.filter(i => i.status === 'completed').length
  const total = mockRoadmapItems.length
  const progress = Math.round((completed / total) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>Career Roadmap</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Track your milestones and stay on course toward landing your dream internship.</p>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.textPrimary }}>{progress}%</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Overall Progress</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Target size={15} color={C.secondary} /> Overall Journey Progress
          </span>
          <span style={{ fontSize: 12, color: C.textMuted }}>{completed} of {total} phases complete</span>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`, borderRadius: 5,
            background: 'linear-gradient(90deg, #4F46E5, #06B6D4)',
            transition: 'width 1s ease',
            boxShadow: '0 0 12px rgba(79,70,229,0.5)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = mockRoadmapItems.filter(i => i.status === key).length
            return (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: cfg.color }}>
                <cfg.icon size={12} /> {count} {cfg.label}
              </span>
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 23, top: 24, bottom: 24, width: 2,
          background: 'linear-gradient(to bottom, #4F46E5, #06B6D4, rgba(255,255,255,0.07))',
          zIndex: 0,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
          {mockRoadmapItems.map((item) => {
            const cfg = statusConfig[item.status]
            const Icon = cfg.icon
            const doneGoals = item.goals.filter(g => g.done).length
            return (
              <div key={item.id} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* Timeline Node */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: cfg.bg, border: `2px solid ${cfg.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: item.status === 'in-progress' ? `0 0 20px ${cfg.color}40` : 'none',
                }}>
                  <Icon size={20} color={cfg.color} fill={item.status === 'completed' ? cfg.color : 'none'} />
                </div>

                {/* Content Card */}
                <div style={{
                  flex: 1, background: C.surface, border: `1px solid ${item.status === 'in-progress' ? C.primary + '40' : C.border}`,
                  borderRadius: 20, padding: 24, transition: 'border-color 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.month}</div>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.01em' }}>{item.title}</h3>
                    </div>
                    <span style={{
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                      borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700,
                    }}>{cfg.label}</span>
                  </div>

                  <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65, marginBottom: 16 }}>{item.description}</p>

                  {/* Goals Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {item.goals.map((goal, gi) => (
                      <div key={gi} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                          background: goal.done ? C.success : 'transparent',
                          border: `2px solid ${goal.done ? C.success : C.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {goal.done && <ChevronRight size={11} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: 13, color: goal.done ? C.textPrimary : C.textMuted, textDecoration: goal.done ? 'none' : 'none', lineHeight: 1.5, opacity: goal.done ? 1 : 0.7 }}>
                          {goal.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Goal progress + Skill tags */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {item.skills.map(s => (
                        <span key={s} style={{
                          background: 'rgba(79,70,229,0.12)', color: '#818cf8',
                          border: '1px solid rgba(79,70,229,0.25)',
                          borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600,
                        }}>{s}</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: C.textMuted }}>
                      {doneGoals}/{item.goals.length} goals done
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
