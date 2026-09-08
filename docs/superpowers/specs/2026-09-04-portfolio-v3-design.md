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
  - Amended 2026-09-05 (polish pass): one family, Bricolage Grotesque, loaded with its `opsz` and `wdth` axes. The headline uses `font-stretch: 82%`; dates use tabular numerals instead of a mono face. Pill tags are gone from rows and the modal; the type is a plain word at the right of each row and the modal lists tags comma-separated.
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

## Round 2: personality (agreed 2026-09-05)

Calvin's verdict on round 1: "feels like a google doc." Diagnosis: one text column, nothing drawn for him, no motion, the shark exists only as an emoji. Round 2 spends its boldness on one thing and keeps the rest quiet.

### The shark

- A single-stroke line drawing (SVG, `currentColor`, no fill, round caps) drawn in this round. Friendly: rounded snout, small smile, dot eye, three gills, falcate dorsal fin, lopsided tail, swept pectoral fin.
- Lives in three places: the hero beside the headline, the nav mark (replaces 🦈), and the favicon (`src/app/icon.svg`).
- Hero behaviour: on load the body outline draws itself (stroke-dash), then fin, gills, eye and mouth appear; afterwards it idles with a slow sway. On pointer devices it tilts a few degrees toward the cursor. `prefers-reduced-motion` shows the finished drawing, static.
- The intro copy keeps 🦈 out; the drawing is the shark now. Footer and about lines keep their emoji.

### Motion that answers an action (framer-motion, already a dependency)

- Filter change: rows FLIP into their new positions; the teal underline slides between filter labels (shared `layoutId`).
- Row hover (pointer devices only): a small thumbnail of the entry's image floats near the cursor. Rows stay text-only at rest. Entries without an image show nothing.
- Modal: the panel scales and fades in on desktop, slides up as a sheet on mobile; the row title and the dialog title share a `layoutId` so the title travels. Closing reverses it.
- All of the above collapse to instant changes under `prefers-reduced-motion`.

### Quiet texture

- A faint SVG noise grain fixed over the page in both themes (`pointer-events: none`, low opacity, mix-blend for dark).
- The ":D" in the headline is rotated 90° so the face looks at the reader, and blinks every few seconds (CSS keyframe, disabled under reduced motion). The h1 text content stays `i like 2 build stuff :D` for tests and screen readers.

### Cuts

- The icon cloud is removed from the home page (six icons 404 from the CDN and it is the most templated element). Skills appear on the about page as a comma-separated line from `resume.json`.
- No custom cursor, no scroll-triggered reveals.

### Deferred

- "dive / surface" theme toggle relabel and shark dip on toggle.
- Light theme as default instead of system.

## Round 3: scroll events (agreed 2026-09-06)

Calvin asked for scroll-driven moments like hanluxi.com: the statement that types out as you scroll, and the nav that starts partway down and catches the top of the screen. Measured on the reference: the hero fills the first screen with no nav; the typed heading is per-character opacity driven by scroll progress with a darker "cursor" character; the nav is in flow after it and sticks at top with a translucent bar; a later block is pinned for ~2.5 screens while three lines highlight in turn.

Home page order:

1. **Hero**, full viewport, no nav: shark, headline, contact row, small scroll hint. The shark swims left as the hero scrolls out.
2. **Statement**: the old intro paragraphs as one large statement, pinned while a tall section scrolls past; characters appear in order with scroll and the leading character is teal. Copy in `COPY.statement`. A visually hidden copy carries the full text for assistive tech.
3. **Nav**: moved out of the layout. In flow here, `position: sticky; top: 0`, paper-tinted blurred bar; a hairline appears only once stuck (`data-stuck`). The about page renders the nav at the top as before.
4. **Three things**: pinned block; heading, three lines that turn from muted to ink one at a time with scroll, then a closing line. Copy in `COPY.three`.
5. List, footer unchanged.

Reduced motion: no pinning, all text shown, no scroll-linked transforms. The nav still sticks.

### Revised the same day

Calvin's reaction: the typed bio was "a huge wall of text", and the pinned block ("besides drawing sharks, i've also:") copied the reference's block too closely. Changes:

- The statement is one sentence: "building things since before i knew what a compiler was." Larger type, runway cut to about one screen.
- The pinned three-things block is removed.
- In its place, a shark pass: between the nav and the list, the hero shark re-enters from the right and crosses the page once at low opacity, driven by scroll. Decorative, hidden under reduced motion.
- The "scroll" hint under the hero stays at Calvin's request.

Rule going forward: borrow mechanics from a reference, never its copy pattern or section order.

## Round 4 (2026-09-06)

- The nav also carries github, linkedin, email and resume. Icons only below the sm breakpoint, where the name is hidden too.
- The shark roams: instead of one pass, a fixed shark behind the content swims back and forth across the viewport for as long as you scroll, one crossing per ~1500px, turning around off-screen. Fades in as the hero leaves. Removed under reduced motion.
- Skills marquee on the home page after the list, full-bleed, four rows (languages, frameworks, infra, tools) at different speeds and alternating directions. Each list renders twice and wraps. Hover slows a row to 20%; drag scrubs 1:1; a fling adds momentum that decays back. Clicking a skill highlights it, dims the rest, and shows a one-line "used at/in" line derived from resume.json (override per skill in `COPY.skills.notes`). Reduced motion stops the base scroll but keeps drag and click. Rows are defined in `src/data/adapters/v3-skills.ts`. The about page no longer lists skills.

### Width rhythm (2026-09-06)

Calvin: the full-bleed marquee next to a padded column was jarring. Fix: make full width part of the page's language. The typed statement sits in an inverted full-width band (ink on paper, paper on ink in dark mode) that fills a screen while pinned. The skills section is a surface-toned band with the marquee inside it. The sticky nav bar and the section rules above the list, the footer and the about page's school section run edge to edge. All band content stays on the column grid via `.v3-band-inner`. The shark now turns around every 650px of scroll.

### Hero and band revisions (2026-09-06)

- Hero: the name "Calvin Wong" as the h1 with the subtitle "making stuff @ Google". The old headline "i like 2 build stuff :D" is now the line that types out in the ink band, with the rotated blinking face kept.
- Clicking a skill only highlights it and dims the rest; the "used in" detail line is removed.
- The roaming shark is also painted inside the ink band, in the band's text colour, at exactly the spot the fixed copy occupies, so it appears to swim straight through the band.
