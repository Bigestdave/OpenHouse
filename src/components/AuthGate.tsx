import React, { useState, useEffect } from 'react';
import { AuthScreen } from '../screens/AuthScreen';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  // Directly read localStorage — no async, no loading spinner, no Supabase dependency
  const [isAuthed, setIsAuthed] = useState(
    () => !!localStorage.getItem('openhouse_current_user')
  );

  useEffect(() => {
    const refresh = () => {
      setIsAuthed(!!localStorage.getItem('openhouse_current_user'));
    };
    window.addEventListener('auth_state_changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('auth_state_changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (!isAuthed) return <AuthScreen />;
  return <>{children}</>;
}
