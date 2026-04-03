"use client";

import { useState } from 'react';
import { X, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const reset = () => { setEmail(''); setPassword(''); setName(''); setError(''); setShowPassword(false); };
  const switchMode = () => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (mode === 'signup' && password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    const result = mode === 'signin'
      ? await login(email, password)
      : await register(email, password, name);
    setLoading(false);

    if (result.ok) {
      reset();
      closeAuthModal();
      router.push('/dashboard');
    } else {
      setError(result.message || 'Something went wrong');
    }
  };

  const handleClose = () => { reset(); closeAuthModal(); };

  const inputCls = "w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-background border border-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-gold-dark via-primary to-gold-light" />

        <div className="p-8">
          {/* Close */}
          <button onClick={handleClose} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition">
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif tracking-widest uppercase">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 tracking-wide">
              {mode === 'signin' ? 'Sign in to access your account' : 'Join the AURA experience'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wide px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs tracking-widest text-muted-foreground mb-1.5 uppercase">Full Name</label>
                <input
                  className={inputCls}
                  placeholder="Alexandra Chen"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs tracking-widest text-muted-foreground mb-1.5 uppercase">Email</label>
              <input
                className={inputCls}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest text-muted-foreground mb-1.5 uppercase">Password</label>
              <div className="relative">
                <input
                  className={`${inputCls} pr-10`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black py-3.5 rounded-lg text-sm tracking-[0.2em] font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground tracking-widest">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Switch */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={switchMode} className="text-primary hover:underline font-medium tracking-wide">
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
