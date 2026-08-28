import React, { useState } from 'react';
import { useAuth, signIn, signUp } from '../lib/auth';
import { OpenHouseLogoMark } from './WorkspaceShell';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#194534] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#57856C] font-medium tracking-wide uppercase">Connecting to OpenHouse...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated or Supabase is offline/local mode, render workspace
  if (user || !isConfigured) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);
    setAuthSuccess(null);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setAuthError('Account not found with these credentials. Would you like to create a new workspace account?');
        } else {
          setAuthError(error.message);
        }
      }
    } else {
      const { data, error } = await signUp(email, password, fullName);
      if (error) {
        setAuthError(error.message);
      } else {
        if (data && 'session' in data && data.session) {
          setAuthSuccess('Account created successfully! Redirecting...');
        } else {
          setAuthSuccess('Account created! Please check your email to confirm your account, or sign in.');
          setMode('signin');
        }
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#194534] flex items-center justify-center text-white shadow-md">
            <OpenHouseLogoMark className="w-7 h-7 fill-white" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[#0B1713]">
          {mode === 'signin' ? 'Sign in to OpenHouse' : 'Create Realtor Workspace'}
        </h2>
        <p className="mt-1 text-center text-xs text-[#57856C]">
          Autonomous 3D Real Estate Platform
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E5E0D8] rounded-2xl sm:px-10">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#F2EEE5] p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setAuthError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-[#0B1713] shadow-xs'
                  : 'text-[#57856C] hover:text-[#0B1713]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setAuthError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#0B1713] shadow-xs'
                  : 'text-[#57856C] hover:text-[#0B1713]'
              }`}
            >
              Create Account
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {authError && (
              <div className="p-3 text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1">
                <p>{authError}</p>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setAuthError(null); }}
                    className="font-semibold underline text-[#194534] hover:text-[#2F613D] block mt-1"
                  >
                    Switch to Create Account →
                  </button>
                )}
              </div>
            )}

            {authSuccess && (
              <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl">
                {authSuccess}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-[#2F613D] mb-1">
                  Full Name / Agency Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D9D3C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#194534] bg-[#FAF8F5]"
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#2F613D] mb-1">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#D9D3C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#194534] bg-[#FAF8F5]"
                placeholder="realtor@agency.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2F613D] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#D9D3C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#194534] bg-[#FAF8F5]"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#194534] hover:bg-[#2F613D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194534] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In to Workspace'
                : 'Create Workspace Account'}
            </button>
          </form>

          <div className="mt-6 border-t border-[#E5E0D8] pt-4 text-center">
            <p className="text-[11px] text-[#57856C]">
              Need help? Contact support@openhouse.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
