import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/auth'
import { Input, Callout, Button } from '../components/ui'
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
    <div className="min-h-screen flex flex-col justify-between bg-canvas font-sans text-ink">
      
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center justify-between px-6 sm:px-10 border-b border-border bg-surface">
        <Link to="/" className="flex items-center gap-2 text-[17px] font-extrabold tracking-tight text-ink">
          <OpenHouseLogoMark className="h-6 w-6 object-contain" />
          <span>OpenHouse</span>
        </Link>
        <Link to="/" className="text-xs font-semibold text-ink-2 transition-colors hover:text-ink">
          ← Back to home
        </Link>
      </header>

      {/* Main Content (Compact, proportional layout) */}
      <main className="flex-1 flex flex-col justify-center py-6">
        
        {/* Page Title */}
        <div className="text-center pb-4">
          <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-tight text-ink leading-tight">
            {mode === 'signin' ? 'Sign in to OpenHouse' : 'Create realtor workspace'}
          </h1>
          <p className="pt-1 text-xs sm:text-sm text-ink-2 max-w-[460px] mx-auto leading-relaxed">
            {mode === 'signin'
              ? 'Access your properties, 3D spatial captures, and publication controls.'
              : 'Connect your listings and let OpenHouse automate interactive 3D tours.'}
          </p>
        </div>

        <div className="mx-auto w-full max-w-[440px] px-5 sm:px-6">
          
          {/* Mode Switcher Pills */}
          <div className="flex justify-center pb-4">
            <div className="inline-flex rounded-xl bg-surface p-1 border border-border shadow-subtle w-full max-w-[320px]">
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-primary text-text-inverse shadow-subtle'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Quick Demo Login Option */}
          {mode === 'signin' && (
            <div className="pb-3">
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-primary shadow-subtle hover:bg-raised-2 transition-all disabled:opacity-50"
              >
                <BoltIcon size={15} className="text-primary" />
                <span>Quick Demo Login (David Olabowale)</span>
              </button>
              
              <div className="relative flex py-3 items-center">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-3 text-center text-[11px] text-ink-3">
        © {new Date().getFullYear()} OpenHouse Technologies Inc. All rights reserved.
      </footer>

    </div>
  )
}
