import React, { useState } from 'react';
import { useAuth, signIn } from '../lib/auth';
import { OpenHouseLogoMark } from './WorkspaceShell';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, isConfigured } = useAuth();
  const [email, setEmail] = useState('david@openhouse.com');
  const [password, setPassword] = useState('openhouse2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  // If user is already authenticated or Supabase is in local demo mode, render children
  if (user || !isConfigured) {
    return <>{children}</>;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    const { error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message || 'Invalid credentials');
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
          Realtor Workspace Sign In
        </h2>
        <p className="mt-1 text-center text-xs text-[#57856C]">
          OpenHouse Autonomous 3D Real Estate Engine
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E5E0D8] rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSignIn}>
            {authError && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {authError}
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
                placeholder="david@openhouse.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2F613D] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#D9D3C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#194534] bg-[#FAF8F5]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#194534] hover:bg-[#2F613D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194534] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign in to Workspace'}
            </button>
          </form>

          <div className="mt-6 border-t border-[#E5E0D8] pt-4 text-center">
            <p className="text-[11px] text-[#57856C]">
              Demo environment: Seed account enabled for instant walkthrough.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
