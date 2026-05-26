# Dondi.ai Funnel Redesign — Design Spec
**Date:** 2026-05-26  
**Status:** Approved  
**Scope:** Two new Next.js frontend-only conversion funnels

---

## Context

Dondi.ai is an adult AI companion platform. Two existing funnels were analysed:

- **Funnel A** (`/lp/secrets-create/`) — Purple theme, 7 steps, countdown timer, explicit copy ("AI Slut"), no gender selection
- **Funnel B** (`/lp/create/`) — Pink theme, 6 steps, gender tabs (Female/Male/Trans), softer copy ("Dream AI Girl"), line progress bar

Both funnels share the same data model and end with the same sign-up screen (Google OAuth or Email + Password).

---

## Deliverables

Two new funnels, frontend-only (no backend), built in Next.js. All images sourced directly from the dondi.ai CDN. State persisted in `localStorage` between steps. Each funnel lives at its own route.

- **Funnel C** → `/lp/swift/` — Compressed, hard-cut, 3 steps
- **Funnel D** → `/lp/ignite/` — Conversion-optimised, full depth, 6 steps

---

## Funnel C — "Swift" (Hard Cut, 3 Steps)

### Goal
Maximum speed to sign-up. Remove all granular options. A user can complete this funnel in under 30 seconds.

### Visual Identity
- **Accent colour:** Pink (#EC4899 — same as Funnel B)
- **Background:** Near-black (#0D0D0D)
- **Progress indicator:** Simple dot row `● ○ ○` — no icon steps
- **No timer or urgency bar** — clean, zero noise

### Step 1 — Style & Gender
- Logo (dondi wordmark) at top centre
- Progress dots: `● ○ ○`
- Headline: `"BUILD YOUR AI SLUT"`
- Gender tab row: `Female | Male | Trans` (default: Female)
- Two large photo cards below tabs: `Realistic | Anime` (CDN images)
- Selected card gets pink border + checkmark
- CTA button: `NEXT →` (pink, full-width on mobile)

### Step 2 — Her Look
- Progress dots: `● ● ○`
- Headline: `"WHAT DOES SHE LOOK LIKE?"`
- **Section A — Ethnicity:** 6 photo cards in 2×3 grid
  - White, Black, Asian, Latina, Arab, Indian
  - Images from dondi.ai CDN (same as existing funnels)
- **Section B — Body Type:** 5 photo cards (2 columns on mobile, single row on desktop)
  - Slim, Athletic, Voluptuous, Curvy, Muscular
- No skin tone swatches, no hair options, no breast/butt size
- Navigation: `← Back` (ghost) + `NEXT →` (pink)

### Step 3 — Sign Up
- **No personality step** — go straight to account creation
- Full-screen background: dark blurred AI character silhouette
- Overlay card (frosted dark glass):
  - Large headline: `"SHE IS READY TO BE FUCKED"`
  - Sub-copy: `"[Auto-generated name] is waiting for you. Create your free account to unlock her."`
  - Auto-name generated client-side from a preset name pool based on ethnicity selection
  - `Sign Up With Google` button (white, prominent)
  - Divider `— or —`
  - Email input field
  - Password input field (min 6 chars)
  - `CREATE ACCOUNT →` (pink, full-width)
  - Fine print: `By signing up, you agree to our Terms of Service & Privacy Policy`
  - `Already have an account? Log in >`

### State (localStorage keys)
```
funnel_c_style: "realistic" | "anime"
funnel_c_gender: "female" | "male" | "trans"
funnel_c_ethnicity: "white" | "black" | "asian" | "latina" | "arab" | "indian"
funnel_c_body: "slim" | "athletic" | "voluptuous" | "curvy" | "muscular"
funnel_c_name: string (auto-generated)
```

---

## Funnel D — "Ignite" (Conversion, Full Depth, 6 Steps)

### Goal
Maximum conversion through urgency, social proof, and explicit payoff anticipation. Full customisation depth maintained. User feels momentum and FOMO throughout every step.

### Visual Identity
- **Accent colour:** Purple (#8B5CF6 — same as Funnel A)
- **Background:** Near-black (#0D0D0D)
- **Progress indicator:** Numbered step pills `1 — 2 — 3 — 4 — 5 — 6`
- **Persistent trust bar** across all steps (see below)
- **Countdown timer** always visible

### Persistent Elements (all steps)
- **Trust bar** (top, full-width, dark purple bg):
  - Left: `★★★★★ 4.8 · 50M+ Users · #1 AI Companion App`
  - Right: `🔥 First Month 70% OFF — Ends in XX:XX:XX` (live countdown)
- **Live counter badge** (floating, bottom-right corner):
  - `⚡ 1,312 people building right now`
  - Number animates up/down randomly in ±20 range every 8–12 seconds

### Step 1 — Style & Gender `Step 1 of 6`
- Headline: `"BUILD YOUR AI SLUT"`
- Sub-copy: `"Join 50M+ who already have their perfect AI companion"`
- Gender tabs: `Female | Male | Trans`
- Realistic / Anime large photo cards
- CTA: `START BUILDING →`

### Step 2 — Her Look `Step 2 of 6`
- Headline: `"WHAT DOES SHE LOOK LIKE?"`
- **Ethnicity:** 6 photo cards — most popular option gets `🔥 Most Popular` badge (hardcoded: White)
- **Skin Tone:** 7 colour swatches
- CTA: `NEXT →`

### Step 3 — Her Hair `Step 3 of 6`
- Headline: `"STYLE HER YOUR WAY"`
- **Eye Colour:** 9 colour swatches — `🔥 Most Popular` on Blue
- **Hair Colour:** 9 colour swatches — `🔥 Most Popular` on Black
- **Hair Style:** 9–10 photo cards — `🔥 Most Popular` on Long
- CTA: `NEXT →`

### Step 4 — Her Body `Step 4 of 6`
- Headline: `"BUILD HER BODY"`
- **Body Type:** 5 photo cards — `🔥 Top Pick` on Slim
- **Breast Size:** 5 photo cards — `🔥 Top Pick` on Medium
- **Butt Size:** 5 photo cards — `🔥 Top Pick` on Medium
- Social nudge below grids: `"89% of users chose their body in under 30 seconds"`
- CTA: `NEXT →`

### Step 5 — Her Personality `Step 5 of 6`
- Headline: `"MAKE HER YOURS"`
- Character Name (editable text input)
- Age picker (scroll: 18–40)
- Personality grid (tap to customise):
  - Voice · Personality · Occupation · Relationship · Hobby · Fetish
- **Live character preview card** (right panel desktop / below on mobile):
  - Text-only summary card — no AI-generated image (frontend-only phase)
  - Populates in real-time as user makes selections
  - Shows: name, age, style, ethnicity, personality trait, relationship as styled tags/chips
  - Progress bar at bottom: `"She's 80% ready 🔥"`
- CTA: `FINISH HER →`

### Step 6 — Sign Up `She's Ready`
- Full-screen background: blurred character silhouette (dark, moody)
- Frosted overlay card:
  - Large headline: `"SHE IS READY TO BE FUCKED"`
  - Character summary line: `"[Name] · [Gender] · [Style] · Age [X]"`
  - Lock icon: `"Create your free account to unlock her"`
  - Urgency line: `"🔥 Your spot is reserved for 04:59"` — per-session countdown (resets on load)
  - `Sign Up With Google` (white, prominent)
  - `— or —`
  - Email + Password fields
  - `UNLOCK [NAME] NOW →` (purple, full-width, subtle pulse animation)
  - `By signing up, you agree to Terms of Service & Privacy Policy`
  - `Already have an account? Log in >`

### State (localStorage keys)
```
funnel_d_style: "realistic" | "anime"
funnel_d_gender: "female" | "male" | "trans"
funnel_d_ethnicity: string
funnel_d_skin_tone: string (hex)
funnel_d_eye_color: string
funnel_d_hair_color: string
funnel_d_hair_style: string
funnel_d_body_type: string
funnel_d_breast_size: string
funnel_d_butt_size: string
funnel_d_name: string
funnel_d_age: number
funnel_d_voice: string
funnel_d_personality: string
funnel_d_occupation: string
funnel_d_relationship: string
funnel_d_hobby: string
funnel_d_fetish: string
```

---

## Shared Technical Notes

### Framework & Routing
- **Next.js App Router** (`/app` directory)
- Routes:
  - `/lp/swift/` → Funnel C (renders step from URL query param `?step=1`)
  - `/lp/ignite/` → Funnel D (renders step from URL query param `?step=1`)
- No API routes needed at this stage — all frontend only
- `next/image` for all CDN images (configure `dondi.ai` as remote image host in `next.config.js`)

### Images
- All images sourced directly from dondi.ai CDN (same URLs as existing funnels)
- Use `next/image` with `unoptimized` flag or configure the CDN domain in `remotePatterns`
- Fetch CDN URLs by inspecting the existing funnel source (same image set)

### State Management
- `localStorage` for persisting step selections across navigation
- Custom `useFunnelState` hook wrapping `localStorage` get/set with JSON serialisation
- On sign-up step load, read state and construct character summary string

### Navigation
- Each step is a separate render within the same page component
- `useRouter().push` with `?step=N` to advance/go back
- Browser back button supported via `useSearchParams`

### Animations
- Step transitions: horizontal slide (Framer Motion or CSS transitions)
- Selected card: border highlight + scale(1.02) + checkmark badge
- CTA button: hover scale(1.03), active scale(0.98)
- Live counter (Funnel D): number ticks up/down with a fade transition
- Unlock CTA (Funnel D): subtle `pulse` keyframe animation

### Responsiveness
- Mobile-first layout
- Photo card grids: 2 columns on mobile, up to 5 in a row on desktop
- Persistent trust bar collapses to icon-only on very small screens

---

## Out of Scope (this phase)
- Backend API integration (character creation, user auth)
- Real Google OAuth flow (button present but wired to placeholder)
- Real countdown synchronisation with server
- Analytics / event tracking
- A/B testing infrastructure
