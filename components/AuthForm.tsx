'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const fn = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });

    const { error: authError } = await fn;

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    onSuccess();
  };

  return (
    <div className="min-h-screen bg-void-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-cinzel text-sand-50 tracking-widest-2 text-4xl mb-1">FREMN</p>
          <p className="font-cinzel text-sand-400 tracking-widest-3 text-sm mb-4">ORACLE</p>
          <div className="w-16 h-px bg-sand-600 mx-auto mb-3" />
          <p className="font-sans italic text-sand-200 text-xs">Prescience for your decisions</p>
        </div>

        {/* Mode toggle */}
        <div className="flex mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-200 border-b-2
              ${mode === 'login' ? 'text-sand-50 border-sand-400' : 'text-sand-400 border-outline-variant/15 hover:text-sand-200'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-200 border-b-2
              ${mode === 'signup' ? 'text-sand-50 border-sand-400' : 'text-sand-400 border-outline-variant/15 hover:text-sand-200'}`}
          >
            Create Account
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-sans text-[11px] uppercase tracking-[0.2em] text-sand-400 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seeker@fremn.com"
              className="w-full bg-surface-high text-sand-50 font-sans text-sm px-4 py-3
                border-0 border-b border-sand-600 focus:border-sand-400
                transition-colors duration-300 placeholder:text-sand-400"
            />
          </div>
          <div>
            <label className="font-sans text-[11px] uppercase tracking-[0.2em] text-sand-400 block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="w-full bg-surface-high text-sand-50 font-sans text-sm px-4 py-3
                border-0 border-b border-sand-600 focus:border-sand-400
                transition-colors duration-300 placeholder:text-sand-400"
            />
          </div>
        </div>

        {error && (
          <p className="font-sans text-xs text-spice-coral mt-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!email || !password || loading}
          className="w-full h-12 mt-6 bg-spice-gradient text-on-primary
            font-cinzel text-sm tracking-[0.15em] uppercase
            transition-opacity duration-200 hover:opacity-90
            disabled:bg-none disabled:bg-surface-high disabled:text-sand-400
            disabled:cursor-not-allowed"
        >
          {loading ? 'The spice flows...' : mode === 'login' ? 'Enter the Oracle' : 'Begin the Journey'}
        </button>

        {mode === 'signup' && (
          <p className="font-sans text-xs text-sand-400 text-center mt-4">
            You will choose your name in the next step.
          </p>
        )}
      </div>
    </div>
  );
}
