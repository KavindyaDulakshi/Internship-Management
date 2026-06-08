import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Globe } from 'lucide-react'

const C = {
  bg: '#020617', surface: '#0F172A', surfaceHover: '#1E293B',
  border: 'rgba(255,255,255,0.08)', primary: '#4F46E5', secondary: '#06B6D4',
  textPrimary: '#ffffff', textSecondary: '#94A3B8', textMuted: '#64748B',
  error: '#EF4444',
}

function Field({ label, id, type = 'text', placeholder, icon: Icon, value, onChange, error }: {
  label: string, id: string, type?: string, placeholder: string,
  icon: any, value: string, onChange: (v: string) => void, error?: string
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={16} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          id={id}
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', height: 46, borderRadius: 12,
            border: `1px solid ${error ? C.error : C.border}`,
            background: C.surfaceHover, color: C.textPrimary,
            fontSize: 14, outline: 'none', boxSizing: 'border-box',
            paddingLeft: 42, paddingRight: isPassword ? 46 : 14,
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = C.primary)}
          onBlur={e => (e.target.style.borderColor = error ? C.error : C.border)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 4,
            }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: 12, color: C.error }}>{error}</span>}
    </div>
  )
}

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
          padding: '5px 14px', fontSize: 12, fontWeight: 600, color: C.secondary,
          marginBottom: 20,
        }}>
          <Sparkles size={12} /> Welcome back
        </span>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary, lineHeight: 1.2, marginBottom: 10, letterSpacing: '-0.02em' }}>
          Sign in to your account
        </h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>
          Continue your internship journey with InternHub AI
        </p>
      </div>

      {/* Glass Card */}
      <div style={{
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)',
        border: `1px solid ${C.border}`, borderRadius: 24, padding: '36px 32px',
      }}>
        {/* Google Button */}
        <button
          type="button"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
            borderRadius: 12, height: 46, fontSize: 14, fontWeight: 600,
            color: C.textPrimary, cursor: 'pointer', marginBottom: 24, transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          <Globe size={18} color="#4285F4" />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Form */}
        <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={e => { e.preventDefault(); window.location.href = '/dashboard' }}>
          <Field label="Email address" id="email" type="email" placeholder="alex@university.edu" icon={Mail} value={email} onChange={setEmail} />
          <Field label="Password" id="password" type="password" placeholder="Enter your password" icon={Lock} value={password} onChange={setPassword} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: C.textSecondary }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: C.primary, cursor: 'pointer' }}
              />
              Remember me
            </label>
            <a href="#" style={{ fontSize: 13, color: C.secondary, textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            style={{
              width: '100%', height: 48, borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 4, transition: 'opacity 0.2s',
              boxShadow: '0 0 30px rgba(79,70,229,0.35)',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Sign In <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: C.textSecondary }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: C.secondary, fontWeight: 600, textDecoration: 'none' }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
