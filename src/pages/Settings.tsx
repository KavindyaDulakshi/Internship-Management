import { useState } from 'react'
import { User, Bell, Shield, Palette, Moon, Sun, Globe, AlertCircle, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

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
  const { user } = useAuth()

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.fullName || '')
  const [email] = useState(user?.email || '')
  const [university, setUniversity] = useState(user?.user_metadata?.university || '')
  const [degree, setDegree] = useState(user?.user_metadata?.degree || '')
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [notifs, setNotifs] = useState({ email: true, matches: true, reminders: false, newsletter: false })
  const [privacy, setPrivacy] = useState({ publicProfile: true, showEmail: false, analytics: true })

  const inputStyle = {
    height: 40, borderRadius: 10, border: `1px solid ${C.border}`,
    background: C.surfaceHover, color: C.textPrimary, fontSize: 13,
    padding: '0 12px', outline: 'none', width: 240, boxSizing: 'border-box' as const,
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          university,
          degree,
        }
      })
      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess('Profile updated successfully!')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 760 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 6, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Manage your account preferences and platform settings.</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12, padding: '12px 16px',
          color: '#EF4444', fontSize: 13,
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 12, padding: '12px 16px',
          color: '#10B981', fontSize: 13,
        }}>
          <Check size={16} /> {success}
        </div>
      )}

      {/* Account Settings */}
      <Section title="Account Information" icon={User}>
        <form onSubmit={handleSave}>
          <SettingRow label="Full Name" desc="Your display name across InternHub">
            <input value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
          </SettingRow>
          <SettingRow label="Email Address" desc="Used for login (read-only)">
            <input value={email} readOnly disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
          </SettingRow>
          <SettingRow label="University" desc="Your current academic institution">
            <input value={university} onChange={e => setUniversity(e.target.value)} style={inputStyle} />
          </SettingRow>
          <SettingRow label="Degree Program">
            <input value={degree} onChange={e => setDegree(e.target.value)} style={inputStyle} />
          </SettingRow>
          <div style={{ padding: '16px 24px' }}>
            <button 
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(79,70,229,0.5)' : 'linear-gradient(135deg, #4F46E5, #06B6D4)', border: 'none',
                borderRadius: 10, color: '#fff', padding: '10px 22px', fontSize: 13,
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
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
