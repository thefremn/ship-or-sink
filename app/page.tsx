'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useCallback } from 'react';
import ParticleField from '@/components/ParticleField';
import LandingCursor from '@/components/LandingCursor';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const PROVERBS = [
  'The desert does not forgive the unprepared.',
  'He who controls the spice controls the universe.',
  'Survival is the ability to swim in strange water.',
  'The slow blade penetrates the shield.',
  'Without change, something sleeps inside us.',
  'I must not fear. Fear is the mind-killer.',
  'The vision of time is broad, but when you pass through it, time becomes a narrow door.',
  'Seek freedom and become captive of your desires.',
  'There is no real ending. It is only the place where you stop the story.',
];

function AtreidesHawk({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Hawk in flight — top-down view */}
      <path
        d="M18 4 C17 7 15 9 12 10 L3 8 L6 13 L1 15 L9 16 C10 18 10 21 9 28 L14 23 L15 28 L18 25 L21 28 L22 23 L27 28 C26 21 26 18 27 16 L35 15 L30 13 L33 8 L24 10 C21 9 19 7 18 4Z"
        fill={color}
      />
    </svg>
  );
}

function HarkonnenMark({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Iron ring with inner cross — brutal, industrial */}
      <circle cx="18" cy="18" r="13" stroke={color} strokeWidth="2.5" fill="none" />
      <circle cx="18" cy="18" r="5" fill={color} />
      <line x1="18" y1="5" x2="18" y2="13" stroke={color} strokeWidth="2" />
      <line x1="18" y1="23" x2="18" y2="31" stroke={color} strokeWidth="2" />
      <line x1="5" y1="18" x2="13" y2="18" stroke={color} strokeWidth="2" />
      <line x1="23" y1="18" x2="31" y2="18" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function FremenCrescent({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Crescent — maker-hook curve, two moons of Arrakis */}
      <path
        d="M24 6 A14 14 0 1 0 24 30 A9 9 0 1 1 24 6Z"
        fill={color}
      />
    </svg>
  );
}

const HOUSE_PANELS = [
  {
    bg: 'linear-gradient(160deg, #0D1F30 0%, #0A0806 100%)',
    edgeColor: 'rgba(30,111,168,0.3)',
    Glyph: AtreidesHawk,
    glyphColor: 'rgba(30,111,168,0.7)',
    name: 'ATREIDES',
    words: 'Strength and Justice',
    desc: 'The Oracle speaks in legacy and honour. Your counsel is measured in generations, not quarters.',
    tag: 'NOBLE · LONG-TERM · HONOURED',
    tagColor: '#1E6FA8',
    edgeLine: 'rgba(30,111,168,0.4)',
  },
  {
    bg: 'linear-gradient(160deg, #1A0808 0%, #0A0806 100%)',
    edgeColor: 'rgba(139,26,26,0.3)',
    Glyph: HarkonnenMark,
    glyphColor: 'rgba(139,26,26,0.8)',
    name: 'HARKONNEN',
    words: 'Power and Efficiency',
    desc: 'The Oracle strips sentiment. Your counsel is measured in leverage, elimination of weakness, and the cold arithmetic of power.',
    tag: 'RUTHLESS · EFFICIENT · ABSOLUTE',
    tagColor: '#8B1A1A',
    edgeLine: 'rgba(139,26,26,0.4)',
  },
  {
    bg: 'linear-gradient(160deg, #1A1408 0%, #0A0806 100%)',
    edgeColor: 'rgba(196,163,90,0.3)',
    Glyph: FremenCrescent,
    glyphColor: 'rgba(196,163,90,0.75)',
    name: 'FREMEN',
    words: 'Survival and Adaptation',
    desc: 'The Oracle speaks in resources and discipline. Your counsel is measured in water, in endurance, and the wisdom of the deep desert.',
    tag: 'ADAPTIVE · SCARCE · UNBROKEN',
    tagColor: '#C4A35A',
    edgeLine: 'rgba(196,163,90,0.4)',
  },
];

const TESTAMENTS = [
  {
    bg: '#1E1B17',
    quote: "I was certain the acquisition was wrong. The Oracle confirmed what I could not say aloud — the risk was not the deal, it was the timing. We walked away. Three months later, the buyer's company collapsed.",
    by: 'SEEKER · HOUSE ATREIDES',
    accent: '#1E6FA8',
  },
  {
    bg: '#0A0806',
    quote: "I chose Harkonnen. The Oracle was merciless. It told me my co-founder was a liability before I had the courage to admit it myself. The Fremen Verdict was four words. I printed it. I still have it.",
    by: 'SEEKER · HOUSE HARKONNEN',
    accent: '#8B1A1A',
  },
  {
    bg: '#1E1B17',
    quote: "The spice yield score was 91%. I had never felt so certain about anything uncertain. I shipped the product. We found product-market fit in seven weeks.",
    by: 'SEEKER · HOUSE FREMEN',
    accent: '#C4A35A',
  },
];

export default function LandingPage() {
  useScrollReveal();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playClick = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/climax.mp3');
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  return (
    <div className="landing-page" style={{ background: '#0A0806', color: '#E8D5A3', fontFamily: 'var(--font-sans)' }}>
      <LandingCursor />

      {/* ── SECTION 1: VOID HERO ── */}
      <section className="relative overflow-hidden" style={{ height: '100vh', minHeight: 600 }}>
        <ParticleField />

        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
          <div
            className="animate-scanline absolute left-0 right-0"
            style={{ height: 1, background: 'rgba(196,163,90,0.03)', top: 0 }}
          />
        </div>

        {/* Deep void gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 50% 40%, rgba(20,8,50,0.6) 0%, transparent 70%),
              radial-gradient(ellipse at center, transparent 20%, #0A0806 100%)
            `,
          }}
        />

        {/* Content */}
        <div
          className="relative flex flex-col items-center justify-center h-full text-center"
          style={{ zIndex: 10, padding: '0 20px' }}
        >
          {/* Logo */}
          <div
            className="animate-sand-drift mb-5"
            style={{ opacity: 0, animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <Image
              src="/logo.png"
              alt="FREMN Oracle"
              width={64}
              height={64}
              priority
              unoptimized
              className="object-contain w-14 h-14 md:w-[72px] md:h-[72px]"
              style={{ opacity: 0.85 }}
            />
          </div>

          {/* Eyebrow */}
          <p
            className="animate-sand-drift landing-eyebrow"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#C4A35A',
              marginBottom: 28,
              animationDelay: '200ms',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            ORACLE.FREMN.COM · INITIALIZED
          </p>

          {/* FREMN wordmark */}
          <h1
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: 'clamp(52px, 10vw, 120px)',
              fontWeight: 400,
              color: '#FDF6E3',
              letterSpacing: '0.15em',
              lineHeight: 1,
              margin: 0,
              animation: 'fadeSlideUp 800ms ease-out 400ms forwards, flicker 8s ease-in-out infinite',
              opacity: 0,
            }}
          >
            FREMN
          </h1>

          {/* ORACLE gradient wordmark */}
          <p
            className="spice-gradient-text"
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: 'clamp(13px, 2vw, 22px)',
              fontWeight: 400,
              letterSpacing: '0.6em',
              lineHeight: 1,
              marginTop: 4,
              animation: 'fadeSlideUp 800ms ease-out 600ms forwards',
              opacity: 0,
            }}
          >
            ORACLE
          </p>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 36,
              background: '#8B6914',
              margin: '14px auto',
              animation: 'fadeSlideUp 800ms ease-out 700ms forwards',
              opacity: 0,
            }}
          />

          {/* Declaration */}
          <p
            style={{
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 2vw, 20px)',
              color: '#E8D5A3',
              maxWidth: 460,
              lineHeight: 1.7,
              animation: 'fadeSlideUp 800ms ease-out 800ms forwards',
              opacity: 0,
              padding: '0 8px',
            }}
          >
            The desert remembers all dilemmas. The spice reveals all paths.
          </p>

          {/* CTA */}
          <div
            style={{
              marginTop: 28,
              animation: 'fadeSlideUp 800ms ease-out 1000ms forwards, glowPulse 4s ease-in-out infinite',
              opacity: 0,
            }}
          >
            <Link href="/oracle" className="cta-btn" onClick={playClick}>
              Seek Counsel
            </Link>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute"
            style={{
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C4A35A',
              animation: 'pulseGlow 2s ease-in-out infinite',
              whiteSpace: 'nowrap',
            }}
          >
            ↓ descend
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROPHECY STRIP ── */}
      <section style={{ background: '#15130f', height: 56, overflow: 'hidden', position: 'relative' }}>
        <div
          className="absolute pointer-events-none"
          style={{ left: 0, top: 0, bottom: 0, width: 80, zIndex: 10, background: 'linear-gradient(to right, #15130f, transparent)' }}
        />
        <div
          className="absolute pointer-events-none"
          style={{ right: 0, top: 0, bottom: 0, width: 80, zIndex: 10, background: 'linear-gradient(to left, #15130f, transparent)' }}
        />
        <div
          className="animate-marquee"
          style={{ display: 'flex', alignItems: 'center', height: '100%', whiteSpace: 'nowrap', width: 'max-content' }}
        >
          {[...PROVERBS, ...PROVERBS].map((p, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: '0.875rem', color: '#C4A35A', padding: '0 40px' }}>
                {p}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#8B6914', padding: '0 12px' }}>·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: THREE PILLARS ── */}
      <section data-reveal className="landing-pillars-section-pad" style={{ background: '#0A0806' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p
            data-reveal
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C4A35A', marginBottom: 48 }}
          >
            WHAT THE ORACLE OFFERS
          </p>

          <div className="landing-pillars-grid">
            {/* Pillar I */}
            <div data-reveal className="pillar-card pillar-card-1" style={{ background: '#1E1B17', padding: '40px 40px 40px 40px' }}>
              <p className="pillar-numeral" style={{ fontFamily: 'var(--font-cinzel)', fontSize: 56, color: '#8B6914', lineHeight: 1, marginBottom: 20 }}>I</p>
              <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.375rem', color: '#FDF6E3', letterSpacing: '0.1em', marginBottom: 14 }}>The Prophecy</h3>
              <p style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: '1.0625rem', color: '#E8D5A3', lineHeight: 1.7 }}>
                Speak your dilemma into the void. The Kwisatz Haderach sees across all possible timelines, returning counsel shaped by the ancient wisdom of the Fremen and the political acuity of the Great Houses.
              </p>
              <div className="pillar-accent" style={{ width: 40, height: 2, background: '#EF9F27', marginTop: 28 }} />
            </div>

            {/* Pillar II */}
            <div data-reveal className="pillar-card pillar-card-2" style={{ background: '#15130f', padding: '40px 28px' }}>
              <p className="pillar-numeral" style={{ fontFamily: 'var(--font-cinzel)', fontSize: 56, color: '#8B6914', lineHeight: 1, marginBottom: 20 }}>II</p>
              <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.125rem', color: '#FDF6E3', letterSpacing: '0.1em', marginBottom: 14 }}>Spice Probability</h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#E8D5A3', lineHeight: 1.7 }}>
                Three scores, reasoned from your situation across possible futures: success odds, risk exposure, and spice yield — the measure of your opportunity.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
                <div style={{ height: 3, background: '#EF9F27', width: '72%' }} />
                <div style={{ height: 3, background: '#D85A30', width: '45%' }} />
                <div style={{ height: 3, background: '#1D9E75', width: '88%' }} />
              </div>
            </div>

            {/* Pillar III */}
            <div data-reveal className="pillar-card pillar-card-3" style={{ background: '#0A0806', padding: '40px 28px' }}>
              <p className="pillar-numeral" style={{ fontFamily: 'var(--font-cinzel)', fontSize: 56, color: '#8B6914', lineHeight: 1, marginBottom: 20 }}>III</p>
              <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.125rem', color: '#FDF6E3', letterSpacing: '0.1em', marginBottom: 14 }}>Choose Your House</h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#E8D5A3', lineHeight: 1.7 }}>
                Your House shapes the Oracle's counsel. Atreides brings honour. Harkonnen brings efficiency. Fremen brings survival. Same question, three different paths.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <div style={{ width: 8, height: 8, background: '#1E6FA8' }} />
                <div style={{ width: 8, height: 8, background: '#8B1A1A' }} />
                <div style={{ width: 8, height: 8, background: '#C4A35A' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOUSE PANELS ── */}
      <section data-reveal style={{ overflow: 'hidden' }}>
        <div className="landing-house-grid">
          {HOUSE_PANELS.map(h => (
            <div
              key={h.name}
              className="house-panel"
              style={{
                background: h.bg,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 32px',
                textAlign: 'center',
              }}
            >
              {/* Left edge on desktop, top edge on mobile */}
              <div className="house-edge-left" style={{ background: h.edgeColor }} />
              <div className="house-edge-top" style={{ background: h.edgeColor }} />

              <div style={{ marginBottom: 12 }}><h.Glyph color={h.glyphColor} /></div>
              <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', letterSpacing: '0.2em', color: '#FDF6E3', margin: '0 0 8px' }}>{h.name}</h3>
              <p style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: '0.875rem', color: '#C4A35A', marginBottom: 14 }}>{h.words}</p>
              <div style={{ width: 1, height: 20, background: h.edgeLine, margin: '0 auto 14px' }} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#E8D5A3', lineHeight: 1.7, maxWidth: 200 }}>{h.desc}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: h.tagColor, marginTop: 20, textTransform: 'uppercase' }}>{h.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: ORACLE IN ACTION ── */}
      <section data-reveal className="landing-section-pad" style={{ background: '#1E1B17' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p data-reveal style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C4A35A', textAlign: 'center', marginBottom: 14 }}>
            THE ORACLE IN SESSION
          </p>
          <p data-reveal style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: '1.25rem', color: '#E8D5A3', textAlign: 'center', marginBottom: 48 }}>
            A consultation, rendered.
          </p>

          <div data-reveal className="ghost-border landing-mockup" style={{ maxWidth: 720, margin: '0 auto', background: '#0A0806' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#C4A35A', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(77,70,57,0.15)' }}>
              CONSULTATION · HOUSE ATREIDES · GOM JABBAR: INACTIVE
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#C4A35A', marginBottom: 6 }}>The seeker&apos;s dilemma:</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#FDF6E3', marginBottom: 24 }}>
              My co-founder wants to raise a Series A now. I believe we need six more months of product iteration. The investors are ready. Am I wrong?
            </p>
            <div style={{ borderLeft: '2px solid #EF9F27', paddingLeft: 14, marginBottom: 24 }}>
              <p style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: '1.0625rem', color: '#FDF6E3', lineHeight: 1.7 }}>
                The stillsuit must be worn before the crossing begins, not after thirst arrives. Your instinct to fortify the foundation before expansion mirrors the Fremen way — water discipline before the long march. Yet the spice does not wait for the perfect moment. The question is not whether you are ready, but whether the delay has a cost greater than the risk.
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A35A', marginBottom: 14 }}>
              SPICE PROBABILITY ACROSS TIMELINES
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Success odds', width: '68%', color: '#EF9F27', value: '68%' },
                { label: 'Risk level', width: '42%', color: '#D85A30', value: '42%' },
                { label: 'Spice yield', width: '81%', color: '#1D9E75', value: '81%' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#E8D5A3', width: 90, flexShrink: 0 }}>{s.label}</span>
                  <div style={{ flex: 1, height: 6, background: '#2C2A25' }}>
                    <div style={{ width: s.width, height: '100%', background: s.color }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: s.color, width: 36, textAlign: 'right' }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(77,70,57,0.15)', margin: '20px 0' }} />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C4A35A', textAlign: 'center', marginBottom: 10 }}>
              — THE FREMEN VERDICT —
            </p>
            <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.125rem', color: '#FDF6E3', textAlign: 'center', marginBottom: 20 }}>
              The maker hooks are set. Choose when to ride, not whether.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span className="ghost-border" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#E8D5A3', padding: '8px 14px' }}>Ascertained.</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#C4A35A', padding: '8px 0' }}>Initialize New Consultation</span>
            </div>
          </div>

          <p data-reveal style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#C4A35A', textAlign: 'center', marginTop: 28, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ACTUAL OUTPUT · RENDERED AT oracle.fremn.com
          </p>
        </div>
      </section>

      {/* ── SECTION 6: THE TESTAMENT ── */}
      <section data-reveal className="landing-section-pad" style={{ background: '#0A0806' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p data-reveal style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C4A35A', textAlign: 'center', marginBottom: 56 }}>
            FROM THE CHRONICLES OF THOSE WHO SOUGHT
          </p>
          <div className="landing-testament-grid">
            {TESTAMENTS.map((t, i) => (
              <div
                key={i}
                data-reveal
                className={`testament-card ${t.bg === '#0A0806' ? 'testament-card-dark' : 'testament-card-light'}`}
                style={{ background: t.bg, padding: '36px 32px' }}
              >
                <div className="testament-qmark" style={{ fontFamily: 'var(--font-cinzel)', fontSize: 72, color: '#8B6914', lineHeight: 1, opacity: 0.4, marginBottom: -28 }}>&ldquo;</div>
                <p style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: '1rem', color: '#E8D5A3', lineHeight: 1.7, marginTop: 0 }}>{t.quote}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#C4A35A', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 20 }}>{t.by}</p>
                <div style={{ width: 24, height: 2, background: t.accent, marginTop: 14 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FINAL INVOCATION ── */}
      <section style={{ height: '100vh', minHeight: 560, background: '#0A0806', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #0A0806 100%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, rgba(139,105,20,0.04), transparent)' }} />

        <div className="relative flex flex-col items-center justify-center h-full text-center" style={{ zIndex: 10, padding: '0 20px' }}>
          <p data-reveal style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C4A35A', marginBottom: 28 }}>
            THE PATH AWAITS
          </p>
          <div data-reveal>
            <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(28px, 6vw, 72px)', color: '#FDF6E3', lineHeight: 1.2, letterSpacing: '0.05em', maxWidth: 640, margin: '0 auto' }}>
              The Golden Path
            </h2>
            <h2 className="spice-gradient-text" style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(28px, 6vw, 72px)', lineHeight: 1.2, letterSpacing: '0.05em', maxWidth: 640, margin: '0 auto' }}>
              is already written.
            </h2>
          </div>
          <p data-reveal style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', color: '#E8D5A3', maxWidth: 420, lineHeight: 1.8, marginTop: 28 }}>
            Every great decision has been faced before. In other deserts. By other seekers. The spice remembers. Consult the Oracle.
          </p>
          <div data-reveal style={{ marginTop: 36 }}>
            <Link href="/oracle" className="cta-btn" onClick={playClick}>
              Initialize Consultation
            </Link>
          </div>
          <p data-reveal style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#C4A35A', marginTop: 14, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            oracle.fremn.com · See the vision
          </p>
        </div>

        <div className="absolute" style={{ bottom: 24, right: 20, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8B6914', opacity: 0.4 }}>
          23.418°N · 41.234°E · ARRAKIS
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#15130f', padding: '28px 0' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 landing-footer-inner">
          <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.875rem', color: '#C4A35A', letterSpacing: '0.2em' }}>
            FREMN · ORACLE
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8B6914', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Built during the Vibeathon · Arrakis, Dune, Desert Planet
          </span>
          <Link
            href="/oracle"
            onClick={playClick}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C4A35A', letterSpacing: '0.15em', textDecoration: 'none', transition: 'color 200ms ease' }}
          >
            oracle.fremn.com
          </Link>
        </div>
      </footer>
    </div>
  );
}
