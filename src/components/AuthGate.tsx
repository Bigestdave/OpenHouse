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
      <div className="min-h-screen bg-[#F2EEE5] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#194534] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#6B6459] font-medium tracking-wide uppercase">Connecting to OpenHouse...</p>
        </div>
      </div>
    );
  }

  // Authenticated — show the workspace
  if (user || localUser) {
    return <>{children}</>;
  }

  // Not authenticated — show the split-screen login
  return <AuthScreen />;
}
