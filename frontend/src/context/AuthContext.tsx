"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const mapSupabaseUser = (sbUser: SupabaseUser | null): AuthUser | null => {
    if (!sbUser) return null;
    
    // In a real app, you might fetch the role from a 'profiles' table.
    // For now, we'll check user_metadata or default to 'USER'.
    const role = (sbUser.app_metadata?.role as string) || 'USER';
    const name = (sbUser.user_metadata?.full_name as string) || 
                 sbUser.email?.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return {
      id: sbUser.id,
      email: sbUser.email || '',
      role,
      name,
    };
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
      
      // Manual cookie sync if needed (fallback for BrowserClient)
      if (session?.access_token) {
        console.log('[DEBUG] AuthContext: Session found, token length:', session.access_token.length);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[DEBUG] AuthContext: Auth state change:', event);
      setSession(session);
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
      
      // Force refresh relative path to ensure cookies are sent
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const expires = session?.expires_at ? new Date(session.expires_at * 1000).toUTCString() : '';
        // createBrowserClient should handle this, but as a last resort:
        console.log('[DEBUG] AuthContext: Auth event handled:', event);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ ok: boolean; message?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { ok: false, message: error.message };
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: 'An unexpected error occurred during login' };
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<{ ok: boolean; message?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) return { ok: false, message: error.message };
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: 'An unexpected error occurred during registration' };
    }
  };

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      login, 
      register, 
      logout, 
      isAuthModalOpen, 
      openAuthModal, 
      closeAuthModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
