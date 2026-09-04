# Portfolio v3 Design Spec

Agreed with Calvin on 2026-09-04 after a grilling session. Inspiration: https://hanluxi.com (structure and minimalism only).

## Concept

- Single-page, minimal, text-forward site at the root route. Intro, then one merged filterable list.
- Desk stays at `/v2`, the original site stays at `/v1`. Both linked from the footer as "previous versions".
- Audience: new-grad SWE recruiters and anyone curious. Primary action: resume or email.

## Top of page (in order)

1. Name, small, in mono.
2. Headline: `i like 2 build stuff :D`
3. Two or three casual sentences: CS at Rice, Houston, Classics national champion, one shark line. No "open to roles" line.
4. Icon row: GitHub, LinkedIn, email, resume. Resume links to `https://drive.google.com/file/d/1NwmvVTxZRttriLxp67aF-FjOEdVptH6c/view?usp=sharing`. Row repeats in the footer.
5. Skills globe: the existing v1 `IconCloud` component reused as-is (Calvin will replace it later). Sits between intro and list.
6. Filters + list.
7. Footer.

## List

- Work, projects, and hackathons merged. Education is not in the list.
- Filters: `all` / `work` / `projects` / `hackathons`. Single-select, no counts. Active filter in the URL as `?filter=`; `all` means no param.
- Row: emoji, title, date range, one-line tagline, type tag. No tech tags, no thumbnails.
- Sort: newest first by start date, ongoing entries (no end date) pinned to top.
- Click opens a modal. Modal shows: emoji, title, type, date range, location if any, tags (role for work, technologies for projects), description paragraphs, links, image or video if present, company logo for work. MLH badge is dropped.
- Modal is URL-addressable via `?item=<slug>` and coexists with `?filter=`. Escape, close button, and backdrop click close it.
- Mobile (< 640px): modal is a full-screen sheet. Desktop: centered card with dimmed backdrop.

## About page (`/about`)

- Longer bio drafted in Calvin's casual voice for him to edit, education (Rice, Klein Collins), the Classics story, photo at `public/me.png`, the shark line, contact row.
- The 56-item skills grid is dropped everywhere.

## Visual system

- Warm paper palette carried over from Desk, with dark mode.
  - Light: paper `#fffdf8`, surface `#f4efe6`, line `#eee7da`, ink `#201c15`, ink-muted `#6b6559`.
  - Dark: paper `#181a1f`, surface `#22252b`, line `#33373f`, ink `#e7e9ec`, ink-muted `#9aa0a8`.
- Accent teal `#00B5D8` for non-text accents (active filter underline, hover, focus rings) and for everything in dark mode. Link text in light mode uses `#007a91` (passes 4.5:1 on paper).
- Space Grotesk for UI and headings, IBM Plex Mono for name, dates, tags, filter labels. Fonts load in the root layout.
- Site-wide lowercase copy. Proper nouns, entry titles, and company names keep their real casing.
- Shark: 🦈 as brand mark in the nav and as the favicon. Plain filter labels. One shark line each in the intro, footer, and about page. Interactive shark deferred.

## Data

- `resume.json` stays the single source of truth. Schema extended additively on every work, project, and hackathon entry: `slug`, `tagline`, `emoji`, `startDate` (ISO `YYYY-MM` or `YYYY-MM-DD`), `endDate` (same, or `null` for ongoing). Existing display strings (`start`, `end`, `dates`) stay so v1 and v2 keep working.
- Project dates are inferred from GitHub repo creation dates and flagged for Calvin to correct.
- A thin v3 adapter merges the three arrays into one sorted `Entry[]`.

## Cleanup

Remove: `gsap`, `@gsap/react`, `lenis`, `three`, `@react-three/fiber`, `@react-three/drei`; hooks `useCursor`, `useScrollDepth`, `useScrollAnimation`, `useReducedMotion`, `useIsMobile`; `src/lib/fishSimulation.ts`; `public/models/`; ocean/abyss/coral Tailwind tokens and the v2 ocean CSS in `globals.css`; `test-results/`; the local `.sisyphus/` folder.

Keep Playwright. Add smoke tests: page loads, filter updates URL and list, modal opens from URL.

## Delivery

`v3` branch, small commits, one PR into `main`. Vercel preview on the PR is the deploy check.
