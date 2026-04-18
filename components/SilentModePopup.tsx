'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onDismiss: () => void;
}

export default function SilentModePopup({ onDismiss }: Props) {
  const [activated, setActivated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in after mount
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  const handleActivate = async () => {
    try {
      const audio = new Audio('/silence.mp3');
      audio.volume = 1.0;

      // Web Audio API gain boost — amplify well past the 0–1 ceiling
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      gain.gain.value = 15; // 15× amplification
      source.connect(gain);
      gain.connect(ctx.destination);

      await audio.play();
    } catch {
      // Silently fail if browser blocks autoplay — still mark as activated
    }

    setActivated(true);
    setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 1800);
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: `rgba(10,8,6,${visible ? 0.88 : 0})`,
        transition: 'background 400ms ease',
        backdropFilter: visible ? 'blur(4px)' : 'none',
      }}
      onClick={e => { if (e.target === e.currentTarget) handleDismiss(); }}
    >
      <div
        style={{
          background: '#0A0806',
          border: '1px solid rgba(196,163,90,0.15)',
          maxWidth: 480,
          width: '100%',
          padding: '48px 40px',
          position: 'relative',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 400ms ease, transform 400ms ease',
        }}
      >
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '1px solid rgba(239,159,39,0.5)', borderLeft: '1px solid rgba(239,159,39,0.5)' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTop: '1px solid rgba(239,159,39,0.5)', borderRight: '1px solid rgba(239,159,39,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottom: '1px solid rgba(239,159,39,0.5)', borderLeft: '1px solid rgba(239,159,39,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '1px solid rgba(239,159,39,0.5)', borderRight: '1px solid rgba(239,159,39,0.5)' }} />

        {!activated ? (
          <>
            {/* Icon — speaker wave SVG */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
                <path d="M8 15H2V25H8L18 33V7L8 15Z" fill="rgba(196,163,90,0.25)" stroke="rgba(196,163,90,0.6)" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M24 13C26.5 15.2 28 17.5 28 20C28 22.5 26.5 24.8 24 27" stroke="rgba(196,163,90,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M28 9C32.5 12.5 35 16 35 20C35 24 32.5 27.5 28 31" stroke="rgba(196,163,90,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C4A35A', textAlign: 'center', marginBottom: 20 }}>
              ORACLE · RECOMMENDATION
            </p>

            <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.375rem', color: '#FDF6E3', textAlign: 'center', letterSpacing: '0.1em', marginBottom: 16, lineHeight: 1.4 }}>
              Enter Silent Mode
            </h2>

            <p style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: '1rem', color: '#E8D5A3', textAlign: 'center', lineHeight: 1.75, marginBottom: 36 }}>
              The Oracle has spoken. Deep contemplation requires silence. Activate to mute all distractions and commune with the void undisturbed.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button
                onClick={handleActivate}
                style={{
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(135deg, #8B6914 0%, #e5c276 100%)',
                  color: '#3f2e00',
                  border: 'none',
                  padding: '14px 40px',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'transform 200ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Activate Silent Mode
              </button>
              <button
                onClick={handleDismiss}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: '#C4A35A',
                  border: 'none',
                  padding: '8px 20px',
                  cursor: 'pointer',
                  opacity: 0.6,
                  transition: 'opacity 200ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
              >
                Remain in the noise
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            {/* Checkmark SVG */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
                <circle cx="20" cy="20" r="17" stroke="rgba(29,158,117,0.6)" strokeWidth="1.5"/>
                <path d="M12 20L17 25L28 14" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.125rem', color: '#FDF6E3', letterSpacing: '0.1em', marginBottom: 10 }}>
              Silent Mode Active
            </p>
            <p style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: '0.9375rem', color: '#E8D5A3', lineHeight: 1.7 }}>
              The void receives you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
