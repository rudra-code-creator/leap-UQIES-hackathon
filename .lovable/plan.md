

## Goal
Replace the About Me nav item with **Journey Log** — a Notion-style experience tracker + AI Content Studio + Personal Brand Coaching tab in Roadmap. AI drafting wired to Lovable AI Gateway via Lovable Cloud.

## Architecture

### 1. Backend (Lovable Cloud + edge function)
- Enable Lovable Cloud (creates Supabase project, auto-provisions `LOVABLE_API_KEY`).
- New edge function `supabase/functions/generate-content/index.ts`:
  - Input: `{ experience: {...}, format: "linkedin" | "instagram" | "tiktok" | "twitter" | "portfolio", tone: "professional" | "casual" }`
  - Calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with a format-specific system prompt that returns `{ text, hashtags[] }` via tool calling (structured output).
  - Handles 429/402 with proper error codes; CORS headers.
  - `verify_jwt = false` (public — no auth in this app yet).

### 2. Routing & nav (`src/App.tsx`, `src/components/Navbar.tsx`)
- Replace `/about-me` with `/journey` in navbar links list (label: "Journey Log", icon: BookOpen).
- Keep `/about-me` route reachable (profile photo / avatar still opens it) — just removed from navbar.
- Add new routes inside `AppLayout`:
  - `/journey` → `JourneyLog.tsx` (grid + filters)
  - `/journey/:id` → `ExperienceDetail.tsx`
  - `/journey/new` → `NewExperience.tsx` (quick log form)

### 3. Mock data (`src/lib/mock-data.ts`)
Add:
- `mockExperiences[]` — 8 entries across types (event, workshop, volunteer, project, internship). Each: `id, title, type, date, location, photoUrl, reflection, takeaways[], peopleMet[{name, role, linkedin}], skills[], impact?, postedTo: { linkedin: bool, instagram: bool, ... }`.
- `mockBrandProgress` — LinkedIn completeness %, posts/month, network growth points, modules with checklist items.
- Use placeholder Unsplash-style image refs (or solid color cards if offline).

### 4. Pages

**`JourneyLog.tsx`** (`/journey`)
- Header: "Journey Log" + subtitle "Document your wins. Build your brand." + primary CTA "+ Log experience".
- Top filter chips: All / Events / Workshops / Volunteering / Projects / People Met.
- 3-column responsive grid of experience cards (photo, title, type badge, date, "3 skills · 5 contacts", post status pills).
- Right rail (desktop only, lg+): "Quick add" voice-note style button (visual), "Upcoming events" mock list, "Brand streak" (X experiences logged this month).

**`ExperienceDetail.tsx`** (`/journey/:id`)
- Header with photo, title, type, date, location, back link.
- Sections: Reflection, Key Takeaways (bullets), People I Met (avatar rows w/ LinkedIn icon), Skills (tags), Impact stats.
- Action bar (sticky): "✨ Create LinkedIn post", "📸 Instagram", "🎥 TikTok script", "🐦 X thread", "📄 Portfolio entry", "Edit".
- Clicking an action opens `<ContentStudioModal>`.

**`NewExperience.tsx`** (`/journey/new`)
- Simple form: title, type select, date, location, photo URL, reflection, comma-separated takeaways, skills. Save → push to in-memory store (zustand-lite via React context) and redirect to detail. Persist in `localStorage` so it survives reloads (no DB tables for experiences this pass — request says "AI" specifically).

**Roadmap.tsx restructure**
- Wrap in `<Tabs>` with three triggers: "Application Journey" (existing content), "University Milestones" (placeholder card grid: Orientation, First Semester, Internship Search, Graduation — locked/unlocked states), "Personal Brand Coaching".
- **Coaching tab**: 
  - 3 metric cards on top: LinkedIn Completeness (Progress bar 65%, "Fix this now" → links), Content Consistency (1/4 posts this month + Jumpy nudge linking to unposted experiences in Journey Log), Network Growth (mock sparkline using a simple SVG / divs).
  - 4 module cards (Foundations, Content Strategy, Thought Leadership, Portfolio Building) each with checkbox list (visual only).
  - Jumpy weekly check-in banner: "I noticed you logged 'Robotics Workshop' but haven't shared it. Draft a post? →" linking to that experience's detail.

### 5. Components

**`src/components/ContentStudioModal.tsx`**
- Built on shadcn `Dialog`.
- 4 steps in one modal: Format tabs (LinkedIn/Instagram/TikTok/X/Portfolio) → Tone slider (Professional ↔ Casual) → "Generate" button calls `supabase.functions.invoke('generate-content', { body: { experience, format, tone } })` → shows loading skeleton → renders editable textarea + hashtag chips + "Regenerate" + "Copy" + "Save draft" (toast).
- Shows the experience's photo as suggested media.
- Handles 429 ("rate limited, try again"), 402 ("add credits") via toast.

**`src/components/ExperienceCard.tsx`** — reusable grid card.

**`src/components/JumpyNudge.tsx`** — small banner (Jumpy + message + CTA), used on Coaching tab and optionally Journey Log empty/sparse state.

### 6. Styling
- Reuse existing teal/coral/sand tokens. Type/format badges use existing accent classes.
- Cards: `rounded-3xl border-2 border-border bg-surface` to match current Plans/Roadmap aesthetic.
- Post-status pills: green check for posted, muted for draft.

## Files

**New**
- `supabase/functions/generate-content/index.ts`
- `src/pages/JourneyLog.tsx`, `src/pages/ExperienceDetail.tsx`, `src/pages/NewExperience.tsx`
- `src/components/ContentStudioModal.tsx`, `src/components/ExperienceCard.tsx`, `src/components/JumpyNudge.tsx`
- `src/lib/experiences-store.ts` (localStorage-backed list with seed = mockExperiences)

**Edited**
- `src/App.tsx` (routes)
- `src/components/Navbar.tsx` (replace About Me link with Journey Log)
- `src/lib/mock-data.ts` (add `mockExperiences`, `mockBrandProgress`)
- `src/pages/Roadmap.tsx` (wrap in tabs, add Coaching + Milestones tabs)

## Out of scope (explicit)
- No real LinkedIn/Instagram/Twitter posting — copy-to-clipboard only.
- No DB tables for experiences (localStorage instead) — keeps the AI piece focused.
- No image upload/cropping — use a URL field + photo from Unsplash placeholders.
- No real analytics — Network Growth chart is visual mock.
- About Me page stays reachable (profile avatar links to it) but removed from navbar per your decision.

