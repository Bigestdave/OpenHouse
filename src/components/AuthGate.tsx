import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { AuthScreen } from '../screens/AuthScreen';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();
  const [localUser, setLocalUser] = useState(() => localStorage.getItem('openhouse_current_user'));

  useEffect(() => {
    const handleAuthChange = () => {
      setLocalUser(localStorage.getItem('openhouse_current_user'));
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth_state_changed', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth_state_changed', handleAuthChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center font-sans text-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-ink-2 font-medium tracking-wide uppercase">Connecting to OpenHouse...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated via Supabase OR has a local demo session, render protected workspace
  if (user || localUser) {
    return <>{children}</>;
  }

  // Otherwise render AuthScreen
  return <AuthScreen />;
}
