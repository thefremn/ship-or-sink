'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import AuthForm from '@/components/AuthForm';
import UsernameSetup from '@/components/UsernameSetup';
import Header from '@/components/Header';
import HouseSelector from '@/components/HouseSelector';
import DilemmaInput from '@/components/DilemmaInput';
import LoadingState from '@/components/LoadingState';
import OracleResponse from '@/components/OracleResponse';
import ConsultationHistory from '@/components/ConsultationHistory';
import InfiniteDesertTrap from '@/components/InfiniteDesertTrap';
import SilentModePopup from '@/components/SilentModePopup';
import type { House, OracleResponse as OracleResponseType } from '@/types/oracle';

type AppState = 'loading' | 'auth' | 'username' | 'oracle';

const nightBg = `
  radial-gradient(ellipse 60% 40% at 20% 12%, rgba(38,18,80,0.55) 0%, transparent 55%),
  radial-gradient(ellipse 40% 30% at 78% 8%,  rgba(18,10,58,0.45) 0%, transparent 48%),
  linear-gradient(180deg, #01000A 0%, #05041A 12%, #080520 26%, #0A0806 48%, #0C0A07 70%, #0A0806 100%)
`;

export default function Home() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState('');
  const [house, setHouse] = useState<House | null>(null);
  const [dilemma, setDilemma] = useState('');
  const [gomJabbar, setGomJabbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<OracleResponseType | null>(null);
  const [error, setError] = useState('');
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [showSilentPopup, setShowSilentPopup] = useState(false);
  const silentPopupShownRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/climax.mp3');
    audioRef.current.loop = false;
  }, []);

  const resolveUser = async (s: Session) => {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', s.user.id)
      .single();
    if (data?.username) { setUsername(data.username); setAppState('oracle'); }
    else setAppState('username');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) { setSession(s); resolveUser(s); } else setAppState('auth');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) resolveUser(s); else setAppState('auth');
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      document.documentElement.style.setProperty('--scroll-pct', `${pct}%`);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubmit = async () => {
    if (!house || !dilemma.trim() || !session) return;
    setLoading(true); setError(''); setResponse(null);
    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ dilemma, house, gomJabbar }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResponse(data);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setHistoryRefresh((n) => n + 1);
      if (!silentPopupShownRef.current) {
        silentPopupShownRef.current = true;
        setTimeout(() => setShowSilentPopup(true), 1800);
      }
    } catch { setError('The visions are obscured. Seek again.'); }
    finally { setLoading(false); }
  };

  const handleReset = () => { setResponse(null); setDilemma(''); setError(''); };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUsername(''); setResponse(null); setDilemma('');
  };

  if (appState === 'loading') return (
    <div className="min-h-screen bg-void-900 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-spice-amber animate-pulse-glow" />
    </div>
  );

  if (appState === 'auth') return <AuthForm onSuccess={() => {}} />;

  if (appState === 'username' && session) return (
    <UsernameSetup
      userId={session.user.id}
      onComplete={(name) => { setUsername(name); setAppState('oracle'); }}
    />
  );

  return (
    <InfiniteDesertTrap>
    <main className="relative min-h-screen text-sand-200" style={{ background: nightBg }}>

      {/* Stars — three layers at different densities */}
      <div className="stars-sm" />
      <div className="stars-md" />
      <div className="stars-lg" />

      {/* Moon glow */}
      <div className="night-moon" />

      {/* Nebula wash */}
      <div className="night-nebula" />

      <div className="oracle-scroll-indicator" />

      <div className="relative z-10">
        <Header />

        <div className="max-w-2xl mx-auto px-4 md:px-6 pt-4 flex justify-between items-center">
          <span className="font-mono text-[11px] text-sand-400 uppercase tracking-[0.15em]">{username}</span>
          <button onClick={handleSignOut} className="font-sans text-xs text-sand-400 hover:text-sand-200 transition-colors duration-200">
            Sign out
          </button>
        </div>

        <div className="max-w-2xl mx-auto px-4 md:px-6 pb-24">
          <HouseSelector selected={house} onChange={setHouse} />
          {!response && (
            <DilemmaInput
              dilemma={dilemma} onDilemmaChange={setDilemma}
              gomJabbar={gomJabbar} onGomJabbarChange={setGomJabbar}
              house={house} loading={loading} onSubmit={handleSubmit}
            />
          )}
          {loading && <LoadingState />}
          {error && <p className="font-sans text-sm text-spice-coral text-center mt-6">{error}</p>}
          {response && house && <OracleResponse response={response} house={house} onReset={handleReset} />}
          {session && <ConsultationHistory token={session.access_token} refreshTrigger={historyRefresh} />}
        </div>
      </div>
    </main>
    {showSilentPopup && <SilentModePopup onDismiss={() => setShowSilentPopup(false)} />}
    </InfiniteDesertTrap>
  );
}
