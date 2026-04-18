# FREMN Oracle — Design System & Implementation Guide
**Design System:** The Obsidian Chronicle  
**App:** oracle.fremn.com · Next.js 16 · React 19 · TypeScript · Tailwind CSS  
**Rule:** This document is the single source of truth for all UI decisions. Claude Code must not deviate from it.

---

## 0. Philosophy (Read First)

This UI is a **digital monolith** — an ancient desert oracle filtered through a futuristic lens. Every decision must feel permanent, weighty, and intentional. We reject modern SaaS aesthetics entirely.

Three laws govern everything:
1. **0px border-radius on all components.** No exceptions. Rounding breaks the aesthetic.
2. **No 1px solid borders for sectioning.** Hierarchy is created through background color shifts, never lines.
3. **No pure white.** The coldest text color allowed is `sand-50` (`#FDF6E3`).

---

## 1. Tailwind Configuration

Install fonts and extend Tailwind before writing any component. This is the foundation everything else references.

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy — use tonal layering, never borders, to separate sections
        'void-900':  '#0A0806', // page background (base layer)
        'surface':   '#15130f', // alternate base
        'surface-low':  '#1E1B17', // secondary containers
        'surface-high': '#2C2A25', // interactive/prominent elements
        'outline-variant': '#4D4639', // ghost borders at 15% opacity only

        // Sand palette — the "spice" accent family
        'sand-50':  '#FDF6E3', // lightest text, used on dark fills
        'sand-200': '#E8D5A3', // muted body text, labels
        'sand-400': '#C4A35A', // accents, ghost borders
        'sand-600': '#8B6914', // strong amber, used in CTA gradient start
        'primary':  '#e5c276', // CTA gradient end, high-impact moments
        'on-primary': '#3f2e00', // text ON primary-background buttons

        // Spice scores
        'spice-amber': '#EF9F27', // success score bar
        'spice-coral': '#D85A30', // risk score bar
        'spice-teal':  '#1D9E75', // spice yield score bar

        // House colors
        'atreides': '#1E6FA8',
        'harkonnen': '#8B1A1A',
        'fremen-gold': '#C4A35A',
      },

      fontFamily: {
        cinzel:  ['Cinzel', 'serif'],          // display, logo, CTA text, verdict
        crimson: ['"Crimson Text"', 'serif'],  // prophecy body, editorial
        sans:    ['Inter', 'sans-serif'],      // all UI labels, body
        mono:    ['"JetBrains Mono"', 'monospace'], // scores, metadata, coordinates
      },

      letterSpacing: {
        'widest-2': '0.3em',
        'widest-3': '0.5em',
      },

      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3' },
          '50%':      { opacity: '1' },
        },
        barFill: {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--bar-target)' },
        },
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 600ms ease-out forwards',
        'pulse-glow':    'pulseGlow 1.5s ease-in-out infinite',
        'bar-fill':      'barFill 800ms ease-out forwards',
      },

      backgroundImage: {
        // The "shimmering heat" gradient — used on primary CTAs and high-impact headers
        'spice-gradient': 'linear-gradient(135deg, #8B6914 0%, #e5c276 100%)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 2. Google Fonts Setup

```tsx
// app/layout.tsx
import { Cinzel, Crimson_Text, Inter, JetBrains_Mono } from 'next/font/google'

const cinzel    = Cinzel({ subsets: ['latin'], weight: ['400'], variable: '--font-cinzel' })
const crimson   = Crimson_Text({ subsets: ['latin'], weight: ['400'], style: ['italic'], variable: '--font-crimson' })
const inter     = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-mono' })

// Apply all four variables to <html>
// className={`${cinzel.variable} ${crimson.variable} ${inter.variable} ${jetbrains.variable}`}
```

---

## 3. Global CSS

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  background-color: #0A0806; /* void-900 */
  color: #E8D5A3;            /* sand-200 — default body text, never pure white */
  font-family: var(--font-inter), sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Textarea and input resets */
textarea, input {
  outline: none;
  appearance: none;
}

/* Oracle scroll progress indicator — thin teal line, right edge */
.oracle-scroll-indicator {
  position: fixed;
  top: 0;
  right: 0;
  width: 2px;
  height: var(--scroll-pct, 0%);
  background-color: #1D9E75;
  animation: pulseGlow 1.5s ease-in-out infinite;
  z-index: 50;
}

/* Ghost border utility — felt, not seen */
.ghost-border {
  border: 1px solid rgba(77, 70, 57, 0.15); /* outline-variant at 15% */
}

/* Glassmorphism — for overlays only */
.glass {
  background: rgba(21, 19, 15, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

---

## 4. Color Usage Rules

| Situation | Color to use | Tailwind class |
|---|---|---|
| Page background | `#0A0806` | `bg-void-900` |
| Cards, panels | `#1E1B17` | `bg-surface-low` |
| Inputs, interactive surfaces | `#2C2A25` | `bg-surface-high` |
| Primary body text | `#E8D5A3` | `text-sand-200` |
| Headline / emphasis text | `#FDF6E3` | `text-sand-50` |
| Muted labels | `#C4A35A` | `text-sand-400` |
| Primary CTA background | gradient | `bg-spice-gradient` |
| Primary CTA text | `#3f2e00` | `text-on-primary` |
| Dividers (sparingly) | outline-variant 15% opacity | `ghost-border` class |
| Success score | `#EF9F27` | `text-spice-amber` / `bg-spice-amber` |
| Risk score | `#D85A30` | `text-spice-coral` / `bg-spice-coral` |
| Spice yield score | `#1D9E75` | `text-spice-teal` / `bg-spice-teal` |

**Never use:** `bg-white`, `text-white`, `rounded-lg`, `rounded-md`, `rounded-full`, `shadow-*`, `border` (for layout sectioning).

---

## 5. Typography Rules

| Role | Font | Size | Weight | Tracking | Color |
|---|---|---|---|---|---|
| Logo "FREMN" | Cinzel | 36px | 400 | 0.3em | `sand-50` |
| Logo "ORACLE" | Cinzel | 14px | 400 | 0.5em | `sand-400` |
| Tagline | Inter italic | 13px | 400 | normal | `sand-200` |
| Section headers | Inter uppercase | 11px | 500 | 0.2em | `sand-400` |
| House pill labels | Inter uppercase | 13px | 400 | 0.1em | `sand-200` |
| CTA button | Cinzel | 15px | 400 | 0.15em | `on-primary` |
| Verdict text | Cinzel | 20px | 400 | normal | `sand-50` |
| Prophecy body | Crimson Text italic | 18px | 400 | normal | `sand-50` |
| UI body / labels | Inter | 13–15px | 400 | normal | `sand-200` |
| Score numbers | JetBrains Mono | 14px | 500 | normal | per score color |
| Metadata / timestamps | JetBrains Mono | 11px | 500 | normal | `sand-400` |

**Headline tracking rule:** All headlines and section labels use `tracking-widest` or wider. Width increases authority.

---

## 6. Component Implementations

### 6.1 Page Shell

```tsx
// app/page.tsx — outer shell
<main className="min-h-screen bg-void-900 text-sand-200">
  <div className="oracle-scroll-indicator" />
  <Header />
  <div className="max-w-2xl mx-auto px-4 pb-24">
    <HouseSelector />
    <DilemmaInput />
    {/* OracleResponse renders here when response exists */}
    <ConsultationHistory />
  </div>
</main>
```

---

### 6.2 Header

```tsx
// components/Header.tsx
<header className="w-full bg-void-900 py-10 text-center border-b border-outline-variant border-opacity-15">
  <p className="font-cinzel text-sand-50 tracking-widest-2 text-4xl mb-1">FREMN</p>
  <p className="font-cinzel text-sand-400 tracking-widest-3 text-sm mb-4">ORACLE</p>
  <div className="w-16 h-px bg-sand-600 mx-auto mb-3" />
  <p className="font-sans italic text-sand-200 text-xs">Prescience for your decisions</p>
</header>
```

---

### 6.3 House Selector

```tsx
// components/HouseSelector.tsx
// Container: centered flex row with gap, padding top/bottom 24px
// Border-radius: 0px on all buttons — sharp corners only
// Sectioning: NO border below/above — background shift handles hierarchy

const houses = [
  {
    id: 'atreides',
    label: 'ATREIDES',
    description: 'Noble. Long-term. Honour-driven.',
    activeClass: 'bg-atreides text-sand-50',
    activeBorder: 'border-atreides',
  },
  {
    id: 'harkonnen',
    label: 'HARKONNEN',
    description: 'Ruthless. Efficient. Unsentimental.',
    activeClass: 'bg-harkonnen text-sand-50',
    activeBorder: 'border-harkonnen',
  },
  {
    id: 'fremen',
    label: 'FREMEN',
    description: 'Adaptive. Resourceful. Desert-forged.',
    activeClass: 'bg-fremen-gold text-void-900',
    activeBorder: 'border-fremen-gold',
  },
]

// Each button className (unselected):
// "w-40 h-12 font-sans text-sm text-sand-200 tracking-[0.1em] uppercase
//  bg-surface-low border border-outline-variant border-opacity-15
//  transition-colors duration-150"

// Selected state adds: activeClass + activeBorder (replace border-outline-variant)
// Description text below pills: font-sans italic text-xs text-sand-400 text-center mt-3
// Transition duration: 150ms
```

---

### 6.4 Dilemma Input

```tsx
// components/DilemmaInput.tsx

// SUGGESTION CHIPS
// Container: flex flex-wrap gap-2 mb-4 overflow-x-auto
// Each chip: font-sans text-xs text-sand-200 bg-surface-high px-4 py-1.5
//            border border-outline-variant border-opacity-15 cursor-pointer
//            hover:border-sand-400 hover:text-sand-50 transition-colors duration-200
//            border-radius: 0px (NOT rounded-full — Chronicle rule)

const chips = [
  'Should I launch my startup?',
  'I want to pivot my career to AI',
  'My co-founder and I disagree',
  'Should I move to a new city?',
]

// TEXTAREA
// Chronicle rule: forgo the four-sided box.
// Use surface-high background + 1px primary-colored BOTTOM border only.
// On focus: bottom border expands color to sand-400, transitions from center.
//
// className: "w-full min-h-[120px] resize-none bg-surface-high text-sand-50
//             font-sans text-base leading-relaxed px-4 py-3.5
//             border-0 border-b border-sand-600
//             focus:border-sand-400 transition-colors duration-300
//             placeholder:text-sand-400"
// placeholder: "Speak your dilemma, seeker of the golden path..."

// CHARACTER COUNTER
// font-mono text-xs text-sand-400 text-right mt-1
// > 400 chars: text-sand-600
// > 480 chars: text-spice-coral

// GOM JABBAR ROW
// flex justify-between items-center mt-4
// Left: <span className="font-sans text-sm text-sand-200">Gom Jabbar Mode</span>
//       + active badge: "GOM JABBAR ACTIVE"
//         font-mono text-[10px] uppercase tracking-[0.15em]
//         bg-harkonnen/20 text-harkonnen border border-harkonnen px-2 py-0.5 ml-3
// Right: custom toggle (see below)

// TOGGLE SWITCH — custom, no library
// OFF: track bg-outline-variant, thumb bg-sand-400
// ON:  track bg-harkonnen,       thumb bg-sand-50
// Use role="switch" aria-checked for accessibility

// SUBMIT BUTTON
// Chronicle rule: primary CTAs use spice-gradient + on-primary text. Sharp 0px radius.
// className: "w-full h-13 mt-4 bg-spice-gradient text-on-primary
//             font-cinzel text-sm tracking-[0.15em] uppercase
//             transition-opacity duration-200 hover:opacity-90
//             disabled:bg-surface-high disabled:text-sand-400
//             disabled:cursor-not-allowed disabled:bg-none"
// Default label: "Consult the Oracle"
// Loading label: "The spice flows..." (with 3 amber dots cycling via CSS animation)
// Disabled when no house is selected
```

---

### 6.5 Loading State

```tsx
// components/LoadingState.tsx
// Replaces response card position during API call. Fade-slide-up animation on mount.

// className: "animate-fade-slide-up flex flex-col items-center justify-center py-16"

// Amber pulse dot:
// <div className="w-3 h-3 rounded-full bg-spice-amber animate-pulse-glow mb-4" />
// Note: rounded-full is acceptable here for the dot only — it is a decorative circle, not a component

// Primary line: "The spice flows..." — font-crimson italic text-sand-400 text-lg
// Cycling lines (swap every 2s via useEffect + useState):
const cyclingLines = [
  'Visions coalesce across timelines...',
  'The Kwisatz Haderach stirs...',
  'Reading the golden path...',
  'Water of Life flows through the oracle...',
]
// Each line: font-sans text-sm text-sand-400 text-center mt-2 animate-fade-slide-up
```

---

### 6.6 Oracle Response Card

```tsx
// components/OracleResponse.tsx
// Sectioning: background shift from void-900 (page) to surface-low (card). NO border for hierarchy.
// Ghost border: 1px outline-variant at 15% opacity only — felt, not seen.
// Animation: animate-fade-slide-up on mount.

// CARD WRAPPER
// className: "bg-surface-low p-6 mt-6 animate-fade-slide-up ghost-border"
// (0px border-radius — no rounded-* class)

// ── ZONE 1: PROPHECY ──────────────────────────────────

// House badge (top-left of card):
// font-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 inline-block mb-4
// Atreides: bg-atreides/20 text-atreides border border-atreides/40
// Harkonnen: bg-harkonnen/20 text-harkonnen border border-harkonnen/40
// Fremen:    bg-fremen-gold/20 text-fremen-gold border border-fremen-gold/40

// Prophecy block:
// border-l-2 border-spice-amber pl-4 my-4
// <p className="font-crimson italic text-sand-50 text-lg leading-relaxed">
//   {prophecy}
// </p>

// ── ZONE DIVIDER ──────────────────────────────────────
// Chronicle rule: if a divider is required for accessibility, use outline-variant at 15%
// <div className="ghost-border border-t border-0 my-5" />

// ── ZONE 2: SPICE PROBABILITY ENGINE ──────────────────

// Section label:
// <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-sand-400 mb-4">
//   spice probability across timelines
// </p>

// Score bars — three rows, gap-3.5, stagger delays 0ms / 150ms / 300ms
// Each row: flex items-center gap-3
//   Label (w-32): font-sans text-xs text-sand-200
//   Track (flex-1): h-1.5 bg-surface-high  (0px radius)
//   Fill: h-full bg-spice-{color} animate-bar-fill (CSS var --bar-target set inline)
//         stagger via animation-delay inline style
//   Number (w-12 text-right): font-mono text-sm font-medium text-spice-{color}

// Score data:
const scores = [
  { label: 'Success odds',  value: successScore, color: 'spice-amber', delay: '0ms'   },
  { label: 'Risk level',    value: riskScore,    color: 'spice-coral', delay: '150ms' },
  { label: 'Spice yield',   value: spiceScore,   color: 'spice-teal',  delay: '300ms' },
]

// ── ZONE DIVIDER ──────────────────────────────────────
// <div className="ghost-border border-t border-0 my-5" />

// ── ZONE 3: THE FREMEN VERDICT ────────────────────────

// Label:
// <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-sand-400 text-center mb-3">
//   — the fremen verdict —
// </p>

// Verdict text (THE emotional peak — give it space):
// <p className="font-cinzel text-sand-50 text-xl text-center leading-relaxed px-4">
//   {verdict}
// </p>

// Actions row: flex justify-center gap-3 mt-4
//
// [Copy Verdict]:
//   font-sans text-xs text-sand-200 bg-surface-high px-4 py-2
//   ghost-border hover:border-sand-400 hover:text-sand-50
//   transition-colors duration-200 cursor-pointer
//   On copy: label → "Ascertained." (2s), color → text-sand-400
//   (Chronicle microcopy rule: use "Ascertained" not "Copied")
//
// [New Consultation]:
//   font-sans text-xs text-sand-400 bg-transparent px-4 py-2
//   hover:text-sand-200 hover:underline transition-colors duration-200
//   Label: "Initialize New Consultation"
//   (Chronicle microcopy rule: "Initialize" not "Start")
```

---

### 6.7 Consultation History

```tsx
// components/ConsultationHistory.tsx
// Collapsed by default. Toggle via chevron row.
// Sectioning via background shift to surface-low — no separator line above.

// TOGGLE ROW
// flex justify-between items-center py-4 cursor-pointer
// Left: "Past Consultations (N)" — font-sans text-sm text-sand-400
// Right: ChevronDown/Up icon — text-sand-400, rotates 180deg when expanded
// Hover: text-sand-200, transition 200ms
// Top boundary: ghost-border border-t only (accessibility divider)

// HISTORY CARDS (when expanded)
// flex flex-col gap-3 mt-3
// Each card: bg-surface-low p-4 ghost-border cursor-pointer
//   hover:border-sand-400 transition-colors duration-200
//
// Card layout:
//   Row 1: flex justify-between items-center
//     [House badge — same style as response card]
//     [Timestamp: font-mono text-[11px] text-sand-400]
//   Row 2: font-sans text-sm text-sand-200 line-clamp-2 mt-2  (dilemma)
//   Row 3: font-crimson italic text-sand-50 text-sm line-clamp-1 mt-1  (verdict)
//
// Expanded card (on click): reveals full prophecy + score bars
// Use AnimatePresence or simple max-height transition for expand
```

---

## 7. Microcopy Reference

Chronicle rule: language must be authoritative, mysterious, and direct. No casual phrasing.

| Instead of | Use |
|---|---|
| "Start" | "Initialize" |
| "Check" | "Ascertain" |
| "Copied!" | "Ascertained." |
| "Submit" | "Consult the Oracle" |
| "Loading..." | "The spice flows..." |
| "Error" | "The visions are obscured." |
| "Try again" | "Seek again." |
| "No history yet" | "No consultations recorded in this timeline." |
| "Select a house first" | "Align with a House before seeking counsel." |

---

## 8. Elevation & Depth Rules

1. **Tonal layering only.** Stack `surface` tiers to lift content. No `shadow-*` utilities.
2. **Ambient glow** (modals/overlays only): `box-shadow: 0 0 60px 0 rgba(139, 105, 20, 0.05)` — a lantern glow, not a digital shadow.
3. **Ghost borders** (`outline-variant` at 15% opacity) for accessibility dividers only — one per screen maximum.
4. **Glassmorphism** (floating nav or overlays only): use `.glass` utility class — `bg-surface/70` + `backdrop-blur-md`.

---

## 9. Responsive Rules

**Desktop (≥768px):** `max-w-2xl mx-auto px-6` — content is an island in the void.

**Mobile (<768px):**
- Padding: `px-4`
- House selector: `flex-col w-full` (stack vertically), each button `w-full`
- Suggestion chips: `overflow-x-auto flex-nowrap` (horizontal scroll, no wrap)
- Score bar labels: truncate to 80px width
- Score bars: `h-2` (8px) for larger touch targets
- Verdict text: `text-lg` (reduce from 20px)

---

## 10. What Claude Code Must Never Do

| Prohibited | Reason |
|---|---|
| `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` on components | Breaks 0px radius rule |
| `border` utilities for layout sectioning | Use background shifts instead |
| `text-white` anywhere | Use `text-sand-50` minimum |
| `shadow-sm`, `shadow-md`, `shadow-lg` etc. | Use tonal layering instead |
| `transition-all duration-150` | Too snappy. Minimum 200ms on UI, 600ms on page-level |
| `bg-white`, `bg-gray-*`, any Tailwind default gray | Use void/surface palette only |
| Emoji in any UI element | Use SVG icons or CSS shapes |
| Any `border-radius` > 0 except the amber pulse dot | Single exception documented in LoadingState |
