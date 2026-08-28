import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/auth'
import { Field } from '../components/WizardShell'
import { Input, Callout } from '../components/ui'
import { BoltIcon } from '../components/icons'
import { OpenHouseLogoMark } from '../components/WorkspaceShell'
import imgPointCloudDoorway from '../assets/openhouse-pointcloud-doorway.png'

export function AuthScreen() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDemoSignIn = async () => {
    setLoading(true)
    setError(null)
    const res = await signIn('david@openhouse.com', 'demo1234')
    setLoading(false)
    if (res.user) {
      navigate('/properties')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.')
      return
    }

    setLoading(true)

    if (mode === 'signin') {
      const res = await signIn(email, password)
      setLoading(false)
      if (res.error) {
        setError(res.error)
      } else {
        navigate('/properties')
      }
    } else {
      if (!fullName.trim()) {
        setError('Please enter your full name.')
        setLoading(false)
        return
      }

      const res = await signUp(email, password, fullName, agencyName)
      setLoading(false)
      if (res.error) {
        setError(res.error)
      } else {
        navigate('/setup')
      }
    }
  }

  return (
    <div className="min-h-screen bg-canvas antialiased font-sans text-ink selection:bg-primary/20">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL: Realtor Auth Form (Warm Limestone Background) */}
        {/* ========================================================================= */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-canvas">
          
          {/* Header */}
          <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 text-[20px] font-extrabold tracking-tight text-ink">
              <OpenHouseLogoMark className="h-7 w-7 object-contain" />
              <span>OpenHouse</span>
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-ink-2 hover:text-ink transition-colors"
            >
              ← Back to home
            </Link>
          </header>

          {/* Form Container */}
          <div className="mx-auto w-full max-w-[520px] py-8 my-auto">
            
            {/* Title Section */}
            <div className="pb-6">
              <h1 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-ink leading-tight">
                {mode === 'signin' ? 'Sign in to OpenHouse' : 'Create realtor workspace'}
              </h1>
              <p className="pt-2 text-[15px] text-ink-2 leading-relaxed">
                {mode === 'signin'
                  ? 'Access your properties, 3D spatial captures, and publication controls.'
                  : 'Connect your listings and let OpenHouse automate interactive 3D tours.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-surface p-1 border border-border shadow-subtle mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                }}
                className={`flex-1 py-2 text-[14px] font-semibold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-primary text-text-inverse shadow-subtle'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setError(null)
                }}
                className={`flex-1 py-2 text-[14px] font-semibold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-primary text-text-inverse shadow-subtle'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Login Option */}
            {mode === 'signin' && (
              <div className="pb-6">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-6 py-3 text-[14px] font-semibold text-primary shadow-subtle hover:bg-raised-2 transition-all disabled:opacity-50"
                >
                  <BoltIcon size={16} className="text-primary" />
                  <span>Quick Demo Login (David Olabowale)</span>
                </button>
                
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-3 text-[11.5px] font-semibold text-ink-3 uppercase tracking-wider">
                    or sign in with email
                  </span>
                  <div className="flex-grow border-t border-border"></div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Callout className="bg-accent/10 border-accent/30 text-accent">
                  <p className="text-xs font-medium text-accent">{error}</p>
                </Callout>
              )}

              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <Input
                      placeholder="David Olabowale"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Agency / Brokerage (Optional)">
                    <Input
                      placeholder="Lekki Luxury Realty"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                    />
                  </Field>
                </div>
              )}

              <Field label="Email Address">
                <Input
                  type="email"
                  placeholder="you@brokerage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field label="Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {mode === 'signin' && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => alert('Password reset instructions sent to your email.')}
                      className="text-[13px] font-medium text-ink-2 hover:text-ink hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </Field>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-8 text-[15px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Authenticating…' : mode === 'signin' ? 'Sign in to Console' : 'Create Account & Continue'}
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M11 4.5L16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Terms Footer */}
            <p className="pt-6 text-center text-[12px] text-ink-3">
              By continuing, you agree to OpenHouse’s{' '}
              <span className="text-ink-2 hover:text-ink cursor-pointer underline">Terms of Service</span> and{' '}
              <span className="text-ink-2 hover:text-ink cursor-pointer underline">Privacy Policy</span>.
            </p>

          </div>

          {/* Footer */}
          <footer className="text-xs text-ink-3">
            © {new Date().getFullYear()} OpenHouse Technologies Inc.
          </footer>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: Pointcloud Matrix Doorway Artwork on Warm Canvas Background */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-canvas p-6 lg:p-12 border-l border-border/50">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imgPointCloudDoorway}
              alt="OpenHouse Spatial Pointcloud Doorway"
              className="max-h-[88vh] w-auto max-w-full object-contain select-none"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

