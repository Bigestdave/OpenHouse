import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/auth'
import { Input, Callout, Button, Badge } from '../components/ui'
import { BoltIcon } from '../components/icons'
import { OpenHouseLogoMark } from '../components/WorkspaceShell'

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
        {/* LEFT PANEL: Realtor Auth Form */}
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
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
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
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
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
              <div className="pb-4">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-primary shadow-subtle hover:bg-raised-2 transition-all disabled:opacity-50"
                >
                  <BoltIcon size={15} className="text-primary" />
                  <span>Quick Demo Login (David Olabowale)</span>
                </button>
                
                <div className="relative flex py-3.5 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-3 text-[10.5px] font-semibold text-ink-3 uppercase tracking-wider">
                    or sign in with email
                  </span>
                  <div className="flex-grow border-t border-border"></div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <Callout className="bg-accent/10 border-accent/30 text-accent py-2">
                  <p className="text-xs font-medium text-accent">{error}</p>
                </Callout>
              )}

              {mode === 'signup' && (
                <>
                  <Input
                    label="Full Name"
                    placeholder="David Olabowale"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Agency / Brokerage (Optional)"
                    placeholder="Lekki Luxury Realty"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                </>
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
              <div className="pt-2">
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
        {/* RIGHT PANEL: High-Impact 3D Spatial Showcase */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-[#0B1713] p-12 text-white border-l border-border/30">
          
          {/* Background Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#194534]/50 via-[#0B1713] to-[#070E0B] pointer-events-none" />

          {/* Top Headline Section */}
          <div className="relative z-10 space-y-4 max-w-[540px] pt-6">
            <div className="flex items-center gap-2">
              <Badge variant="success">● Spatial OS Live</Badge>
              <span className="text-xs text-white/60 font-medium">Realtor Attention Inbox</span>
            </div>
            
            <h2 className="text-[38px] xl:text-[44px] font-extrabold tracking-tight text-white leading-[1.1]">
              List normally.<br />
              <span className="text-[#D97945]">OpenHouse</span> handles the rest.
            </h2>
            
            <p className="text-sm text-white/70 leading-relaxed">
              No Gaussian splatting, camera alignment, or confidence scores to learn. OpenHouse ingests listing details, identifies missing coverage, and builds interactive 3D tours automatically.
            </p>
          </div>

          {/* Featured Property Showcase Card */}
          <div className="relative z-10 my-8 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5 shadow-2xl space-y-4 max-w-[540px]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-black/40">
              <img
                src="/src/assets/prop-admiralty.jpg"
                alt="8 Admiralty Way 3D Walkthrough"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
                  Interactive 3D Walkthrough
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-black/70 backdrop-blur-md p-2.5 text-xs text-white">
                <div>
                  <p className="font-bold">8 Admiralty Way</p>
                  <p className="text-[11px] text-white/70">Lekki Phase 1, Lagos · ₦8m/year</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400">6/6 Rooms Verified ✓</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                <span className="block font-bold text-white">18–25 min</span>
                <span className="text-[10px] text-white/60">Auto Pipeline</span>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                <span className="block font-bold text-white">24/7 Live</span>
                <span className="text-[10px] text-white/60">Renter Access</span>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                <span className="block font-bold text-white">Grounded Q&A</span>
                <span className="text-[10px] text-white/60">Evidence Verified</span>
              </div>
            </div>
          </div>

          {/* Bottom Renter Quote & Badge */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/60">
            <span>Powering real estate in Lagos & international portals.</span>
            <span className="font-semibold text-white/80">OpenHouse v2.0</span>
          </div>

        </div>

      </div>
    </div>
  )
}
