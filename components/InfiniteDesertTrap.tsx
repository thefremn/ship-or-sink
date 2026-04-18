'use client';

import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

const MILESTONES: { km: number; line1: string; line2?: string }[] = [
  { km: 100,   line1: 'Wait for a Surprise.' },
  { km: 200,   line1: 'Wait for another Surprise.' },
  { km: 669,  line1: 'There is no surprise.' },
  { km: 1000, line1: 'Good Boy.', line2: 'Or Good Girl. For following orders.' },
];

const WHISPERS = [
  'The pain was real. The lesson is permanent.',
  'He who can destroy a thing, controls a thing.',
  'Fear is the mind-killer. Fear is the little-death.',
  'Without change, something sleeps inside us and seldom awakens.',
  'The spice extends life. The spice expands consciousness.',
  'You have passed through the Agony. Now survive yourself.',
  'Survival is the ability to swim in strange water.',
  'The mystery of life is not a problem to solve, but a reality to experience.',
  'There is no escape — we pay for the violence of our ancestors.',
  'The Gom Jabbar tests for human. You passed. Barely.',
  'To see truth without knowing falsehood is to walk blind into light.',
  'Deep in the unconscious is a pervasive need for a logical universe.',
  'The target of the Panoplia Prophetica is to prevent certain futures.',
  'A beginning is a very delicate time.',
];

interface Whisper {
  id: number;
  text: string;
  x: number;
  y: number;
}

export default function InfiniteDesertTrap({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(250);
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [milestone, setMilestone] = useState<typeof MILESTONES[0] | null>(null);
  const whisperIdRef = useRef(0);
  const lastWhisperDepthRef = useRef(0);
  const triggeredMilestonesRef = useRef<Set<number>>(new Set());

  // Extend the trap infinitely when user nears the bottom
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setContainerHeight(h => h + 250); },
      { threshold: 0.1 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // Track scroll depth, spawn whispers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const intoContainer = Math.max(0, -el.getBoundingClientRect().top);
      setScrollDepth(intoContainer);

      // Check milestones
      const currentKm = intoContainer / 80;
      for (const m of MILESTONES) {
        if (currentKm >= m.km && !triggeredMilestonesRef.current.has(m.km)) {
          triggeredMilestonesRef.current.add(m.km);
          setMilestone(m);
        }
      }

      if (intoContainer - lastWhisperDepthRef.current > 260 && intoContainer > 60) {
        lastWhisperDepthRef.current = intoContainer;
        const id = ++whisperIdRef.current;
        setWhispers(prev => [
          ...prev.slice(-4),
          {
            id,
            text: WHISPERS[id % WHISPERS.length],
            x: 6 + Math.random() * 54,
            y: 18 + Math.random() * 48,
          },
        ]);
        setTimeout(() => setWhispers(prev => prev.filter(w => w.id !== id)), 5000);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const depthKm   = (scrollDepth / 80).toFixed(2);
  const p1        = scrollDepth * 0.25;   // slowest star layer
  const p2        = scrollDepth * 0.50;   // mid
  const p3        = scrollDepth * 0.80;   // fast (foreground stars rush past)
  const voidDepth = Math.min(1, scrollDepth / 400);

  return (
    <>
      {children}

      <div ref={containerRef} style={{ height: `${containerHeight}vh` }} className="relative mt-0">

      {/* ── Sticky falling window ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ zIndex: 10 }}>

        {/* Deep void — darkens as you descend */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 100% 80% at 50% 50%,
            rgba(10,4,30,${voidDepth * 0.9}) 0%,
            rgba(1,0,8,${voidDepth}) 100%)`,
        }} />

        {/* Star layer 1 — distant, barely moving */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(253,246,227,0.75) 1px, transparent 1px)',
          backgroundSize: '160px 130px',
          backgroundPosition: `28px ${-p1 * 0.5}px`,
          opacity: Math.min(0.85, voidDepth * 2),
        }} />

        {/* Star layer 2 — mid-field */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle, rgba(253,246,227,0.95) 1.5px, transparent 1.5px),
            radial-gradient(circle, rgba(196,163,90,0.65) 1px, transparent 1px)`,
          backgroundSize: '300px 240px, 480px 380px',
          backgroundPosition: `70px ${-p2}px, 200px ${-p2 * 0.8}px`,
          opacity: Math.min(1, voidDepth * 1.8),
        }} />

        {/* Star layer 3 — foreground, rushing past */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle, rgba(253,246,227,1.0) 2px, rgba(253,246,227,0.12) 5px, transparent 8px),
            radial-gradient(circle, rgba(239,159,39,0.8) 1.5px, transparent 1.5px)`,
          backgroundSize: '550px 440px, 700px 550px',
          backgroundPosition: `110px ${-p3}px, 300px ${-p3 * 0.9}px`,
          opacity: Math.min(0.9, voidDepth * 1.5),
        }} />

        {/* Nebula colour bleeding in */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(40,10,90,${voidDepth * 0.4}) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 80% 20%, rgba(15,8,60,${voidDepth * 0.35}) 0%, transparent 50%)`,
        }} />

        {/* Entry prompt */}
        {scrollDepth < 100 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-8"
            style={{ opacity: Math.max(0, 1 - scrollDepth / 80) }}
          >
            <p className="font-cinzel text-sand-400 text-xs uppercase tracking-widest-2">
              The box has no bottom
            </p>
            <div className="w-8 h-px bg-spice-amber/40 mx-auto" />
            <p className="font-crimson italic text-sand-200 text-base">
              Scroll deeper into the void...
            </p>
          </div>
        )}

        {/* Depth counter */}
        {scrollDepth > 80 && (
          <div
            className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center"
            style={{ opacity: Math.min(1, (scrollDepth - 80) / 120) }}
          >
            <p className="font-mono text-[9px] text-sand-400 uppercase tracking-[0.35em] mb-1">
              Desert depth
            </p>
            <p className="font-mono text-spice-amber text-4xl tabular-nums">{depthKm} km</p>
            <div className="w-px h-6 bg-spice-amber/25 mx-auto mt-2 animate-pulse-glow" />
          </div>
        )}

        {/* Milestone notice */}
        {milestone && (
          <div
            key={milestone.km}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6 pointer-events-none animate-fade-slide-up"
            style={{ zIndex: 20 }}
          >
            <p className="font-mono text-[9px] text-spice-amber uppercase tracking-[0.4em] mb-3">
              — {milestone.km.toLocaleString()} km —
            </p>
            <p className="font-cinzel text-sand-50 text-2xl tracking-widest-2 mb-2">
              {milestone.line1}
            </p>
            {milestone.line2 && (
              <p className="font-crimson italic text-sand-200 text-base mt-1">
                {milestone.line2}
              </p>
            )}
            <div className="w-12 h-px bg-spice-amber/40 mx-auto mt-4" />
          </div>
        )}

        {/* Floating whispers */}
        {whispers.map(w => (
          <div
            key={w.id}
            className="absolute whisper-appear pointer-events-none"
            style={{ left: `${w.x}%`, top: `${w.y}%`, maxWidth: 260 }}
          >
            <p className="font-crimson italic text-sand-50 text-sm leading-relaxed">{w.text}</p>
          </div>
        ))}

        {/* Scan-line CRT wash */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
          opacity: voidDepth * 0.6,
        }} />
      </div>

      {/* Sentinel at the bottom to trigger height extension */}
      <div ref={sentinelRef} className="absolute bottom-0 w-full h-1" />
      </div>
    </>
  );
}
