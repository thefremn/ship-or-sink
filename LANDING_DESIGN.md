# FREMN Oracle — Landing Page Design Document
**Route:** `fremn.com` (root domain)  
**Design System:** The Obsidian Chronicle  
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS  
**CTA Destination:** `oracle.fremn.com`  
**Rule:** Three Chronicle laws apply to every element. 0px radius. No border sectioning. No pure white.

---

## 0. Page Philosophy

This is not a marketing page. It is a **monument**.

The landing page exists to create a single emotional response in the visitor: *awe*. Not excitement. Not curiosity. Awe — the feeling of standing at the edge of something ancient and vast. The user should feel the weight of the desert before they ever type a word into the Oracle.

The page is structured as a **descent** — each section pulls the user deeper into the world, from the vastness of space/desert at the top, down into the intimacy of the Oracle at the bottom. The CTA is not a button — it is an invitation to a ritual.

**Tone of all copy:** The Bene Gesserit would approve. Authoritative. Elliptical. Every word chosen.

---

## 1. Full Page Structure

```
┌──────────────────────────────────────────────────────┐
│  SECTION 1 — THE VOID HERO                           │
│  Full viewport. Particle field bg. Logo + declaration│
│  Primary CTA: "Seek Counsel"                         │
├──────────────────────────────────────────────────────┤
│  SECTION 2 — THE PROPHECY STRIP                      │
│  Full-width. Horizontally scrolling Fremen proverbs  │
├──────────────────────────────────────────────────────┤
│  SECTION 3 — THE THREE PILLARS                       │
│  What the Oracle offers. Asymmetric 3-column layout  │
├──────────────────────────────────────────────────────┤
│  SECTION 4 — CHOOSE YOUR HOUSE                       │
│  Atreides / Harkonnen / Fremen. Full bleed panels    │
├──────────────────────────────────────────────────────┤
│  SECTION 5 — THE ORACLE IN ACTION                    │
│  Static mockup of a real consultation. No carousel   │
├──────────────────────────────────────────────────────┤
│  SECTION 6 — THE TESTAMENT                           │
│  3 "testimonial" quotes in Fremen voice              │
├──────────────────────────────────────────────────────┤
│  SECTION 7 — THE FINAL INVOCATION                    │
│  Full-viewport closing CTA. The ritual begins here.  │
├──────────────────────────────────────────────────────┤
│  FOOTER                                              │
│  Minimal. Coordinates. FREMN wordmark.               │
└──────────────────────────────────────────────────────┘
```

---

## 2. Shared Rules (All Sections)

- **Background base:** `bg-void-900` (`#0A0806`) — the void is the canvas
- **Sectioning:** background color shifts only, never borders or dividers
- **Max content width:** `max-w-6xl mx-auto px-6` on desktop, `px-4` on mobile
- **Border-radius:** 0px on every component without exception
- **Text hierarchy:** Cinzel for display, Crimson Text for editorial body, Inter for functional labels
- **Transitions:** minimum 200ms UI elements, 600ms page-level reveals. No 150ms snaps.
- **Scroll reveals:** every section animates in with `fadeSlideUp` (600ms ease-out) when it enters the viewport. Use `IntersectionObserver`.

---

## 3. Additional Tailwind Keyframes (add to existing config)

```ts
// Extend the keyframes from DESIGN.md with these additions:
keyframes: {
  // ...existing fadeSlideUp, pulseGlow, barFill...

  marquee: {
    '0%':   { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-50%)' },
  },
  sandDrift: {
    '0%':   { opacity: '0', transform: 'translateX(-12px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  glowPulse: {
    '0%, 100%': { boxShadow: '0 0 0px 0px rgba(196, 163, 90, 0)' },
    '50%':      { boxShadow: '0 0 40px 4px rgba(196, 163, 90, 0.12)' },
  },
  flicker: {
    '0%, 100%': { opacity: '1' },
    '92%':      { opacity: '1' },
    '93%':      { opacity: '0.4' },
    '94%':      { opacity: '1' },
    '96%':      { opacity: '0.6' },
    '97%':      { opacity: '1' },
  },
  scanline: {
    '0%':   { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(100vh)' },
  },
},
animation: {
  // ...existing...
  'marquee':     'marquee 30s linear infinite',
  'sand-drift':  'sandDrift 600ms ease-out forwards',
  'glow-pulse':  'glowPulse 4s ease-in-out infinite',
  'flicker':     'flicker 8s ease-in-out infinite',
  'scanline':    'scanline 6s linear infinite',
},
```

---

## 4. Section-by-Section Specifications

---

### SECTION 1 — The Void Hero

**Role:** First impression. Full viewport. The desert before language.

```
Height: 100vh, min-height: 700px
Background: bg-void-900

BACKGROUND LAYER (behind all content):
  Canvas element filling 100% width/height
  Particle field: ~180 tiny dots (1–2px), color sand-400 at 20–40% opacity
  Particles drift slowly (random direction, 0.1–0.3px/frame, wrap at edges)
  Implement with requestAnimationFrame in a useEffect
  On mobile: reduce to 80 particles

SCANLINE OVERLAY (CSS only, above canvas):
  position: absolute, inset 0, pointer-events: none, z-index: 2
  Thin horizontal line (1px, sand-400 at 3% opacity) moving top → bottom
  animation: scanline 6s linear infinite
  Gives a "ancient CRT / holographic" feeling

CONTENT (z-index: 10, centered):
  flex flex-col items-center justify-center h-full text-center gap-6

  ── EYEBROW LINE ──
  font-mono text-[11px] uppercase tracking-[0.4em] text-sand-400
  Content: "ORACLE.FREMN.COM · INITIALIZED"
  Appears with animation: sand-drift, delay 200ms

  ── MAIN WORDMARK ──
  Two lines, stacked, no gap between:

  Line 1 "FREMN":
    font-cinzel text-[clamp(64px,10vw,120px)] font-normal text-sand-50
    tracking-[0.15em] leading-none
    animation: fadeSlideUp 800ms ease-out forwards, delay 400ms
    animation: flicker 8s ease-in-out infinite  ← layered, creates hologram effect

  Line 2 "ORACLE":
    font-cinzel text-[clamp(14px,2vw,22px)] font-normal
    tracking-[0.6em] leading-none
    background: bg-spice-gradient
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
    (The gradient text effect — the ONE place gradient text is used)
    animation: fadeSlideUp 800ms ease-out forwards, delay 600ms

  ── DIVIDER ──
  width: 1px (vertical line), height: 40px, bg-sand-600
  margin: 8px auto
  animation: fadeSlideUp, delay 700ms

  ── DECLARATION ──
  font-crimson italic text-[clamp(16px,2vw,20px)] text-sand-200
  max-width: 480px, line-height: 1.7
  Content: "The desert remembers all dilemmas. The spice reveals all paths."
  animation: fadeSlideUp 800ms ease-out forwards, delay 800ms

  ── PRIMARY CTA ──
  display: inline-block, margin-top: 32px
  animation: fadeSlideUp 800ms ease-out forwards, delay 1000ms

  Button outer wrapper (the "glow" frame):
    position: relative
    animation: glow-pulse 4s ease-in-out infinite

  Button:
    font-cinzel text-sm tracking-[0.25em] uppercase
    bg-spice-gradient text-on-primary
    px-10 py-4, border-radius: 0px
    NO hover background change — instead: translateY(-2px) on hover (weightlessness)
    transition: transform 200ms ease
    href="https://oracle.fremn.com"
    Label: "Seek Counsel"

  ── SCROLL INDICATOR ──
  position: absolute, bottom: 32px, left: 50%, transform: translateX(-50%)
  font-mono text-[10px] uppercase tracking-[0.3em] text-sand-400
  Content: "↓ descend"
  animation: pulseGlow 2s ease-in-out infinite
```

---

### SECTION 2 — The Prophecy Strip

**Role:** A moment of texture between sections. No heading. Pure atmosphere.

```
Background: bg-surface (#15130f) — tonal shift from void-900, no border
Height: 56px, overflow: hidden
position: relative

CONTENT:
  Infinite horizontal marquee of Fremen proverbs, separator glyphs between each.
  Two identical copies of the list rendered back-to-back (classic CSS marquee trick).
  animation: marquee 30s linear infinite
  Pause on hover: animation-play-state: paused

  Each proverb:
    font-crimson italic text-sm text-sand-400
    padding: 0 48px
    display: inline-block

  Separator between proverbs:
    "·" — font-mono text-sand-600, padding: 0 16px

PROVERBS LIST:
  "The desert does not forgive the unprepared."
  "He who controls the spice controls the universe."
  "Survival is the ability to swim in strange water."
  "The slow blade penetrates the shield."
  "Without change, something sleeps inside us."
  "I must not fear. Fear is the mind-killer."
  "The vision of time is broad, but when you pass through it, time becomes a narrow door."
  "Seek freedom and become captive of your desires."
  "There is no real ending. It is only the place where you stop the story."

LEFT & RIGHT FADE EDGES (CSS):
  Two absolute-positioned divs, left: 0 and right: 0
  width: 120px, height: 100%
  background: linear-gradient(to right, #15130f, transparent) — left
  background: linear-gradient(to left, #15130f, transparent) — right
  pointer-events: none, z-index: 10
```

---

### SECTION 3 — The Three Pillars

**Role:** What the Oracle does. Asymmetric, editorial. Feels like a scripture layout.

```
Background: bg-void-900
Padding: 120px 0 on desktop, 80px 0 on mobile

SECTION EYEBROW:
  font-mono text-[11px] uppercase tracking-[0.4em] text-sand-400
  Content: "WHAT THE ORACLE OFFERS"
  margin-bottom: 64px, text-left on desktop

PILLARS GRID:
  CSS Grid — NOT equal columns. Intentionally asymmetric.
  Desktop: grid-template-columns: 2fr 1fr 1fr  (first pillar dominates)
  Mobile: grid-template-columns: 1fr (stack)
  gap: 0 (no gap — tonal shift creates separation)
  align-items: start

  PILLAR 1 — THE PROPHECY (wide column):
    Background: bg-surface-low (#1E1B17) — tonal lift
    Padding: 48px
    border-right: none (no borders — the bg shift is the separator)

    Glyph (top):
      font-cinzel text-[64px] text-sand-600 leading-none
      Content: "I"  (Roman numeral)
      margin-bottom: 24px

    Title:
      font-cinzel text-2xl text-sand-50 tracking-[0.1em] mb-4
      Content: "The Prophecy"

    Body:
      font-crimson italic text-lg text-sand-200 leading-relaxed
      Content: "Speak your dilemma into the void. The Kwisatz Haderach sees across
      all possible timelines, returning counsel shaped by the ancient wisdom of
      the Fremen and the political acuity of the Great Houses."

    Bottom accent:
      width: 40px, height: 2px, bg-spice-amber
      margin-top: 32px

  PILLAR 2 — THE SCORES (narrow):
    Background: bg-surface (#15130f) — slightly lighter than void, darker than surface-low
    Padding: 48px 32px

    Glyph: "II" — same style as above, text-sand-600

    Title:
      font-cinzel text-xl text-sand-50 tracking-[0.1em] mb-4
      Content: "Spice Probability"

    Body:
      font-sans text-sm text-sand-200 leading-relaxed
      Content: "Three scores, reasoned from your situation across possible futures:
      success odds, risk exposure, and spice yield — the measure of your opportunity."

    Mini score preview (decorative, not interactive):
      Three small bars in spice-amber, spice-coral, spice-teal
      Widths: 72%, 45%, 88% (static, illustrative)
      height: 3px each, gap: 8px, margin-top: 24px

  PILLAR 3 — THE HOUSES (narrow):
    Background: bg-void-900 — drops back to base, creating the deepest tonal contrast
    Padding: 48px 32px

    Glyph: "III" — same style, text-sand-600

    Title:
      font-cinzel text-xl text-sand-50 tracking-[0.1em] mb-4
      Content: "Choose Your House"

    Body:
      font-sans text-sm text-sand-200 leading-relaxed
      Content: "Your House shapes the Oracle's counsel. Atreides brings honour.
      Harkonnen brings efficiency. Fremen brings survival. Same question, three
      different paths."

    House dots (decorative):
      Three 8px squares (not circles — 0px radius rule), gap: 8px, margin-top: 24px
      bg-atreides, bg-harkonnen, bg-fremen-gold
```

---

### SECTION 4 — Choose Your House

**Role:** The most visually dramatic section. Three full-bleed panels side by side.

```
Background: none (panels ARE the background)
Height: 480px on desktop, auto (stacked) on mobile
overflow: hidden

THREE PANELS side by side (CSS Grid: 1fr 1fr 1fr):

  SHARED PANEL RULES:
    Height: 100%, overflow: hidden
    position: relative
    Cursor: default (not clickable — this is informational)
    No border between panels — abrupt color cut is intentional

  ATREIDES PANEL:
    Background: linear-gradient(160deg, #0D1F30 0%, #0A0806 100%)
      (very dark blue-void — House Atreides blue tinted)
    Content (centered vertically, padding: 48px):
      House glyph: "⚔" rendered as inline SVG or Unicode, 32px, color: #1E6FA8 at 60%
      House name: font-cinzel text-3xl tracking-[0.2em] text-sand-50 mt-4
        Content: "ATREIDES"
      House words: font-crimson italic text-sm text-sand-400 mt-2
        Content: "Strength and Justice"
      Divider: 1px wide, 24px tall vertical line, bg-atreides at 40%, my-4
      Description: font-sans text-xs text-sand-200 leading-relaxed max-w-[180px] text-center
        Content: "The Oracle speaks in legacy and honour. Your counsel is measured
        in generations, not quarters."
      Bottom tag: font-mono text-[10px] uppercase tracking-[0.3em] text-atreides mt-6
        Content: "NOBLE · LONG-TERM · HONOURED"

    Left edge: 2px solid bg-atreides at 30% (vertical accent, position absolute left-0)

  HARKONNEN PANEL:
    Background: linear-gradient(160deg, #1A0808 0%, #0A0806 100%)
      (deep red-void)
    Content: same structure as Atreides
      House glyph color: #8B1A1A at 60%
      House name: "HARKONNEN"
      House words: "Power and Efficiency"
      Description: "The Oracle strips sentiment. Your counsel is measured in
      leverage, elimination of weakness, and the cold arithmetic of power."
      Bottom tag: "RUTHLESS · EFFICIENT · ABSOLUTE"
      Left edge: bg-harkonnen at 30%

  FREMEN PANEL:
    Background: linear-gradient(160deg, #1A1408 0%, #0A0806 100%)
      (warm sand-void)
    Content: same structure
      House glyph color: #C4A35A at 60%
      House name: "FREMEN"
      House words: "Survival and Adaptation"
      Description: "The Oracle speaks in resources and discipline. Your counsel
      is measured in water, in endurance, and the wisdom of the deep desert."
      Bottom tag: "ADAPTIVE · SCARCE · UNBROKEN"
      Left edge: bg-fremen-gold at 30%

MOBILE (< 768px):
  Stack panels vertically, height: 220px each
  Full width, left edge becomes top edge (2px horizontal line at top of each panel)
```

---

### SECTION 5 — The Oracle in Action

**Role:** Show, don't tell. A static mockup of a real consultation. No animation, no carousel.

```
Background: bg-surface-low (#1E1B17) — tonal lift from void, no border
Padding: 120px 0

SECTION EYEBROW:
  font-mono text-[11px] uppercase tracking-[0.4em] text-sand-400 text-center mb-4
  Content: "THE ORACLE IN SESSION"

SECTION SUBTITLE:
  font-crimson italic text-xl text-sand-200 text-center mb-16
  Content: "A consultation, rendered."

MOCKUP CONTAINER:
  max-width: 720px, margin: 0 auto
  background: bg-void-900 — drops back to base (tonal contrast)
  padding: 48px
  ghost-border (outline-variant at 15%)

  MOCK QUERY BAR (top):
    font-mono text-xs text-sand-400 mb-6
    Content: "CONSULTATION · HOUSE ATREIDES · GOM JABBAR: INACTIVE"
    Followed by ghost-border border-b

  MOCK DILEMMA:
    font-sans text-sm text-sand-400 mb-2
    Content: "The seeker's dilemma:"
    font-sans text-base text-sand-50 mb-8
    Content: "My co-founder wants to raise a Series A now. I believe we need
    six more months of product iteration. The investors are ready. Am I wrong?"

  MOCK PROPHECY (the Oracle's response):
    border-l-2 border-spice-amber pl-4 mb-8
    font-crimson italic text-lg text-sand-50 leading-relaxed
    Content: "The stillsuit must be worn before the crossing begins, not after
    thirst arrives. Your instinct to fortify the foundation before expansion
    mirrors the Fremen way — water discipline before the long march. Yet the
    spice does not wait for the perfect moment. The question is not whether
    you are ready, but whether the delay has a cost greater than the risk."

  MOCK SCORES (three bars, static widths):
    Section label: font-sans text-[11px] uppercase tracking-[0.2em] text-sand-400 mb-4
    Content: "SPICE PROBABILITY ACROSS TIMELINES"

    Row 1 — Success odds:
      label: "Success odds" — font-sans text-xs text-sand-200, w-32
      bar track: h-1.5 bg-surface-high flex-1
      bar fill: w-[68%] h-full bg-spice-amber
      value: "68%" — font-mono text-sm text-spice-amber w-12 text-right

    Row 2 — Risk level:
      bar fill: w-[42%] bg-spice-coral
      value: "42%" text-spice-coral

    Row 3 — Spice yield:
      bar fill: w-[81%] bg-spice-teal
      value: "81%" text-spice-teal

  GHOST DIVIDER between scores and verdict: ghost-border border-t my-6

  MOCK VERDICT:
    Label: font-sans text-[10px] uppercase tracking-[0.3em] text-sand-400 text-center mb-3
    Content: "— THE FREMEN VERDICT —"
    Verdict: font-cinzel text-xl text-sand-50 text-center
    Content: "The maker hooks are set. Choose when to ride, not whether."

  MOCK ACTIONS ROW:
    flex justify-center gap-4 mt-6
    Two static ghost buttons (not clickable — illustrative):
      "Ascertained." — font-sans text-xs text-sand-200 ghost-border px-4 py-2
      "Initialize New Consultation" — font-sans text-xs text-sand-400

CAPTION BELOW MOCKUP:
  font-mono text-[11px] text-sand-400 text-center mt-8 tracking-[0.2em]
  Content: "ACTUAL OUTPUT · RENDERED AT oracle.fremn.com"
```

---

### SECTION 6 — The Testament

**Role:** Social proof, but in-world. Three "seekers" who consulted the Oracle.

```
Background: bg-void-900
Padding: 120px 0

SECTION EYEBROW:
  font-mono text-[11px] uppercase tracking-[0.4em] text-sand-400 text-center mb-16
  Content: "FROM THE CHRONICLES OF THOSE WHO SOUGHT"

TESTAMENT GRID:
  Three columns on desktop (grid-cols-3 gap-0), stacked on mobile
  No gap between cards — tonal shift separates them

  Each testament card:
    Alternating backgrounds: surface-low / void-900 / surface-low
    padding: 40px 36px
    NO border (Chronicle rule)

    Quote mark:
      font-cinzel text-[80px] text-sand-600 leading-none opacity-40
      Content: """  (decorative, top of card)
      margin-bottom: -32px (overlaps into quote text for drama)

    Quote text:
      font-crimson italic text-base text-sand-200 leading-relaxed
      Each quote should feel like it came from a real person with a real decision:

      Card 1: "I was certain the acquisition was wrong. The Oracle confirmed what
      I could not say aloud — the risk was not the deal, it was the timing.
      We walked away. Three months later, the buyer's company collapsed."

      Card 2: "I chose Harkonnen. The Oracle was merciless. It told me my
      co-founder was a liability before I had the courage to admit it myself.
      The Fremen Verdict was four words. I printed it. I still have it."

      Card 3: "The spice yield score was 91%. I had never felt so certain about
      anything uncertain. I shipped the product. We found product-market fit
      in seven weeks."

    Attribution:
      margin-top: 24px
      font-mono text-[11px] text-sand-400 uppercase tracking-[0.2em]
      Content (each): "SEEKER · HOUSE ATREIDES", "SEEKER · HOUSE HARKONNEN",
      "SEEKER · HOUSE FREMEN"

    House accent line (bottom of card):
      width: 24px, height: 2px
      bg-atreides / bg-harkonnen / bg-fremen-gold respectively
      margin-top: 16px
```

---

### SECTION 7 — The Final Invocation

**Role:** Closing CTA. Full viewport. Mirror of the hero, but darker — the ritual culminates here.

```
Height: 100vh, min-height: 600px
Background: bg-void-900
position: relative, overflow: hidden

BACKGROUND VIGNETTE (CSS only):
  position: absolute, inset: 0
  background: radial-gradient(ellipse at center, transparent 30%, #0A0806 100%)
  Adds darkness at the edges — focus collapses to center
  pointer-events: none

CONTENT (centered):
  flex flex-col items-center justify-center h-full text-center gap-6

  EYEBROW:
    font-mono text-[11px] uppercase tracking-[0.4em] text-sand-400
    Content: "THE PATH AWAITS"
    animation: fadeSlideUp on scroll-enter

  MAIN HEADLINE:
    font-cinzel text-[clamp(32px,6vw,72px)] text-sand-50 leading-tight
    tracking-[0.05em] max-width: 640px
    Two lines:
      Line 1: "The Golden Path"
      Line 2: gradient text (same technique as hero ORACLE wordmark)
              bg-spice-gradient -webkit-background-clip text
              Content: "is already written."
    animation: fadeSlideUp 800ms ease-out forwards, staggered lines

  BODY:
    font-crimson italic text-lg text-sand-200 max-width: 440px line-height: 1.8
    Content: "Every great decision has been faced before. In other deserts.
    By other seekers. The spice remembers. Consult the Oracle."
    animation: fadeSlideUp, delay 400ms

  CTA BUTTON (same as hero — identical spec):
    animation: glow-pulse 4s ease-in-out infinite + fadeSlideUp delay 600ms
    Label: "Initialize Consultation"
    href: "https://oracle.fremn.com"
    (Chronicle microcopy: "Initialize", not "Start" or "Begin")

  SUB-LINK below button:
    font-mono text-[11px] text-sand-400 mt-4 tracking-[0.2em] uppercase
    Content: "oracle.fremn.com · No account required"
    No underline by default — underline on hover, transition 200ms

DECORATIVE COORDINATES (bottom-right, position absolute):
  font-mono text-[10px] text-sand-600 opacity-40
  Content: "23.418°N · 41.234°E · ARRAKIS"  (fake Dune coordinates)
  bottom: 32px, right: 32px
```

---

### FOOTER

**Role:** Minimal. A coordinate stamp on a monolith, not a site footer.

```
Background: bg-surface (#15130f) — tonal lift from void
Padding: 32px 0

CONTENT:
  max-w-6xl mx-auto px-6
  flex justify-between items-center (desktop)
  flex-col gap-4 text-center (mobile)

  LEFT:
    font-cinzel text-sm text-sand-400 tracking-[0.2em]
    Content: "FREMN · ORACLE"

  CENTER:
    font-mono text-[10px] text-sand-600 tracking-[0.2em] uppercase
    Content: "Built during the Vibeathon · Arrakis, Dune, Desert Planet"

  RIGHT:
    font-mono text-[10px] text-sand-400 tracking-[0.15em]
    Content: "oracle.fremn.com"
    hover: text-sand-200, transition 200ms
    link to oracle.fremn.com

NO: social icons, navigation links, legal text, copyright notices.
The footer is a seal, not a menu.
```

---

## 5. Scroll Reveal Implementation

```tsx
// hooks/useScrollReveal.ts
// Use IntersectionObserver to add 'revealed' class when element enters viewport.
// All sections start with opacity-0 translate-y-2 and transition to animate-fade-slide-up.

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate-fade-slide-up')
        e.target.classList.remove('opacity-0')
        observer.unobserve(e.target)  // fire once only
      }
    }),
    { threshold: 0.15 }
  )
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
  return () => observer.disconnect()
}, [])

// Usage: add data-reveal and opacity-0 to any element that should animate in on scroll
```

---

## 6. Particle Field Implementation (Hero)

```tsx
// components/ParticleField.tsx
// Canvas element, absolute fill, z-index: 1, pointer-events: none

useEffect(() => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const particles = Array.from({ length: isMobile ? 80 : 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.5,     // 0.5–2px
    opacity: Math.random() * 0.2 + 0.05, // 5–25% opacity
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
  }))

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(196, 163, 90, ${p.opacity})` // sand-400
      ctx.fill()
      p.x = (p.x + p.vx + canvas.width)  % canvas.width
      p.y = (p.y + p.vy + canvas.height) % canvas.height
    })
    requestAnimationFrame(draw)
  }
  draw()
}, [])
```

---

## 7. Responsive Breakpoints

| Section | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (<768px) |
|---|---|---|---|
| Hero wordmark | clamp(64px,10vw,120px) | clamp(48px,8vw,80px) | 56px fixed |
| Three Pillars | 2fr 1fr 1fr grid | 1fr 1fr stack | 1fr stack |
| House Panels | 3 cols, 480px tall | 3 cols, 320px tall | 1 col, 220px each |
| Oracle Mockup | 720px max, 48px pad | full width, 32px pad | full width, 20px pad |
| Testament | 3 cols | 1 col | 1 col |
| Final CTA headline | clamp(32px,6vw,72px) | 48px | 32px |
| Particle count | 180 | 120 | 80 |

---

## 8. Performance Notes for Claude Code

- The particle canvas must use `will-change: transform` and run on its own layer
- All `data-reveal` elements start `opacity-0` — ensure no flash of unstyled content
- Marquee uses CSS animation, not JS scroll — no layout thrash
- Google Fonts load via `next/font/google` — no external stylesheet requests
- The scanline overlay is CSS-only — no JS
- Images: there are no images on this page. All visuals are CSS and canvas only.
- Gradient text (`-webkit-background-clip: text`) — add fallback `color: sand-50` for browsers that don't support it

---

## 9. Copy Reference (All Final Text)

```
HERO:
  Eyebrow:     "ORACLE.FREMN.COM · INITIALIZED"
  Wordmark:    "FREMN" / "ORACLE"
  Declaration: "The desert remembers all dilemmas. The spice reveals all paths."
  CTA:         "Seek Counsel"

PROPHECY STRIP: [see proverbs list in Section 2]

THREE PILLARS:
  Eyebrow:     "WHAT THE ORACLE OFFERS"
  P1 title:    "The Prophecy"
  P2 title:    "Spice Probability"
  P3 title:    "Choose Your House"

HOUSE PANELS:
  Atreides:   "ATREIDES" / "Strength and Justice" / "NOBLE · LONG-TERM · HONOURED"
  Harkonnen:  "HARKONNEN" / "Power and Efficiency" / "RUTHLESS · EFFICIENT · ABSOLUTE"
  Fremen:     "FREMEN" / "Survival and Adaptation" / "ADAPTIVE · SCARCE · UNBROKEN"

MOCKUP:
  Eyebrow:    "THE ORACLE IN SESSION"
  Subtitle:   "A consultation, rendered."
  Caption:    "ACTUAL OUTPUT · RENDERED AT oracle.fremn.com"

TESTAMENT:
  Eyebrow:    "FROM THE CHRONICLES OF THOSE WHO SOUGHT"

FINAL CTA:
  Eyebrow:    "THE PATH AWAITS"
  Headline:   "The Golden Path / is already written."
  Body:       "Every great decision has been faced before. In other deserts.
               By other seekers. The spice remembers. Consult the Oracle."
  CTA:        "Initialize Consultation"
  Sub-link:   "oracle.fremn.com · No account required"
  Coordinates:"23.418°N · 41.234°E · ARRAKIS"

FOOTER:
  Left:       "FREMN · ORACLE"
  Center:     "Built during the Vibeathon · Arrakis, Dune, Desert Planet"
  Right:      "oracle.fremn.com"
```

---

## 10. What Claude Code Must Never Do (Landing Page)

| Prohibited | Why |
|---|---|
| Any `rounded-*` class on components | 0px radius law |
| `border` for section separation | Background shifts only |
| `text-white` | Use `text-sand-50` minimum |
| `shadow-*` | Tonal layering only |
| Navigation bar / hamburger menu | This page has no nav |
| Image tags (`<img>`, `<Image>`) | Zero images — CSS and canvas only |
| Carousel / slider for testimonials | Static grid only |
| Gradient text on body copy | Hero ORACLE wordmark and final headline only |
| External CDN fonts | Use next/font/google only |
| Animation durations below 200ms | Too snappy — minimum 200ms |
| `transition-all` | Specify exact properties |
| Playful microcopy | "Initialize", "Seek", "Ascertain" — not "Start", "Go", "Check" |
```
