import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../services/auth'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) navigate('/admin', { replace: true })
  }, [user, loading, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) return toast.error('Please enter your credentials')
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Invalid email or password'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : 'Login failed. Check your credentials.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ember-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-ember-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-800 text-xl">V</span>
          </div>
          <h1 className="font-display font-800 text-2xl text-ink-50 mb-1">Admin Access</h1>
          <p className="text-sm text-ink-400 font-body">Innovation Center · VolunteerHub</p>
          <p className="text-sm text-ink-400 font-body">Mail və parol prototip üçün aşağıda qeyd olunub.</p>
          <p className="text-sm text-white font-body">mail: leylatalibova44@gmail.com</p>
          <p className="text-sm text-white font-body">parol: 123123123</p>
        </div>

        {/* Form card */}
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-display font-600 text-ink-400 uppercase tracking-widest mb-1.5">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@university.edu"
                className="w-full px-4 py-2.5 bg-ink-700 border border-ink-600 rounded-lg text-ink-100 text-sm placeholder:text-ink-500 font-body transition-all focus:outline-none focus:ring-2 focus:ring-ember-500/30 focus:border-ember-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-display font-600 text-ink-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-ink-700 border border-ink-600 rounded-lg text-ink-100 text-sm placeholder:text-ink-500 font-body transition-all focus:outline-none focus:ring-2 focus:ring-ember-500/30 focus:border-ember-500/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ember-500 hover:bg-ember-600 text-white font-display font-700 text-sm py-2.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ember-500/20 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-ink-500 hover:text-ink-300 font-body transition-colors">
            ← Back to public site
          </Link>
        </div>
      </div>
    </div>
  )
}
