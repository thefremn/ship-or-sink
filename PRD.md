# FREMN Oracle — Product Requirements Document

**App:** FREMN Oracle  
**URL:** oracle.fremn.com  
**Tagline:** Prescience for your decisions  
**Stack:** Next.js 16 · React 19 · TypeScript · Supabase · OpenAI API · Vercel  
**Built by:** Claude Code  
**Timeline:** 4-hour vibeathon build  

---

## 1. Overview

FREMN Oracle is an AI-powered decision advisor themed around the Dune universe. Users submit real-world dilemmas — career moves, startup decisions, personal choices — and receive strategic advice delivered in the voice of the Kwisatz Haderach, complete with Fremen proverbs and spice-probability scoring across timelines.

---

## 2. Core User Flow

1. User lands on oracle.fremn.com
2. User selects their **House Alignment** (Atreides / Harkonnen / Fremen)
3. User types their dilemma in the input field
4. User optionally toggles **Gom Jabbar Mode** (brutal honesty)
5. User submits → Oracle responds with:
   - Prophetic advice in Fremen/Kwisatz Haderach voice
   - Three spice probability scores (Success, Risk, Spice Yield)
   - A one-line Fremen Verdict (the shareable line)
6. User can copy/share their Verdict or start a new consultation

---

## 3. Features

### 3.1 House Alignment Selector (required before consulting)

Three houses, each shifts the LLM system prompt tone:

| House | Tone | Philosophy |
|---|---|---|
| Atreides | Noble, long-term, honour-driven | "The slow blade penetrates the shield" |
| Harkonnen | Ruthless, efficiency-first, unsentimental | "Power is the only truth" |
| Fremen | Survival-focused, resourceful, adaptive | "The desert teaches all lessons" |

Store selected house in local React state. Pass as context to API.

### 3.2 Dilemma Input

- Textarea with placeholder: *"Speak your dilemma, seeker of the golden path..."*
- Max 500 characters
- Quick-fill suggestion chips below (e.g. "Should I launch my startup?", "I want to quit my job", "My co-founder and I disagree")
- Submit button: "Consult the Oracle"

### 3.3 Oracle Response

Rendered in a response card with three zones:

**Zone 1 — The Prophecy**  
2–4 sentences of advice in the voice of the Kwisatz Haderach / Fremen Elder. Uses Dune metaphors: spice, sandworm, desert, water discipline, Bene Gesserit, golden path. Italicised, amber left-border accent.

**Zone 2 — Spice Probability Engine**  
Three animated score bars:
- Success Odds (%) — amber
- Risk Level (%) — coral/red
- Spice Yield (%) — teal (upside potential)

Scores are reasoned by the LLM based on the dilemma, not random.

**Zone 3 — The Fremen Verdict**  
One bold prophetic line. This is the shareable unit. Displayed large, with a copy-to-clipboard button and a share button that generates a card image (stretch goal).

### 3.4 Gom Jabbar Mode

A toggle above the submit button. When ON:
- System prompt instructs the LLM to remove all comfort and deliver only the hard truth
- UI shows a small red "Gom Jabbar Active" badge
- Response tone shifts from prophetic-wise to brutal-direct (still in Dune voice)

### 3.5 Consultation History (Supabase)

- Each consultation is saved to Supabase with: `id`, `house`, `dilemma`, `prophecy`, `success_score`, `risk_score`, `spice_score`, `verdict`, `gom_jabbar`, `created_at`
- No auth required — use anonymous session ID stored in localStorage
- History panel (sidebar or bottom drawer on mobile) shows past consultations
- Users can click any past consultation to re-read it

### 3.6 Share Card (Stretch Goal)

- "Share my Verdict" button generates an OG-style image card
- Card shows: FREMN Oracle logo, the Fremen Verdict line, House badge, oracle.fremn.com URL
- Use `html2canvas` or a Vercel OG image route (`/api/og`)

---

## 4. API Design

### 4.1 POST /api/oracle

**Request body:**
```typescript
{
  dilemma: string;        // max 500 chars
  house: 'atreides' | 'harkonnen' | 'fremen';
  gomJabbar: boolean;
  sessionId: string;      // anonymous UUID from localStorage
}
```

**Response:**
```typescript
{
  prophecy: string;       // 2-4 sentences
  successScore: number;   // 0-100
  riskScore: number;      // 0-100
  spiceScore: number;     // 0-100
  verdict: string;        // one line
  consultationId: string; // UUID saved in Supabase
}
```

**LLM call (OpenAI):**
- Model: `gpt-4o`
- Response format: JSON (use `response_format: { type: 'json_object' }`)
- System prompt varies by house + gomJabbar toggle
- Temperature: 0.85 (creative but coherent)

### 4.2 GET /api/history?sessionId=xxx

Returns last 10 consultations for the session from Supabase.

---

## 5. System Prompts

### Base prompt structure:
```
You are the Oracle of FREMN — the Kwisatz Haderach who sees across time and space. 
When a seeker presents their dilemma, you respond with prophetic wisdom rooted in 
the Fremen way. You speak in the voice of one who has drunk the Water of Life and 
walked the Golden Path.

House context: {house_prompt}
Mode: {gom_jabbar_prompt}

Respond ONLY with valid JSON:
{
  "prophecy": "2-4 sentences of prophetic advice using Dune metaphors",
  "successScore": <integer 0-100>,
  "riskScore": <integer 0-100>,
  "spiceScore": <integer 0-100>,
  "verdict": "one memorable prophetic line, like a Fremen proverb"
}
```

### House injections:
- **Atreides:** "Frame advice through honour, legacy, and the long arc of history. Think in generations."
- **Harkonnen:** "Frame advice through power, efficiency, and unsentimental pragmatism. Sentiment is weakness."
- **Fremen:** "Frame advice through survival, adaptation, and desert wisdom. Scarcity teaches truth."

### Gom Jabbar injection (when ON):
"Remove all comfort. Deliver only the hard, unfiltered truth. No softening. The seeker has placed their hand in the box."

---

## 6. Database Schema (Supabase)

```sql
-- consultations table
create table consultations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  house text not null check (house in ('atreides', 'harkonnen', 'fremen')),
  dilemma text not null,
  prophecy text not null,
  success_score integer not null,
  risk_score integer not null,
  spice_score integer not null,
  verdict text not null,
  gom_jabbar boolean default false,
  created_at timestamptz default now()
);

-- index for history lookups
create index on consultations(session_id, created_at desc);

-- RLS: anyone can insert and read their own session
alter table consultations enable row level security;
create policy "session insert" on consultations for insert with check (true);
create policy "session select" on consultations for select using (true);
```

---

## 7. Project Structure

```
oracle.fremn.com/
├── app/
│   ├── page.tsx                  # Main oracle page
│   ├── layout.tsx                # Root layout with fonts + metadata
│   ├── api/
│   │   ├── oracle/route.ts       # POST — LLM call + Supabase insert
│   │   └── history/route.ts      # GET — fetch session history
│   └── globals.css
├── components/
│   ├── HouseSelector.tsx         # Atreides / Harkonnen / Fremen picker
│   ├── DilemmaInput.tsx          # Textarea + suggestion chips
│   ├── OracleResponse.tsx        # Prophecy + scores + verdict
│   ├── SpiceScoreBar.tsx         # Animated score bar component
│   ├── GomJabbarToggle.tsx       # Toggle with red badge
│   ├── ConsultationHistory.tsx   # Past readings panel
│   └── ShareCard.tsx             # Verdict share UI (stretch)
├── lib/
│   ├── openai.ts                 # OpenAI client + oracle call
│   ├── supabase.ts               # Supabase client (server + browser)
│   └── prompts.ts                # System prompt builders
├── types/
│   └── oracle.ts                 # Shared TypeScript types
└── .env.local
    # OPENAI_API_KEY
    # NEXT_PUBLIC_SUPABASE_URL
    # NEXT_PUBLIC_SUPABASE_ANON_KEY
    # SUPABASE_SERVICE_ROLE_KEY
```

---

## 8. Environment Variables

```bash
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 9. Build Order for 4 Hours

**Hour 1 — Core Oracle loop**
- Set up Next.js project structure
- Build `/api/oracle` route with OpenAI call
- Build `DilemmaInput` + `OracleResponse` components
- Basic page wired end-to-end, no styling

**Hour 2 — House system + Gom Jabbar + UI**
- Build `HouseSelector` component
- Wire house + gomJabbar into API call
- Style everything per design.md
- Animate score bars on response

**Hour 3 — Supabase history**
- Set up Supabase project + run schema
- Wire insert on each consultation
- Build `ConsultationHistory` panel
- Test session persistence

**Hour 4 — Polish + Deploy**
- Add suggestion chips
- Add copy-to-clipboard on verdict
- Error states + loading states
- Deploy to Vercel
- Point oracle.fremn.com subdomain

---

## 10. Non-Goals (out of scope for vibeathon)

- User authentication / accounts
- Social features / public feed of readings
- Multi-language support
- Mobile app
- Paid tiers / rate limiting (add post-vibeathon)

---

## 11. Success Criteria

The build is complete when:
- A user can select a house, enter a dilemma, and receive a full oracle response
- Gom Jabbar mode changes the tone of the response noticeably
- Past consultations persist in Supabase and are viewable
- The app is live at oracle.fremn.com
- The Fremen Verdict is copyable with one click
