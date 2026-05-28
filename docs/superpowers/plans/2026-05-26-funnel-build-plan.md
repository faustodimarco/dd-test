# Funnel Build Implementation Plan
**Date:** 2026-05-26  
**Worktree:** `.worktrees/funnel-build` (branch: `feature/funnel-build`)  
**Spec:** `docs/superpowers/specs/2026-05-26-funnel-redesign-design.md`

---

## Project Context

Next.js 15 App Router project at `/Users/faustodimarco/Desktop/dondi/`.  
Framer Motion already installed. TypeScript + Tailwind CSS.  
All work happens in `.worktrees/funnel-build`.

Two new frontend-only funnels:
- **Funnel C "Swift"** → `/lp/swift` — 3 steps, pink theme, hard-cut options
- **Funnel D "Ignite"** → `/lp/ignite` — 6 steps, purple theme, full customisation + social proof

No backend. No real auth. Sign-up form is UI only (no submission).

---

## CDN Asset Map

**Base URL:** `https://imagedelivery.net/xg10iEye-7DbtieyqvXeQg/{ID}/medium`  
**Logo:** `https://dondi.ai/wp-content/uploads/2025/05/dondi.ai_.png`

### Style
| Label | ID |
|-------|-----|
| Realistic | `c697a675-e928-48c7-7b09-1ef6398a4d00` |
| Anime | `eeb796e8-022e-4ceb-61ce-aabd8da4ca00` |

### Ethnicity
| Label | ID |
|-------|-----|
| White | `8784d47d-c508-4581-c9f7-2864d8769b00` |
| Black | `05d37450-6686-410a-5f5a-6713187a1b00` |
| Asian | `2d669731-63a1-4964-31a8-d22ce491d100` |
| Latina | `ab67c4d9-a601-412a-b18a-53e9b2e4a500` |
| Arab | `86c2d78a-97a6-491d-1956-e115a504ec00` |
| Indian | `dab77c81-2736-4824-da6c-b313db971f00` |

### Hair Style
| Label | ID |
|-------|-----|
| Braided | `89b08911-fca6-4644-1420-2e7602600700` |
| Long | `ee97fbdd-58d0-42c3-67e1-449eba4b5800` |
| Bangs | `67cb0210-b717-4114-6c80-9576dd3d9500` |
| Ponytail | `81ddf149-2994-4633-5bf8-4d8674936e00` |
| Short | `4a06605c-6a2f-44f9-7c5d-186b18257600` |
| Bun | `bd64559e-34f0-4434-d558-48796accce00` |
| Buns | `9ee9f426-eb65-4113-8603-14f43edafc00` |
| Wavy | `40d3bdc2-3456-49f5-9321-30dc08168900` |
| Pixie | `d5d3fdab-6331-43ee-54fe-6a0924bf4100` |
| Curly | `bf4dcd6a-a79b-4adc-9b4c-aea03a83f300` |

### Body Type
| Label | ID |
|-------|-----|
| Slim | `0c8b3351-1dba-46ca-4054-6849fd927400` |
| Athletic | `4bc86263-e8da-4b0d-98a7-2ce059a11500` |
| Voluptuous | `ce3d5d02-695e-4a4e-06d8-7c3afbc29600` |
| Curvy | `60085766-8ab8-4fbb-e105-f71f02d9a800` |
| Muscular | `0756fd37-ff64-495d-519c-c75d665b2f00` |

### Breast Size
| Label | ID |
|-------|-----|
| Flat | `f1563ece-2b62-42be-eea5-9ba5b5416300` |
| Small | `58307677-cb51-477e-7ea1-db999e00e000` |
| Medium | `324750d0-bca7-4284-d717-800114528e00` |
| Large | `94d3c046-5d34-4e83-5ece-812097390a00` |
| XL | `9051b0cf-64c1-4a03-d780-93bef4e67600` |

### Butt Size
| Label | ID |
|-------|-----|
| Small | `e50befed-9d97-40c3-d3e1-ff294efa5000` |
| Skinny | `4156ea36-e396-4910-4df2-37b93cf6ab00` |
| Athletic | `6acb04f5-7caf-44e3-68aa-670198813700` |
| Medium | `071dc102-19c8-4462-44aa-0f7334b19a00` |
| Large | `7de1dd13-6c06-4791-e072-27dde5857f00` |

### Colour Swatches (Eye & Hair Color — same palette)
9 swatches, same set for both eye and hair color:
`Black`, `Brown`, `Red`, `Blonde`, `Green`, `Blue`, `Purple`, `Pink`, `White`

Hex values:
```
Black:   #1a1a2e
Brown:   #8B4513
Red:     #DC143C
Blonde:  #FFD700
Green:   #228B22
Blue:    #4169E1
Purple:  #9370DB
Pink:    #FF69B4
White:   #F5F5F5
```

### Skin Tone (7 swatches)
```
1: #F5E4D4  (Very Pale)
2: #F2C4B0  (Fair)      ← default selected
3: #E8A888  (Light)
4: #C48060  (Tan)
5: #B89040  (Olive)
6: #9A6842  (Brown)
7: #7A4028  (Dark)
```

---

## Task 1: Project Setup

**Files to create/modify:**

1. **`next.config.ts`** — add `imagedelivery.net` and `dondi.ai` to `remotePatterns`
2. **`src/lib/assets.ts`** — all CDN image URLs as typed constants
3. **`src/lib/types.ts`** — FunnelCState, FunnelDState TypeScript interfaces
4. **`src/lib/useFunnelState.ts`** — `useFunnelState<T>(key, initial)` hook using localStorage
5. **`src/lib/names.ts`** — auto-name pool (50 names by ethnicity bucket)
6. **`src/app/globals.css`** — ensure dark bg (#0D0D0D), add any global keyframes (pulse)
7. **`src/app/page.tsx`** — replace default content with simple link to both funnels

### next.config.ts
```typescript
import type { NextConfig } from 'next';
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: 'dondi.ai' },
    ],
  },
};
export default config;
```

### Types (src/lib/types.ts)
```typescript
export interface FunnelCState {
  style: 'realistic' | 'anime';
  gender: 'female' | 'male' | 'trans';
  ethnicity: string;
  bodyType: string;
  name: string;
}

export interface FunnelDState {
  style: 'realistic' | 'anime';
  gender: 'female' | 'male' | 'trans';
  ethnicity: string;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairStyle: string;
  bodyType: string;
  breastSize: string;
  buttSize: string;
  name: string;
  age: number;
  voice: string;
  personality: string;
  occupation: string;
  relationship: string;
  hobby: string;
  fetish: string;
}
```

---

## Task 2: Shared UI Components

**Directory:** `src/components/`

### Components to build:

1. **`PhotoCard.tsx`** — image card with selection state
   - Props: `{ src, alt, label, selected, onClick, badge? }`
   - Dark rounded card, image fills card, label at bottom
   - Selected: colored border (pink or purple via CSS var) + checkmark badge
   - Hover: scale(1.02)
   - Badge: optional "🔥 Most Popular" tag overlay (top-left)

2. **`ColorSwatch.tsx`** — colored circle button
   - Props: `{ color, label, selected, onClick }`
   - When selected: label text appears below, ring border
   - 40×40px circles

3. **`StepLayout.tsx`** — full-page step wrapper
   - Props: `{ children, theme: 'pink' | 'purple', showTrustBar?: boolean }`
   - Dark bg, centered content, max-w-3xl
   - Renders TrustBar at top if `showTrustBar` (Funnel D)

4. **`ProgressDots.tsx`** — `● ● ○` style for Funnel C
   - Props: `{ current, total }`

5. **`ProgressPills.tsx`** — `1 — 2 — 3 —` numbered pills for Funnel D
   - Props: `{ current, total }`

6. **`GenderTabs.tsx`** — Female / Male / Trans tab row
   - Props: `{ value, onChange, theme }`

7. **`TrustBar.tsx`** — persistent top bar (Funnel D only)
   - Left: `★★★★★ 4.8 · 50M+ Users · #1 AI Companion App`
   - Right: countdown timer + "🔥 First Month 70% OFF"
   - Countdown: `useEffect` counting down from 30 minutes on mount

8. **`LiveCounter.tsx`** — floating badge (Funnel D only)
   - `⚡ {count} people building right now`
   - Count: random number 1200–1400, animates ±20 every 8–12s
   - Fixed bottom-right corner

9. **`PersonalityModal.tsx`** — modal for selecting personality traits (Funnel D step 5)
   - Props: `{ field, options, value, onChange, onClose }`
   - Slides up from bottom on mobile

---

## Task 3: Funnel C — "Swift"

**Route:** `/lp/swift`  
**Theme:** Pink (`#EC4899`)  
**Steps:** 3

### File structure:
```
src/app/lp/swift/
  page.tsx          ← router: reads ?step= param, renders correct step
  _components/
    Step1.tsx       ← Style + Gender
    Step2.tsx       ← Ethnicity + Body Type
    Step3.tsx       ← Sign Up
```

### page.tsx
- `'use client'`
- Reads `searchParams.step` (default: 1)
- Renders `<Step1>`, `<Step2>`, or `<Step3>` based on step
- Passes `onNext`, `onBack` as navigation handlers (uses `router.push`)
- Wraps all in `<StepLayout theme="pink">`

### Step1.tsx — Style & Gender
- Logo at top (dondi.ai wordmark)
- `<ProgressDots current={1} total={3} />`
- Headline: `"BUILD YOUR AI SLUT"` (white, bold, uppercase, large)
- `<GenderTabs>` (Female/Male/Trans)
- Two `<PhotoCard>` side by side: Realistic / Anime
- `NEXT →` button (pink, disabled until style selected)
- Framer Motion: fade-in on mount

### Step2.tsx — Her Look
- `<ProgressDots current={2} total={3} />`
- Headline: `"WHAT DOES SHE LOOK LIKE?"`
- Section label: Ethnicity — 6 PhotoCards in 2×3 grid (mobile) / 3×2 (desktop)
- Section label: Body Type — 5 PhotoCards in 2-col (mobile) / row (desktop)
- `← Back` (ghost) + `NEXT →` (pink)

### Step3.tsx — Sign Up
- Full-screen dark bg with blurred realistic/anime image (from step 1 selection) as backdrop (CSS blur filter)
- Frosted glass overlay card (backdrop-blur, semi-transparent dark)
- Headline: `"SHE IS READY TO BE FUCKED"` (large, white)
- Auto-generated name line: `"{name} is waiting for you. Create your free account to unlock her."`
- Name auto-generated from `names.ts` based on ethnicity selection
- `Sign Up With Google` button (white bg, Google logo SVG)
- `— or —` divider
- Email input, Password input
- `CREATE ACCOUNT →` (pink, full-width)
- Fine print + `Already have an account? Log in >`
- All form interactions are UI-only (no submission handlers)

---

## Task 4: Funnel D — "Ignite"

**Route:** `/lp/ignite`  
**Theme:** Purple (`#8B5CF6`)  
**Steps:** 6

### File structure:
```
src/app/lp/ignite/
  page.tsx
  _components/
    Step1.tsx    ← Style + Gender (with trust bar)
    Step2.tsx    ← Ethnicity + Skin Tone
    Step3.tsx    ← Hair (eye color, hair color, hair style)
    Step4.tsx    ← Body (type, breast, butt)
    Step5.tsx    ← Personality (name, age, traits + live preview card)
    Step6.tsx    ← Sign Up
```

### page.tsx
- `'use client'`
- Renders `<TrustBar>` (always visible across all steps)
- Renders `<LiveCounter>` (floating)
- Step routing via `searchParams.step`
- Wraps in `<StepLayout theme="purple" showTrustBar>`

### Step1.tsx
- `<ProgressPills current={1} total={6} />`
- Headline: `"BUILD YOUR AI SLUT"`
- Sub: `"Join 50M+ who already have their perfect AI companion"`
- `<GenderTabs theme="purple">`
- Realistic / Anime PhotoCards
- CTA: `START BUILDING →`

### Step2.tsx
- Headline: `"WHAT DOES SHE LOOK LIKE?"`
- Ethnicity (6 cards) — White card gets `badge="🔥 Most Popular"`
- Skin Tone (7 `<ColorSwatch>` components)

### Step3.tsx
- Headline: `"STYLE HER YOUR WAY"`
- Eye Color (9 `<ColorSwatch>` — Blue gets badge)
- Hair Color (9 `<ColorSwatch>` — Black gets badge)
- Hair Style (10 `<PhotoCard>` — Long gets `badge="🔥 Most Popular"`)

### Step4.tsx
- Headline: `"BUILD HER BODY"`
- Body Type (5 cards, Slim gets badge)
- Breast Size (5 cards, Medium gets badge)
- Butt Size (5 cards, Medium gets badge)
- Social nudge text: `"89% of users chose their body in under 30 seconds"`

### Step5.tsx
- Headline: `"MAKE HER YOURS"`
- Name input (editable, pre-filled from names.ts)
- Age scroll picker (18–40, default 23)
- 3×2 grid of personality trait cards (tap to open `<PersonalityModal>`):
  - Voice, Personality, Occupation, Relationship, Hobby, Fetish
  - Defaults: Voice=Avery, Personality=Shy, Occupation=Stripper, Relationship=Crush
- **Live preview card** (right side desktop / below on mobile):
  - Shows character name, age, style, ethnicity, key traits as chips
  - Progress bar: "She's 80% ready 🔥" (static 80%)
- CTA: `FINISH HER →`

### Personality Options (for PersonalityModal):
```
Voice: Avery, Emma, Sophia, Aria, Luna
Personality: Shy, Bold, Playful, Dominant, Submissive, Intellectual, Romantic
Occupation: Stripper, Nurse, Student, Teacher, Model, CEO, Maid
Relationship: Crush, Girlfriend, Friend, Dominant, Submissive, Wife
Hobby: Yoga, Gaming, Reading, Cooking, Dancing, Fitness
Fetish: (leave as selectable list with common options)
```

### Step6.tsx — Sign Up
- Full-screen background: blurred character silhouette image (Realistic or Anime based on style choice)
- Frosted glass overlay card
- Headline: `"SHE IS READY TO BE FUCKED"` (large, white)
- Character summary: `"{name} · {gender} · {style} · Age {age}"`
- Lock icon + sub: `"Create your free account to unlock her"`
- Urgency: `"🔥 Your spot is reserved for {countdown}"` (04:59 countdown, per-session)
- `Sign Up With Google` (white button)
- `— or —`
- Email + Password inputs
- `UNLOCK {NAME} NOW →` (purple, pulsing animation)
- `By signing up, you agree to Terms of Service & Privacy Policy`
- `Already have an account? Log in >`

---

## Task 5: Final Review & Smoke Test

1. Run `npm run build` — no TypeScript or ESLint errors
2. Run `npm run dev` in worktree
3. Verify both routes load: `http://localhost:3000/lp/swift` and `/lp/ignite`
4. Click through all steps of both funnels
5. Check mobile layout (resize to 375px)
6. Commit all changes

---

## Implementation Notes

- **CSS variables:** define `--accent-pink: #EC4899` and `--accent-purple: #8B5CF6` in globals.css
- **Font:** use `font-black` / `font-extrabold` for headlines (matches existing site)
- **Images:** use `next/image` with `width` and `height` props; `object-fit: cover`
- **Animations:** Framer Motion `<motion.div>` with `initial={{ opacity: 0, x: 20 }}` / `animate={{ opacity: 1, x: 0 }}` for step transitions
- **No real Google OAuth** — button is styled but onClick does nothing
- **No form submission** — inputs are controlled but submit button does nothing
- **localStorage** — clear funnel state on completing (reaching step 3/6)
