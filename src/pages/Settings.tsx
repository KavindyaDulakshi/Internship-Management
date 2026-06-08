import { useState } from 'react'
import { User, Bell, Shield, Palette, Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const C = {
  surface: '#0F172A', surfaceHover: '#1E293B', border: 'rgba(255,255,255,0.08)',
  primary: '#4F46E5', secondary: '#06B6D4', textPrimary: '#ffffff',
  textSecondary: '#94A3B8', textMuted: '#64748B', success: '#10B981',
}

function Toggle({ on, onChange }: { on: boolean, onChange: () => void }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: on ? `linear-gradient(135deg, ${C.primary}, ${C.secondary})` : 'rgba(255,255,255,0.1)',
      position: 'relative', transition: 'background 0.3s', flexShrink: 0,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.3s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

function Section({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon size={16} color={C.secondary} />
        <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{title}</span>
      </div>
      <div style={{ padding: '8px 0' }}>{children}</div>
    </div>
  )
}

function SettingRow({ label, desc, children }: { label: string, desc?: string, children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: '14px 24px', borderBottom: `1px solid ${C.border}`,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [notifs, setNotifs] = useState({ email: true, matches: true, reminders: false, newsletter: false })
  const [privacy, setPrivacy] = useState({ publicProfile: true, showEmail: false, analytics: true })

  const inputStyle = {
    height: 40, borderRadius: 10, border: `1px solid ${C.border}`,
    background: C.surfaceHover, color: C.textPrimary, fontSize: 13,
    padding: '0 12px', outline: 'none', width: 240, boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 760 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Manage your account preferences and platform settings.</p>
      </div>

      {/* Account Settings */}
      <Section title="Account Information" icon={User}>
        <SettingRow label="Full Name" desc="Your display name across InternHub">
          <input defaultValue="Alex Johnson" style={inputStyle} />
        </SettingRow>
        <SettingRow label="Email Address" desc="Used for login and notifications">
          <input defaultValue="alex.johnson@university.edu" type="email" style={inputStyle} />
        </SettingRow>
        <SettingRow label="University" desc="Your current academic institution">
          <input defaultValue="Stanford University" style={inputStyle} />
        </SettingRow>
        <SettingRow label="Degree Program">
          <input defaultValue="B.Sc. Computer Science" style={inputStyle} />
        </SettingRow>
        <div style={{ padding: '16px 24px' }}>
          <button style={{
            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', border: 'none',
            borderRadius: 10, color: '#fff', padding: '10px 22px', fontSize: 13,
            fontWeight: 700, cursor: 'pointer',
          }}>
            Save Changes
          </button>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette}>
        <SettingRow label="Theme" desc="Switch between dark and light mode">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Moon size={15} color={C.textMuted} />
            <Toggle on={theme === 'dark'} onChange={toggleTheme} />
            <Sun size={15} color={C.textMuted} />
          </div>
        </SettingRow>
        <SettingRow label="Language" desc="Interface display language">
          <select style={{ ...inputStyle, width: 160 }}>
            <option>English (US)</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </SettingRow>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        {[
          { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
          { key: 'matches', label: 'New Internship Matches', desc: 'Get notified about AI-matched listings' },
          { key: 'reminders', label: 'Weekly Roadmap Reminders', desc: 'Stay on track with your career goals' },
          { key: 'newsletter', label: 'Newsletter', desc: 'Career tips and platform updates' },
        ].map(({ key, label, desc }) => (
          <SettingRow key={key} label={label} desc={desc}>
            <Toggle on={notifs[key as keyof typeof notifs]} onChange={() => setNotifs(p => ({ ...p, [key]: !p[key as keyof typeof notifs] }))} />
          </SettingRow>
        ))}
      </Section>

      {/* Privacy */}
      <Section title="Privacy & Security" icon={Shield}>
        {[
          { key: 'publicProfile', label: 'Public Profile', desc: 'Allow companies to discover your profile' },
          { key: 'showEmail', label: 'Show Email to Recruiters', desc: 'Display your email on your public profile' },
          { key: 'analytics', label: 'Usage Analytics', desc: 'Help improve InternHub with anonymous usage data' },
        ].map(({ key, label, desc }) => (
          <SettingRow key={key} label={label} desc={desc}>
            <Toggle on={privacy[key as keyof typeof privacy]} onChange={() => setPrivacy(p => ({ ...p, [key]: !p[key as keyof typeof privacy] }))} />
          </SettingRow>
        ))}
        <SettingRow label="Change Password" desc="Update your account password">
          <button style={{
            background: 'transparent', border: `1px solid ${C.border}`,
            borderRadius: 10, color: C.textSecondary, padding: '8px 16px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            Change Password
          </button>
        </SettingRow>
      </Section>

      {/* Danger Zone */}
      <div style={{
        background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 20, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>Delete Account</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>Permanently delete your account and all associated data. This action cannot be undone.</div>
        </div>
        <button style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10, color: '#EF4444', padding: '9px 18px', fontSize: 13,
          fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
