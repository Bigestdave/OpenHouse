import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/auth'
import { Input, Callout, Button } from '../components/ui'
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
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">

        {/* ========================================================================= */}
        {/* LEFT PANEL: Realtor Auth Form                                             */}
        {/* ========================================================================= */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-canvas">

          {/* Header */}
          <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <OpenHouseLogoMark className="h-7 w-7 object-contain" />
              <span className="text-[20px] font-extrabold tracking-tight text-ink">
                OpenHouse
              </span>
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-ink-2 hover:text-ink transition-colors"
            >
              ← Back to home
            </Link>
          </header>

          {/* Form Container */}
          <div className="mx-auto w-full max-w-[420px] py-8 my-auto">

            {/* Title Section */}
            <div className="pb-5">
              <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-ink leading-tight">
                {mode === 'signin' ? 'Sign in to OpenHouse' : 'Create realtor workspace'}
              </h1>
              <p className="text-xs sm:text-sm text-ink-2 mt-1.5 leading-relaxed">
                {mode === 'signin'
                  ? 'Access your properties, 3D spatial captures, and publication controls.'
                  : 'Connect your listings and let OpenHouse automate interactive 3D tours.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-surface p-1 border border-border shadow-subtle mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-primary text-white shadow-sm'
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
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Login Option */}
            {mode === 'signin' && (
              <div className="pb-4">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-primary hover:bg-raised-2 transition-all disabled:opacity-50"
                >
                  <BoltIcon size={14} className="text-primary" />
                  <span>Quick Demo Login (David Olabowale)</span>
                </button>

                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
                    or sign in with email
                  </span>
                  <div className="flex-grow border-t border-border"></div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Callout className="bg-accent/10 border-accent/30 text-accent py-2 px-3">
                  <p className="text-sm font-medium text-accent">{error}</p>
                </Callout>
              )}

              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
                    placeholder="David Olabowale"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Agency (Optional)"
                    placeholder="Lekki Luxury Realty"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@brokerage.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-ink">Password</span>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset instructions sent to your email.')}
                      className="text-[11px] font-medium text-ink-2 hover:text-ink hover:underline"
                    >
                      Forgot password?
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
              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={loading}
                >
                  {mode === 'signin' ? 'Sign in to Console' : 'Create Account & Continue'}
                </Button>
              </div>
            </form>

            {/* Terms Footer */}
            <p className="pt-5 text-center text-[11px] text-ink-3">
              By continuing, you agree to OpenHouse's{' '}
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
        {/* RIGHT PANEL: Full-bleed Pointcloud Doorway Image                          */}
        {/* ========================================================================= */}
        <div className="hidden lg:block relative overflow-hidden">
          <img
            src={imgPointCloudDoorway}
            alt="OpenHouse Spatial Pointcloud Doorway"
            className="absolute inset-0 h-full w-full object-cover select-none"
          />
        </div>

      </div>
    </div>
  )
}
