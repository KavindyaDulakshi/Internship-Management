import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, BookOpen, ArrowRight, Sparkles, Globe, Check, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const C = {
  bg: '#020617', surface: '#0F172A', surfaceHover: '#1E293B',
  border: 'rgba(255,255,255,0.08)', primary: '#4F46E5', secondary: '#06B6D4',
  textPrimary: '#ffffff', textSecondary: '#94A3B8', textMuted: '#64748B',
  error: '#EF4444', success: '#10B981', warning: '#F59E0B',
}

function Field({ label, id, type = 'text', placeholder, icon: Icon, value, onChange }: {
  label: string, id: string, type?: string, placeholder: string,
  icon: any, value: string, onChange: (v: string) => void,
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          id={id} type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', height: 44, borderRadius: 11,
            border: `1px solid ${C.border}`, background: C.surfaceHover,
            color: C.textPrimary, fontSize: 14, outline: 'none',
            boxSizing: 'border-box', paddingLeft: 40, paddingRight: isPassword ? 44 : 14,
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = C.primary)}
          onBlur={e => (e.target.style.borderColor = C.border)}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 4 }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 4 : 3
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', C.error, C.warning, '#F59E0B', C.success]
  return strength > 0 ? (
    <div style={{ marginTop: -8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[strength], marginTop: 4, display: 'block', fontWeight: 600 }}>
        {labels[strength]}
      </span>
    </div>
  ) : null
}

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', university: '', degree: '', password: '', confirm: '' })
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) { setError('Full Name is required.'); return }
    if (!form.email.trim()) { setError('Email is required.'); return }
    if (!form.password) { setError('Password is required.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (!terms) { setError('You must agree to the Terms of Service and Privacy Policy.'); return }

    setLoading(true)
    const { error: signUpError } = await signUp(form.email, form.password, {
      full_name: form.name,
      university: form.university,
      degree: form.degree,
    })
    setLoading(false)

    if (signUpError) {
      setError(signUpError)
    } else {
      setSuccess('Account created successfully! Please check your email for a confirmation link or sign in.')
      // If auto-confirm is enabled in Supabase, the AuthContext session state listener
      // will trigger RedirectIfAuth and navigate to /dashboard automatically.
    }
  }

  const handleGoogle = async () => {
    setError('')
    setSuccess('')
    const { error: authError } = await signInWithGoogle()
    if (authError) setError(authError)
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
          padding: '5px 14px', fontSize: 12, fontWeight: 600, color: C.secondary, marginBottom: 16,
        }}>
          <Sparkles size={12} /> Join InternHub for Free
        </span>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Start your AI-powered career journey today</p>
      </div>

      <div style={{
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)',
        border: `1px solid ${C.border}`, borderRadius: 24, padding: '32px 28px',
      }}>
        {/* Error Banner */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            color: C.error, fontSize: 13,
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            color: C.success, fontSize: 13,
          }}>
            <Check size={16} /> {success}
          </div>
        )}

        <button type="button"
          onClick={handleGoogle}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
            borderRadius: 12, height: 44, fontSize: 14, fontWeight: 600,
            color: C.textPrimary, cursor: 'pointer', marginBottom: 20,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          <Globe size={17} color="#4285F4" /> Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 12, color: C.textMuted }}>or create with email</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Full Name" id="name" placeholder="Alex Johnson" icon={User} value={form.name} onChange={set('name')} />
            <Field label="Email" id="email" type="email" placeholder="alex@uni.edu" icon={Mail} value={form.email} onChange={set('email')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="University" id="uni" placeholder="Stanford University" icon={GraduationCap} value={form.university} onChange={set('university')} />
            <Field label="Degree Program" id="degree" placeholder="B.Sc. Computer Science" icon={BookOpen} value={form.degree} onChange={set('degree')} />
          </div>
          <Field label="Password" id="password" type="password" placeholder="Create a strong password" icon={Lock} value={form.password} onChange={set('password')} />
          <PasswordStrength password={form.password} />
          <Field label="Confirm Password" id="confirm" type="password" placeholder="Repeat your password" icon={Lock} value={form.confirm} onChange={set('confirm')} />

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 4 }}>
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={e => setTerms(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: C.primary,
                cursor: 'pointer',
                marginTop: 2,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.5 }}>
              I agree to the{' '}
              <a href="#" style={{ color: C.secondary, textDecoration: 'none', fontWeight: 600 }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: C.secondary, textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
            </span>
          </label>

          <button type="submit"
            disabled={loading}
            style={{
              width: '100%', height: 48, borderRadius: 12, border: 'none',
              background: loading ? 'rgba(79,70,229,0.5)' : 'linear-gradient(135deg, #4F46E5, #06B6D4)',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 4, boxShadow: '0 0 30px rgba(79,70,229,0.3)',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
                Creating Account…
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </>
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: C.textSecondary }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ color: C.secondary, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
