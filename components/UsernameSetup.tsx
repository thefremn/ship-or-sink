'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  userId: string;
  onComplete: (username: string) => void;
}

export default function UsernameSetup({ userId, onComplete }: Props) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    if (trimmed.length < 3) { setError('Name must be at least 3 characters.'); return; }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) { setError('Only letters, numbers, _ and - allowed.'); return; }

    setLoading(true);
    setError('');

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ id: userId, username: trimmed });

    setLoading(false);

    if (insertError) {
      if (insertError.code === '23505') setError('That name is already taken. Choose another.');
      else setError(insertError.message);
      return;
    }

    onComplete(trimmed);
  };

  return (
    <div className="min-h-screen bg-void-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-cinzel text-sand-50 tracking-widest-2 text-4xl mb-1">FREMN</p>
          <p className="font-cinzel text-sand-400 tracking-widest-3 text-sm mb-4">ORACLE</p>
          <div className="w-16 h-px bg-sand-600 mx-auto mb-3" />
          <p className="font-sans italic text-sand-200 text-xs">Choose your name in the desert</p>
        </div>

        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-sand-400 mb-1">
          Your Name
        </p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="e.g. MuadDib"
          maxLength={32}
          className="w-full bg-surface-high text-sand-50 font-sans text-sm px-4 py-3
            border-0 border-b border-sand-600 focus:border-sand-400
            transition-colors duration-300 placeholder:text-sand-400"
        />
        <p className="font-mono text-xs text-sand-400 mt-1">
          Letters, numbers, _ and - only.
        </p>

        {error && (
          <p className="font-sans text-xs text-spice-coral mt-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!username.trim() || loading}
          className="w-full h-12 mt-6 bg-spice-gradient text-on-primary
            font-cinzel text-sm tracking-[0.15em] uppercase
            transition-opacity duration-200 hover:opacity-90
            disabled:bg-none disabled:bg-surface-high disabled:text-sand-400
            disabled:cursor-not-allowed"
        >
          {loading ? 'Inscribing...' : 'Claim Your Name'}
        </button>
      </div>
    </div>
  );
}
