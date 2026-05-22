# Leap Ahead

**Leap** is a hackathon prototype for an AI-guided education and career planning app. It helps students explore what comes after school — universities, bootcamps, TAFE, and more — with a friendly mascot, **Jumpy**, as the guide.

Most of the product UI is wired up with **mock data** today. Supabase is configured for a future `generate-content` edge function (used from the Journey Log content studio).

---

## What the app does (current build)

| Area | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Marketing home page: features, how it works, CTA to start the quiz |
| **Onboarding quiz** | `/quiz` | Multi-step questionnaire (profile, academics, career, finance, personality, lifestyle). Answers are saved to `sessionStorage` |
| **Pathway results** | `/results` | Top pathway recommendations with match scores, costs, and rationale (mock pathways derived from quiz context) |
| **AI chat** | `/chat` | Chat UI with Jumpy; replies are **mock** for now (“real Jumpy AI is coming soon”) |
| **Dashboard** | `/dashboard` | Progress through application phases, checklist, news feed, and quick links (mock user) |
| **Discover** | `/discover` | Search and filter universities, courses, scholarships, accommodation (mock listings) |
| **Plans** | `/plans` | Top 3 pathways — main plan plus backups, with compare UI (mock) |
| **Roadmap** | `/roadmap` | Step-by-step application journey, university milestones, and personal-brand coaching tabs (mock phases) |
| **Journey log** | `/journey` | Log events, workshops, projects, internships, etc.; add entries and open detail views. Local state via `experiences-store` |
| **New experience** | `/journey/new` | Form to add a journey log entry |
| **Experience detail** | `/journey/:id` | View/edit an entry; **Content Studio** can call Supabase `generate-content` when configured |
| **About me** | `/about-me` | Profile summary from quiz-style fields (mock profile) |

**Jumpy** appears across the app (floating launcher on most pages) and links into chat. The stack is **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **React Router**, and **TanStack Query**, with **Supabase** client env vars for backend integration.

---

## How to run locally

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (npm included), or [Bun](https://bun.sh/)

### 1. Install dependencies

```bash
npm install
```

Or with Bun:

```bash
bun install
```

### 2. Environment variables

Copy or create a `.env` file in the project root with your Supabase project values (already present if you cloned from the team setup):

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

The app runs without a working Supabase backend for most pages; only features that invoke Supabase (e.g. content generation) need valid credentials.

### 3. Start the dev server

```bash
npm run dev
```

The app is served at **http://localhost:8080** (see `vite.config.ts`).

### Other scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm test` | Run Vitest tests once |
| `npm run test:watch` | Vitest in watch mode |

---

# List of Hackathon project ideas

- This repository
- Something like this https://github.com/LukePrior/nbn-upgrade-map but with a heatmap included
- Something like this https://anonion.vercel.app/login but opinion is from AI not friends
- something like https://www.clicky.so, this is difficult so we use https://github.com/jasonkneen/openclicky as jumping off point
- 
