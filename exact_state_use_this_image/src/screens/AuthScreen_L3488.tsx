import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/auth'
import { Button, Input, Callout } from '../components/ui'
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
        // Direct new signups to the onboarding setup wizard
        navigate('/setup')
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-canvas flex flex-col justify-between font-sans text-ink selection:bg-primary/20">
      
      {/* Top minimal header */}
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <OpenHouseLogoMark className="h-7 w-7 object-contain" />
          <span className="text-[19px] font-extrabold tracking-tight text-ink">
            OpenHouse
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-ink-2 hover:text-ink transition-colors"
        >
          Back to home
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-[440px] rounded-2xl border border-border bg-surface p-7 sm:p-9 shadow-subtle">
          
          {/* Header */}
          <div className="text-center pb-6">
            <h1 className="text-[24px] sm:text-[26px] font-extrabold tracking-tight text-ink">
              {mode === 'signin' ? 'Welcome back' : 'Create workspace'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-2 mt-1.5 leading-relaxed">
              {mode === 'signin'
                ? 'Sign in to access your properties, captures, and approvals.'
                : 'Connect your listings and let OpenHouse handle 3D spatial tours.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-canvas p-1 mb-6 border border-border">
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
            <div className="pb-5">
              <Button
                type="button"
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleDemoSignIn}
                loading={loading}
                className="font-semibold text-xs text-primary"
              >
                <BoltIcon size={15} className="text-primary" />
                <span>Quick Demo Login (David Olabowale)</span>
              </Button>
              <div className="relative flex py-4 items-center">
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
              <Callout variant="accent">
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
              <div className="flex items-center justify-between pb-1.5">
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

          {/* Footer note */}
          <div className="pt-6 text-center text-[11px] text-ink-3">
            By continuing, you agree to OpenHouse’s{' '}
            <span className="text-ink-2 hover:text-ink cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-ink-2 hover:text-ink cursor-pointer">Privacy Policy</span>.
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="px-6 py-4 text-center text-xs text-ink-3">
        © {new Date().getFullYear()} OpenHouse Technologies Inc. All rights reserved.
      </footer>

    </div>
  )
}
