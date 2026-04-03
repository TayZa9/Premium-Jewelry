"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('aura-user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('aura-user');
      }
    }
    setIsLoading(false);
  }, []);

  const persistAuth = (userData: AuthUser, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('aura-user', JSON.stringify(userData));
  };

  const login = async (email: string, password: string): Promise<{ ok: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message || 'Login failed' };
      
      const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      persistAuth({ id: data.id, email: data.email, role: data.role, name: nameFromEmail }, data.token);
      return { ok: true };
    } catch {
      // Fallback: mock auth when backend is unavailable
      const saved = localStorage.getItem('aura-registered-users');
      const users: Record<string, { password: string; name: string }> = saved ? JSON.parse(saved) : {};
      const entry = users[email];
      if (!entry || entry.password !== password) {
        if (!entry) return { ok: false, message: 'No account found. Please create one.' };
        return { ok: false, message: 'Invalid email or password' };
      }
      const nameFromEmail = entry.name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      persistAuth({ id: `mock-${Date.now()}`, email, role: 'USER', name: nameFromEmail }, `mock-token-${Date.now()}`);
      return { ok: true };
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<{ ok: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message || 'Registration failed' };

      const displayName = name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      persistAuth({ id: data.id, email: data.email, role: data.role, name: displayName }, data.token);
      return { ok: true };
    } catch {
      // Fallback: mock registration when backend is unavailable
      const saved = localStorage.getItem('aura-registered-users');
      const users: Record<string, { password: string; name: string }> = saved ? JSON.parse(saved) : {};
      if (users[email]) return { ok: false, message: 'Account already exists. Please sign in.' };
      
      const displayName = name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      users[email] = { password, name: displayName };
      localStorage.setItem('aura-registered-users', JSON.stringify(users));
      persistAuth({ id: `mock-${Date.now()}`, email, role: 'USER', name: displayName }, `mock-token-${Date.now()}`);
      return { ok: true };
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('aura-user');
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
