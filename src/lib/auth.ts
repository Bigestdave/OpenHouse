import { useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured) {
    // Offline / Demo simulated login
    return { data: { user: { id: '00000000-0000-0000-0000-000000000001', email } }, error: null };
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, fullName?: string) {
  if (!isSupabaseConfigured) {
    return { data: { user: { id: '00000000-0000-0000-0000-000000000001', email } }, error: null };
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || 'Realtor' },
    },
  });
}

export async function signOut() {
  if (!isSupabaseConfigured) return;
  return await supabase.auth.signOut();
}

export async function getSession() {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Custom React hook for tracking current auth user and session status.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // In demo/offline mode, provide a mock authenticated user
      setUser({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'david@openhouse.com',
        user_metadata: { full_name: 'David Olabowale' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading, isConfigured: isSupabaseConfigured };
}
