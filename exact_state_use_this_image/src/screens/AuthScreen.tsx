import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/auth'
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
    <div className="h-screen w-full bg-canvas font-sans text-ink selection:bg-primary/20 overflow-hidden">
      <div className="grid h-full lg:grid-cols-[1fr_1.1fr]">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL: Compact Realtor Auth Form (Perfect fit for 150% scaling)      */}
        {/* ========================================================================= */}
        <div className="flex flex-col justify-between h-full bg-canvas overflow-y-auto px-6 py-4 sm:px-10 lg:px-12">
          
          {/* Header */}
          <header className="flex items-center justify-between shrink-0 h-10">
            <Link to="/" className="flex items-center gap-2 text-[18px] font-extrabold tracking-tight text-ink">
              <OpenHouseLogoMark className="h-6 w-6 object-contain" />
              <span>OpenHouse</span>
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-ink-2 hover:text-ink transition-colors"
            >
              ← Back to home
            </Link>
          </header>

          {/* Center Form Container */}
          <div className="w-full max-w-[460px] mx-auto my-auto py-2">
            
            {/* Title Section */}
            <div className="pb-3">
              <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-ink leading-tight">
                {mode === 'signin' ? 'Sign in to OpenHouse' : 'Create realtor workspace'}
              </h1>
              <p className="pt-1 text-[13px] text-ink-2 leading-relaxed">
                {mode === 'signin'
                  ? 'Access your properties, 3D spatial captures, and publication controls.'
                  : 'Connect your listings and let OpenHouse automate interactive 3D tours.'}
              </p>
            </div>

            {/* Mode Switcher Tabs (Clean flat pill, NO shadows) */}
            <div className="flex rounded-lg bg-surface p-1 border border-border mb-3">
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'signin'
                    ? 'bg-primary text-text-inverse'
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
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'signup'
                    ? 'bg-primary text-text-inverse'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Login Option */}
            {mode === 'signin' && (
              <div className="pb-3">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-primary hover:bg-raised-2 transition-all disabled:opacity-50"
                >
                  <BoltIcon size={14} className="text-primary" />
                  <span>Quick Demo Login (David Olabowale)</span>
                </button>
                
                <div className="relative flex py-2.5 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-3 text-[10.5px] font-semibold text-ink-3 uppercase tracking-wider">
                    or sign in with email
                  </span>
                  <div className="flex-grow border-t border-border"></div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {error && (
                <Callout className="bg-accent/10 border-accent/30 text-accent py-1.5 px-3">
                  <p className="text-xs font-medium text-accent">{error}</p>
                </Callout>
              )}

              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-[11.5px] font-semibold text-ink">Full Name</label>
                    <Input
                      placeholder="David Olabowale"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11.5px] font-semibold text-ink">Agency (Optional)</label>
                    <Input
                      placeholder="Lekki Luxury Realty"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11.5px] font-semibold text-ink">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@brokerage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11.5px] font-semibold text-ink">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset instructions sent to your email.')}
                      className="text-[11px] font-medium text-ink-2 hover:text-ink hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-[14px] font-semibold text-text-inverse hover:bg-primary-hover disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Authenticating…' : mode === 'signin' ? 'Sign in to Console' : 'Create Account & Continue'}
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M11 4.5L16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Terms Footer */}
            <p className="pt-3 text-center text-[11px] text-ink-3">
              By continuing, you agree to OpenHouse’s{' '}
              <span className="text-ink-2 hover:text-ink cursor-pointer underline">Terms</span> and{' '}
              <span className="text-ink-2 hover:text-ink cursor-pointer underline">Privacy Policy</span>.
            </p>

          </div>

          {/* Footer */}
          <footer className="text-[11px] text-ink-3 shrink-0 h-8 flex items-center">
            © {new Date().getFullYear()} OpenHouse Technologies Inc.
          </footer>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: Pure Pointcloud Artwork (NO shadows, blends seamlessly)      */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex relative items-center justify-center h-full bg-canvas p-6 sm:p-10 border-l border-border overflow-hidden">
          <img
            src={imgPointCloudDoorway}
            alt="OpenHouse Spatial Pointcloud Doorway"
            className="max-h-[85vh] w-auto max-w-full object-contain mix-blend-multiply select-none"
          />
        </div>

      </div>
    </div>
  )
}
