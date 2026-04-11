import { useState } from 'react'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  ArrowRight,
  Globe,
} from 'lucide-react'
import './Login.css'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      return
    }
    setIsLoading(true)
    // TODO: integrate Firebase auth — signInWithEmailAndPassword
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleGoogleSignIn = () => {
    // TODO: integrate Firebase auth — signInWithPopup(GoogleAuthProvider)
  }

  return (
    <div className="login-root">
      {/* ── Left panel ── */}
      <div className="login-brand">
        <div className="brand-content">
          <div className="brand-logo">
            <GraduationCap size={40} strokeWidth={1.5} />
          </div>
          <h1 className="brand-title">Connect Karo</h1>
          <p className="brand-subtitle">
            Your alumni network, reimagined.
          </p>

          <ul className="brand-features">
            <li>
              <Users size={18} />
              <span>Reconnect with batchmates &amp; seniors</span>
            </li>
            <li>
              <GraduationCap size={18} />
              <span>Mentorship, jobs &amp; referrals</span>
            </li>
            <li>
              <ArrowRight size={18} />
              <span>Events, news &amp; campus updates</span>
            </li>
          </ul>
        </div>

        {/* decorative blobs */}
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />
      </div>

      {/* ── Right panel ── */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your alumni account</p>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
                <a href="#" className="forgot-link">Forgot password?</a>
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn-primary${isLoading ? ' loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleSignIn}
          >
            <Globe size={20} />
            Sign in with Google
          </button>

          <p className="signup-prompt">
            Don&apos;t have an account?{' '}
            <a href="#">Create one &rarr;</a>
          </p>
        </div>
      </div>
    </div>
  )
}
