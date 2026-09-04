# Portfolio v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the root route with a minimal, text-forward, single-page portfolio (intro, skills globe, merged filterable list with URL-addressable modals, about page), keep `/v1` and `/v2` as archives, and remove dead code.

**Architecture:** `resume.json` stays the single source of truth and gains five additive fields per entry. A pure adapter (`src/data/adapters/v3.ts`) merges work, projects, and hackathons into one sorted `Entry[]`. A route group `src/app/(v3)/` owns `/` and `/about`, with its own layout providing the theme provider, nav, and footer. All list state (filter, open item) lives in URL search params via a small pure helper plus one hook. Components live in `src/components/v3/`, one per file.

**Tech Stack:** Next.js 14.2 App Router, React 18, TypeScript, Tailwind 3.4, next-themes 0.4, react-icon-cloud 4.1, lucide-react, `bun test` for unit tests, Playwright 1.58 for e2e.

**Spec:** `docs/superpowers/specs/2026-09-04-portfolio-v3-design.md`

## Global Constraints

- Run every command from the repo root `C:\Users\calvi\OneDrive\Desktop\github\portfolio`. The shell is Git Bash.
- Package manager is bun (`bun.lock`), but `package-lock.json` must be kept in sync with `npm install --package-lock-only --ignore-scripts` after any dependency change.
- Never modify `src/components/v1/**`, `src/components/v2/**`, `src/app/v1/**`, `src/app/v2/**`, or `src/data/adapters/v1.tsx` / `v2.ts` except where a task explicitly says so.
- All site copy is lowercase except proper nouns, entry titles, company names, and school names.
- Colors: paper `#fffdf8` / `#181a1f`, surface `#f4efe6` / `#22252b`, line `#eee7da` / `#33373f`, ink `#201c15` / `#e7e9ec`, ink-muted `#6b6559` / `#9aa0a8`, teal `#00b5d8`, teal-ink `#007a91` light / `#00b5d8` dark. Use the Tailwind tokens defined in Task 5, never raw hex in components.
- Fonts: Tailwind `font-grotesk` (Space Grotesk) for UI, `font-plex` (IBM Plex Mono) for name, dates, tags, filters.
- Unit tests: `bun test src`. E2E: `npx playwright test --reporter=list`. Type check: `npx tsc --noEmit`. Build: `bun run build`.
- Commit after every task with the exact message given. Do not push until Task 12.
- Resume URL: `https://drive.google.com/file/d/1NwmvVTxZRttriLxp67aF-FjOEdVptH6c/view?usp=sharing`

---

## File map

| Path | Responsibility |
|---|---|
| `src/data/types.ts` | Add `TimelineFields` and extend the three entry interfaces |
| `src/data/resume.json` | Add slug/tagline/emoji/startDate/endDate to 15 entries, new resume URL |
| `src/data/adapters/v3.ts` | Pure: `buildEntries`, `sortEntries`, `filterEntries`, `findEntry`, `formatDateRange`, `FILTERS`, `ENTRIES` |
| `src/data/adapters/v3.test.ts` | Unit tests for the adapter |
| `src/data/v3-copy.ts` | All v3 prose (headline, intro, hints, footer, about) in one editable file |
| `src/lib/v3-url.ts` | Pure: `parseListParams`, `buildListHref` |
| `src/lib/v3-url.test.ts` | Unit tests for the URL helper |
| `src/app/layout.tsx` | Load Space Grotesk + Plex Mono variables alongside Inter |
| `src/app/globals.css` | Remove ocean CSS, add v3 CSS variables |
| `src/app/icon.svg` | 🦈 favicon |
| `src/app/(v3)/layout.tsx` | Theme provider, page shell, nav, footer |
| `src/app/(v3)/page.tsx` | Home: Intro, SkillsGlobe, EntryList |
| `src/app/(v3)/about/page.tsx` | About page |
| `src/components/v3/SiteNav.tsx` | Brand link, about link, theme toggle |
| `src/components/v3/ThemeToggle.tsx` | next-themes toggle (client) |
| `src/components/v3/Footer.tsx` | Contact row, previous versions, shark line |
| `src/components/v3/ContactRow.tsx` | GitHub / LinkedIn / email / resume links |
| `src/components/v3/Intro.tsx` | Name, headline, intro paragraphs, contact row |
| `src/components/v3/SkillsGlobe.tsx` | Client wrapper around the shared IconCloud |
| `src/components/v3/useListParams.ts` | Hook bridging next/navigation and `v3-url` |
| `src/components/v3/FilterBar.tsx` | Filter buttons |
| `src/components/v3/EntryRow.tsx` | One list row |
| `src/components/v3/EntryList.tsx` | Filters + rows + modal wiring (client) |
| `src/components/v3/EntryModal.tsx` | Modal / mobile sheet |
| `src/components/v3/AboutContent.tsx` | About page body |
| `src/components/shared/magicui/icon-cloud.tsx` | Add optional bg + container style props, use `resolvedTheme` |
| `tailwind.config.ts` | Remove ocean tokens, add v3 tokens and fonts |
| `next.config.mjs` | Remove the `/` → `/v2` redirect |
| `package.json` | Remove dead deps, add `test` and `test:e2e` scripts |
| `e2e/v3.spec.ts` | Playwright smoke tests |

---

### Task 1: Branch and cleanup

**Files:**
- Modify: `package.json`, `tailwind.config.ts`, `src/app/globals.css`, `src/data/types.ts:6-13`, `.gitignore`
- Delete: `src/hooks/useCursor.ts`, `src/hooks/useScrollDepth.ts`, `src/hooks/useScrollAnimation.ts`, `src/hooks/useReducedMotion.ts`, `src/hooks/useIsMobile.ts`, `src/lib/fishSimulation.ts`, `public/models/`, `test-results/`, `.sisyphus/`

**Interfaces:**
- Consumes: nothing.
- Produces: a repo that type-checks and builds without the six dead dependencies. Tailwind no longer defines `ocean`, `abyss`, `coral`.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b v3
```

- [ ] **Step 2: Confirm the orphans really are orphans**

```bash
grep -rn "useCursor\|useScrollDepth\|useScrollAnimation\|useReducedMotion\|useIsMobile\|fishSimulation\|scene.gltf\|from \"gsap\|from \"three\|from \"lenis\|@react-three" src --include=*.ts --include=*.tsx | grep -v "^src/hooks/\|^src/lib/fishSimulation"
```

Expected: no output. If anything prints, stop and report it instead of deleting.

- [ ] **Step 3: Delete orphaned files and folders**

```bash
git rm -q src/hooks/useCursor.ts src/hooks/useScrollDepth.ts src/hooks/useScrollAnimation.ts src/hooks/useReducedMotion.ts src/hooks/useIsMobile.ts src/lib/fishSimulation.ts
git rm -rq public/models
rm -rf test-results .sisyphus
```

- [ ] **Step 4: Remove dead dependencies and sync both lockfiles**

```bash
bun remove @gsap/react gsap lenis three @react-three/fiber @react-three/drei
npm install --package-lock-only --ignore-scripts
```

Expected: `package.json` dependencies no longer list those six packages. `bun.lock` and `package-lock.json` both change.

- [ ] **Step 5: Add test scripts to package.json**

In `package.json`, replace the `scripts` block with:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "bun test src",
    "test:e2e": "playwright test --reporter=list"
  },
```

- [ ] **Step 6: Remove ocean tokens from tailwind.config.ts**

Delete these lines from `tailwind.config.ts` (inside `theme.extend.colors`):

```ts
        // Ocean theme (V2)
        ocean: {
          cyan: "#00B5D8",
          blue: "#3182CE",
          deep: "#1a365d",
          light: "#EBF8FF",
          text: "#1A202C",
          muted: "#718096",
        },
        abyss: {
          DEFAULT: "#0A1628",
          text: "#E2E8F0",
        },
        // Legacy
        coral: '#FF6B6B',
```

- [ ] **Step 7: Remove ocean CSS from globals.css**

Delete these blocks from `src/app/globals.css`:

```css
  /* V2 scoped tokens (ocean theme) */
  [data-portfolio="v2"] {
    @apply bg-ocean-light text-ocean-text;
  }

  .dark [data-portfolio="v2"] {
    @apply bg-abyss text-abyss-text;
  }

  [data-portfolio="v2"] * {
    @apply border-ocean-muted/20;
  }

  /* Hide default cursor on desktop when custom cursor active (v2) */
  @media (hover: hover) and (pointer: fine) {
    body.custom-cursor-active {
      cursor: none;
    }

    body.custom-cursor-active a,
    body.custom-cursor-active button,
    body.custom-cursor-active [data-interactive] {
      cursor: none;
    }
  }
```

and

```css
@layer utilities {
  /* HUD text styling (v2) */
  .hud-text {
    @apply font-mono text-xs uppercase tracking-wider text-ocean-muted;
  }

  .dark .hud-text {
    @apply text-ocean-muted/70;
  }
}
```

- [ ] **Step 8: Fix the stale comment in types.ts**

Replace lines 6-13 of `src/data/types.ts`:

```ts
/**
 * Skill category
 */
export type SkillCategory = "language" | "framework" | "tool" | "design" | "ai";
```

- [ ] **Step 9: Ignore Playwright's report folder**

Append to `.gitignore` under `# testing`:

```
playwright-report/
```

- [ ] **Step 10: Verify types and build**

```bash
npx tsc --noEmit && bun run build
```

Expected: tsc prints nothing. Build finishes with routes `/v1` and `/v2` listed and no errors. (`/` is still a redirect at this point.)

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: remove dead deps, orphaned hooks, and ocean theme leftovers"
```

---

### Task 2: Extend the resume.json schema

**Files:**
- Modify: `src/data/types.ts`, `src/data/resume.json`

**Interfaces:**
- Produces: `TimelineFields { slug; tagline; emoji; startDate; endDate: string | null }` mixed into `WorkExperience`, `Project`, `Hackathon`. Every entry in `resume.json` has those five fields. `resumeUrl` updated.

- [ ] **Step 1: Add TimelineFields to types.ts**

Insert after the `Skill` interface in `src/data/types.ts`:

```ts
/** ISO date, "YYYY-MM" or "YYYY-MM-DD". Compared as strings, so keep zero-padded. */
export type IsoDate = string;

/**
 * Fields every timeline entry (work, project, hackathon) needs for the v3 merged list.
 */
export interface TimelineFields {
  /** URL-safe id, unique across work, projects and hackathons. Used in ?item=. */
  slug: string;
  /** One line shown under the title in the list. Lowercase except proper nouns. */
  tagline: string;
  /** Single emoji shown beside the title. */
  emoji: string;
  startDate: IsoDate;
  /** null means ongoing. */
  endDate: IsoDate | null;
}
```

Then change the three interface headers:

```ts
export interface WorkExperience extends TimelineFields {
```
```ts
export interface Project extends TimelineFields {
```
```ts
export interface Hackathon extends TimelineFields {
```

- [ ] **Step 2: Update resumeUrl**

In `src/data/resume.json` line 2:

```json
  "resumeUrl": "https://drive.google.com/file/d/1NwmvVTxZRttriLxp67aF-FjOEdVptH6c/view?usp=sharing",
```

- [ ] **Step 3: Add fields to the five work entries**

Add these five keys to each object in `"work"`, placed directly after `"company"`. Also blank the two placeholder hrefs.

JPMorgan Chase:
```json
      "slug": "jpmorgan-chase",
      "tagline": "software engineering intern · full-stack legal app on hybrid cloud",
      "emoji": "🏦",
      "startDate": "2025-02",
      "endDate": "2025-08",
```

Fermilab:
```json
      "slug": "fermilab",
      "tagline": "designed and built the web presence for the DUNE experiment",
      "emoji": "⚛️",
      "startDate": "2024-10",
      "endDate": "2025-05",
```

Headstarter:
```json
      "slug": "headstarter",
      "tagline": "software engineering fellow · seven weeks of shipping",
      "emoji": "🚀",
      "startDate": "2024-07",
      "endDate": "2024-09",
```

Owl Certamen (also change `"href": "https://shopify.com"` to `"href": ""`):
```json
      "slug": "owl-certamen",
      "tagline": "lead organizer of Rice's classics quiz-bowl tournament",
      "emoji": "🏛️",
      "startDate": "2023-07",
      "endDate": "2024-01",
```

Oculosophy (also change `"href": "https://shopify.com"` to `"href": ""`):
```json
      "slug": "oculosophy",
      "tagline": "graphic designer",
      "emoji": "🎨",
      "startDate": "2020-06",
      "endDate": "2020-08",
```

- [ ] **Step 4: Add fields to the six project entries**

Place directly after `"title"`. Dates are inferred from GitHub repo creation dates; Calvin will correct them.

MockOwl:
```json
      "slug": "mockowl",
      "tagline": "api mocking platform across http, grpc and websockets",
      "emoji": "🦉",
      "startDate": "2025-01",
      "endDate": "2025-01",
```

PantryPal:
```json
      "slug": "pantrypal",
      "tagline": "pantry inventory with voice and image input",
      "emoji": "🥫",
      "startDate": "2024-07",
      "endDate": "2024-08",
```

Market Madness:
```json
      "slug": "market-madness",
      "tagline": "paper-trading sim with an ai investment coach",
      "emoji": "📈",
      "startDate": "2024-09",
      "endDate": "2024-09",
```

AI Customer Service Chatbot:
```json
      "slug": "ai-customer-service-chatbot",
      "tagline": "rag-powered support chat with auth and feedback",
      "emoji": "💬",
      "startDate": "2024-08",
      "endDate": "2024-08",
```

Money Buddy:
```json
      "slug": "money-buddy",
      "tagline": "discord bot that reads your receipts",
      "emoji": "🧾",
      "startDate": "2023-09",
      "endDate": "2023-09",
```

Calc Hunter:
```json
      "slug": "calc-hunter",
      "tagline": "browser game that sneaks calculus into treasure hunting",
      "emoji": "🎮",
      "startDate": "2023-04",
      "endDate": "2023-04",
```

- [ ] **Step 5: Add fields to the four hackathon entries**

Place directly after `"title"`. Also add `"mlh": ""` to KleinHacks 21, which is missing it.

HackRice 14:
```json
      "slug": "hackrice-14",
      "tagline": "built Market Madness in 36 hours",
      "emoji": "🏁",
      "startDate": "2024-09-20",
      "endDate": "2024-09-23",
```

HackRice 13:
```json
      "slug": "hackrice-13",
      "tagline": "won Capital One's best financial hack with Money Buddy",
      "emoji": "🏆",
      "startDate": "2023-09-24",
      "endDate": "2023-09-26",
```

KleinHacks 23:
```json
      "slug": "kleinhacks-23",
      "tagline": "first place overall with Calc Hunter",
      "emoji": "🥇",
      "startDate": "2023-04-04",
      "endDate": "2023-04-06",
```

KleinHacks 21:
```json
      "slug": "kleinhacks-21",
      "tagline": "third place overall with a frog-crossing Unity game",
      "emoji": "🥉",
      "startDate": "2021-03-06",
      "endDate": "2021-03-07",
```

- [ ] **Step 6: Verify JSON parses and types check**

```bash
node -e "const d=require('./src/data/resume.json');const all=[...d.work,...d.projects,...d.hackathons];console.log(all.length, all.every(e=>e.slug&&e.tagline&&e.emoji&&e.startDate&&'endDate' in e))" && npx tsc --noEmit
```

Expected: `15 true` and no tsc output.

- [ ] **Step 7: Commit**

```bash
git add src/data/types.ts src/data/resume.json
git commit -m "feat(data): add slug, tagline, emoji, and ISO dates to every timeline entry"
```

---

### Task 3: v3 adapter (pure, unit-tested)

**Files:**
- Create: `src/data/adapters/v3.ts`, `src/data/adapters/v3.test.ts`

**Interfaces:**
- Consumes: `ResumeData`, `TimelineFields` from `@/data/types`; `DATA` from `@/data`.
- Produces:
  - `ENTRY_TYPES: readonly ["work","projects","hackathons"]`, `type EntryType`
  - `FILTERS: readonly ["all","work","projects","hackathons"]`, `type Filter`, `isFilter(v): v is Filter`
  - `interface Entry extends TimelineFields { type: EntryType; title: string; dateLabel: string; description: string[]; tags: string[]; links: {type: string; href: string}[]; image: string | null; video: string | null; logo: string | null; location: string | null }`
  - `formatMonth(iso): string`, `formatDateRange(start, end): string`
  - `buildEntries(data: ResumeData): Entry[]` (sorted), `sortEntries(entries): Entry[]`, `filterEntries(entries, filter): Entry[]`, `findEntry(entries, slug): Entry | null`
  - `ENTRIES: Entry[]` built from `DATA`

- [ ] **Step 1: Write the failing tests**

Create `src/data/adapters/v3.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import type { ResumeData } from "@/data/types";
import {
  buildEntries,
  ENTRIES,
  filterEntries,
  findEntry,
  formatDateRange,
  formatMonth,
  isFilter,
  sortEntries,
} from "./v3";

const fixture = {
  work: [
    {
      company: "Acme", href: "https://acme.test", badges: ["contract"], location: "Remote",
      title: "Engineer", logoUrl: "/acme.png", start: "Jan 2024", end: "Mar 2024",
      description: "Did things.",
      slug: "acme", tagline: "engineer", emoji: "🏢", startDate: "2024-01", endDate: "2024-03",
    },
    {
      company: "Ongoing Co", href: "", badges: [], location: "", title: "Lead", logoUrl: "",
      start: "Feb 2023", end: "Present", description: "Still here.",
      slug: "ongoing", tagline: "lead", emoji: "♾️", startDate: "2023-02", endDate: null,
    },
  ],
  projects: [
    {
      title: "Widget", href: "", active: true, description: "A widget.",
      technologies: ["TS", "React"],
      links: [{ type: "Source", href: "https://gh.test/w", icon: "github" }, { type: "Demo", href: "", icon: "globe" }],
      image: "/widget.png", video: "",
      slug: "widget", tagline: "a widget", emoji: "🔧", startDate: "2024-06", endDate: "2024-06",
    },
  ],
  hackathons: [
    {
      title: "Hack 1", dates: "Sep 1st - 2nd, 2024", location: "Houston",
      description: "Won first\nBuilt a thing", image: "/h.jpg", mlh: "", links: [],
      slug: "hack-1", tagline: "won first", emoji: "🏆", startDate: "2024-09-01", endDate: "2024-09-02",
    },
  ],
} as unknown as ResumeData;

describe("formatMonth / formatDateRange", () => {
  test("formats YYYY-MM as lowercase short month", () => {
    expect(formatMonth("2025-02")).toBe("feb 2025");
  });
  test("ignores the day part", () => {
    expect(formatMonth("2024-09-20")).toBe("sep 2024");
  });
  test("collapses same-month ranges", () => {
    expect(formatDateRange("2024-09-20", "2024-09-23")).toBe("sep 2024");
  });
  test("renders spans with an en dash", () => {
    expect(formatDateRange("2025-02", "2025-08")).toBe("feb 2025 – aug 2025");
  });
  test("renders ongoing as now", () => {
    expect(formatDateRange("2025-02", null)).toBe("feb 2025 – now");
  });
});

describe("buildEntries", () => {
  const entries = buildEntries(fixture);

  test("merges all three arrays", () => {
    expect(entries.map((e) => e.slug).sort()).toEqual(["acme", "hack-1", "ongoing", "widget"]);
  });
  test("pins ongoing first, then newest start date", () => {
    expect(entries.map((e) => e.slug)).toEqual(["ongoing", "hack-1", "widget", "acme"]);
  });
  test("work entries use company as title and role plus badges as tags", () => {
    const acme = findEntry(entries, "acme")!;
    expect(acme.type).toBe("work");
    expect(acme.title).toBe("Acme");
    expect(acme.tags).toEqual(["Engineer", "contract"]);
    expect(acme.logo).toBe("/acme.png");
    expect(acme.links).toEqual([{ type: "website", href: "https://acme.test" }]);
    expect(acme.location).toBe("Remote");
  });
  test("empty strings become null", () => {
    const ongoing = findEntry(entries, "ongoing")!;
    expect(ongoing.logo).toBeNull();
    expect(ongoing.location).toBeNull();
    expect(ongoing.links).toEqual([]);
  });
  test("projects use technologies as tags and drop empty links", () => {
    const widget = findEntry(entries, "widget")!;
    expect(widget.type).toBe("projects");
    expect(widget.tags).toEqual(["TS", "React"]);
    expect(widget.links).toEqual([{ type: "Source", href: "https://gh.test/w" }]);
    expect(widget.image).toBe("/widget.png");
    expect(widget.video).toBeNull();
  });
  test("hackathon descriptions split on newlines", () => {
    const hack = findEntry(entries, "hack-1")!;
    expect(hack.type).toBe("hackathons");
    expect(hack.description).toEqual(["Won first", "Built a thing"]);
    expect(hack.dateLabel).toBe("sep 2024");
  });
});

describe("sortEntries / filterEntries / findEntry", () => {
  const entries = buildEntries(fixture);
  test("sortEntries does not mutate", () => {
    const copy = [...entries].reverse();
    const sorted = sortEntries(copy);
    expect(copy[0].slug).toBe("acme");
    expect(sorted[0].slug).toBe("ongoing");
  });
  test("filterEntries all returns everything", () => {
    expect(filterEntries(entries, "all")).toHaveLength(4);
  });
  test("filterEntries by type", () => {
    expect(filterEntries(entries, "work").map((e) => e.slug)).toEqual(["ongoing", "acme"]);
  });
  test("findEntry returns null for unknown or null slug", () => {
    expect(findEntry(entries, "nope")).toBeNull();
    expect(findEntry(entries, null)).toBeNull();
  });
});

describe("isFilter", () => {
  test("accepts known filters", () => {
    expect(isFilter("all")).toBe(true);
    expect(isFilter("hackathons")).toBe(true);
  });
  test("rejects unknown, null, undefined", () => {
    expect(isFilter("nope")).toBe(false);
    expect(isFilter(null)).toBe(false);
    expect(isFilter(undefined)).toBe(false);
  });
});

describe("ENTRIES from resume.json", () => {
  test("has 15 entries with unique slugs", () => {
    expect(ENTRIES).toHaveLength(15);
    expect(new Set(ENTRIES.map((e) => e.slug)).size).toBe(15);
  });
  test("every entry has a non-empty tagline, emoji and dateLabel", () => {
    for (const e of ENTRIES) {
      expect(e.tagline.length).toBeGreaterThan(0);
      expect(e.emoji.length).toBeGreaterThan(0);
      expect(e.dateLabel.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
bun test src
```

Expected: FAIL with `Cannot find module "./v3"`.

- [ ] **Step 3: Write the adapter**

Create `src/data/adapters/v3.ts`:

```ts
/**
 * v3 adapter
 *
 * Merges work, projects and hackathons from resume.json into one sorted,
 * filterable list of Entry objects for the v3 single-page portfolio.
 * Pure functions only; ENTRIES at the bottom is the one bound to real data.
 */
import { DATA } from "@/data";
import type { ResumeData, TimelineFields } from "@/data/types";

export const ENTRY_TYPES = ["work", "projects", "hackathons"] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export const FILTERS = ["all", ...ENTRY_TYPES] as const;
export type Filter = (typeof FILTERS)[number];

export function isFilter(v: string | null | undefined): v is Filter {
  return typeof v === "string" && (FILTERS as readonly string[]).includes(v);
}

export interface EntryLink {
  type: string;
  href: string;
}

export interface Entry extends TimelineFields {
  type: EntryType;
  title: string;
  /** e.g. "feb 2025 – aug 2025", "sep 2024", "jan 2025 – now" */
  dateLabel: string;
  /** Description split into paragraphs. */
  description: string[];
  /** Role + badges for work, technologies for projects, empty for hackathons. */
  tags: string[];
  links: EntryLink[];
  image: string | null;
  video: string | null;
  logo: string | null;
  location: string | null;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export function formatMonth(iso: string): string {
  const [year, month] = iso.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : year;
}

export function formatDateRange(start: string, end: string | null): string {
  const from = formatMonth(start);
  if (end === null) return `${from} – now`;
  const to = formatMonth(end);
  return from === to ? from : `${from} – ${to}`;
}

function paragraphs(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function orNull(s: string | undefined): string | null {
  return s ? s : null;
}

function timeline(t: TimelineFields): TimelineFields {
  return { slug: t.slug, tagline: t.tagline, emoji: t.emoji, startDate: t.startDate, endDate: t.endDate };
}

export function buildEntries(data: ResumeData): Entry[] {
  const work = data.work.map<Entry>((w) => ({
    ...timeline(w),
    type: "work",
    title: w.company,
    dateLabel: formatDateRange(w.startDate, w.endDate),
    description: paragraphs(w.description),
    tags: [w.title, ...w.badges],
    links: w.href ? [{ type: "website", href: w.href }] : [],
    image: null,
    video: null,
    logo: orNull(w.logoUrl),
    location: orNull(w.location),
  }));

  const projects = data.projects.map<Entry>((p) => ({
    ...timeline(p),
    type: "projects",
    title: p.title,
    dateLabel: formatDateRange(p.startDate, p.endDate),
    description: paragraphs(p.description),
    tags: p.technologies,
    links: p.links.filter((l) => l.href).map((l) => ({ type: l.type, href: l.href })),
    image: orNull(p.image),
    video: orNull(p.video),
    logo: null,
    location: null,
  }));

  const hackathons = data.hackathons.map<Entry>((h) => ({
    ...timeline(h),
    type: "hackathons",
    title: h.title,
    dateLabel: formatDateRange(h.startDate, h.endDate),
    description: paragraphs(h.description),
    tags: [],
    links: h.links.filter((l) => l.href).map((l) => ({ type: l.type, href: l.href })),
    image: orNull(h.image),
    video: null,
    logo: null,
    location: orNull(h.location),
  }));

  return sortEntries([...work, ...projects, ...hackathons]);
}

/** Ongoing first, then newest start date, then title. Returns a new array. */
export function sortEntries(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    const aOngoing = a.endDate === null;
    const bOngoing = b.endDate === null;
    if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;
    if (a.startDate !== b.startDate) return a.startDate < b.startDate ? 1 : -1;
    return a.title.localeCompare(b.title);
  });
}

export function filterEntries(entries: Entry[], filter: Filter): Entry[] {
  return filter === "all" ? entries : entries.filter((e) => e.type === filter);
}

export function findEntry(entries: Entry[], slug: string | null): Entry | null {
  if (!slug) return null;
  return entries.find((e) => e.slug === slug) ?? null;
}

export const ENTRIES: Entry[] = buildEntries(DATA);
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
bun test src && npx tsc --noEmit
```

Expected: all tests pass, no tsc output.

- [ ] **Step 5: Commit**

```bash
git add src/data/adapters/v3.ts src/data/adapters/v3.test.ts
git commit -m "feat(v3): add merged, sorted entry adapter with unit tests"
```

---

### Task 4: URL state helper (pure, unit-tested)

**Files:**
- Create: `src/lib/v3-url.ts`, `src/lib/v3-url.test.ts`

**Interfaces:**
- Consumes: `Filter`, `isFilter` from `@/data/adapters/v3`.
- Produces:
  - `interface ListParams { filter: Filter; item: string | null }`
  - `parseListParams(sp: URLSearchParams): ListParams`
  - `buildListHref(pathname: string, sp: URLSearchParams, patch: Partial<ListParams>): string`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/v3-url.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { buildListHref, parseListParams } from "./v3-url";

describe("parseListParams", () => {
  test("defaults to all and no item", () => {
    expect(parseListParams(new URLSearchParams(""))).toEqual({ filter: "all", item: null });
  });
  test("reads a valid filter and item", () => {
    expect(parseListParams(new URLSearchParams("filter=work&item=acme"))).toEqual({ filter: "work", item: "acme" });
  });
  test("falls back to all for an unknown filter", () => {
    expect(parseListParams(new URLSearchParams("filter=nope")).filter).toBe("all");
  });
  test("treats empty item as null", () => {
    expect(parseListParams(new URLSearchParams("item=")).item).toBeNull();
  });
});

describe("buildListHref", () => {
  test("setting a filter adds the param", () => {
    expect(buildListHref("/", new URLSearchParams(""), { filter: "work" })).toBe("/?filter=work");
  });
  test("setting filter to all removes the param", () => {
    expect(buildListHref("/", new URLSearchParams("filter=work"), { filter: "all" })).toBe("/");
  });
  test("opening an item keeps the filter", () => {
    expect(buildListHref("/", new URLSearchParams("filter=work"), { item: "acme" })).toBe("/?filter=work&item=acme");
  });
  test("closing an item keeps the filter", () => {
    expect(buildListHref("/", new URLSearchParams("filter=work&item=acme"), { item: null })).toBe("/?filter=work");
  });
  test("leaves unrelated params alone", () => {
    expect(buildListHref("/", new URLSearchParams("utm=x"), { filter: "projects" })).toBe("/?utm=x&filter=projects");
  });
  test("does not mutate the input", () => {
    const sp = new URLSearchParams("filter=work");
    buildListHref("/", sp, { filter: "all" });
    expect(sp.get("filter")).toBe("work");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
bun test src/lib
```

Expected: FAIL with `Cannot find module "./v3-url"`.

- [ ] **Step 3: Write the helper**

Create `src/lib/v3-url.ts`:

```ts
/**
 * Pure helpers for the v3 list's URL state: ?filter= and ?item=.
 * Kept free of next/navigation so it can be unit tested with bun.
 */
import { isFilter, type Filter } from "@/data/adapters/v3";

export interface ListParams {
  filter: Filter;
  item: string | null;
}

export function parseListParams(sp: URLSearchParams): ListParams {
  const filter = sp.get("filter");
  const item = sp.get("item");
  return { filter: isFilter(filter) ? filter : "all", item: item ? item : null };
}

export function buildListHref(
  pathname: string,
  sp: URLSearchParams,
  patch: Partial<ListParams>,
): string {
  const next = new URLSearchParams(sp.toString());
  if ("filter" in patch) {
    if (patch.filter && patch.filter !== "all") next.set("filter", patch.filter);
    else next.delete("filter");
  }
  if ("item" in patch) {
    if (patch.item) next.set("item", patch.item);
    else next.delete("item");
  }
  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
bun test src && npx tsc --noEmit
```

Expected: all pass, no tsc output.

- [ ] **Step 5: Commit**

```bash
git add src/lib/v3-url.ts src/lib/v3-url.test.ts
git commit -m "feat(v3): add pure URL helpers for filter and item params"
```

---

### Task 5: Design tokens, fonts, favicon, route group shell

**Files:**
- Modify: `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `next.config.mjs`
- Create: `src/app/icon.svg`, `src/app/(v3)/layout.tsx`, `src/app/(v3)/page.tsx`, `src/components/v3/SiteNav.tsx`, `src/components/v3/ThemeToggle.tsx`, `src/components/v3/Footer.tsx`, `src/components/v3/ContactRow.tsx`, `src/data/v3-copy.ts`, `e2e/v3.spec.ts`

**Interfaces:**
- Produces: Tailwind color tokens `paper`, `surface`, `line`, `ink`, `ink-muted`, `teal`, `teal-ink`; font utilities `font-grotesk`, `font-plex`. `COPY` object from `@/data/v3-copy`. Components `SiteNav`, `ThemeToggle`, `Footer`, `ContactRow({ className? })`. Root route `/` renders the v3 shell.

- [ ] **Step 1: Write the failing e2e test for the shell**

Create `e2e/v3.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home renders the v3 shell with nav and footer", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: /calvin wong/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "about", exact: true })).toHaveAttribute("href", "/about");
  await expect(page.getByRole("link", { name: "v1", exact: true })).toHaveAttribute("href", "/v1");
  await expect(page.getByRole("link", { name: "v2", exact: true })).toHaveAttribute("href", "/v2");
  await expect(page.getByRole("link", { name: "resume", exact: true }).first()).toHaveAttribute("href", /drive\.google\.com/);
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npx playwright test --reporter=list --project=chromium
```

Expected: FAIL. The URL assertion fails because `/` currently redirects to `/v2`.

- [ ] **Step 3: Remove the redirect**

Replace the whole of `next.config.mjs` with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Add v3 tokens to tailwind.config.ts**

Inside `theme.extend.colors`, after the `card` entry, add:

```ts
        // V3 warm paper tokens (values live in globals.css)
        paper: "var(--v3-paper)",
        surface: "var(--v3-surface)",
        line: "var(--v3-line)",
        ink: {
          DEFAULT: "var(--v3-ink)",
          muted: "var(--v3-ink-muted)",
        },
        teal: {
          DEFAULT: "var(--v3-teal)",
          ink: "var(--v3-teal-ink)",
        },
```

Replace the `fontFamily` block with:

```ts
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-sans)", ...fontFamily.sans],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        grotesk: ["var(--font-grotesk)", ...fontFamily.sans],
        plex: ["var(--font-plex-mono)", ...fontFamily.mono],
      },
```

- [ ] **Step 5: Add v3 CSS variables to globals.css**

Inside `@layer base`, directly after the `.dark { ... }` block that ends with `--ring: 212.7 26.8% 83.9%;`, add:

```css
  /* V3 warm paper tokens */
  :root {
    --v3-paper: #fffdf8;
    --v3-surface: #f4efe6;
    --v3-line: #eee7da;
    --v3-ink: #201c15;
    --v3-ink-muted: #6b6559;
    --v3-teal: #00b5d8;
    --v3-teal-ink: #007a91;
  }

  .dark {
    --v3-paper: #181a1f;
    --v3-surface: #22252b;
    --v3-line: #33373f;
    --v3-ink: #e7e9ec;
    --v3-ink-muted: #9aa0a8;
    --v3-teal: #00b5d8;
    --v3-teal-ink: #00b5d8;
  }
```

- [ ] **Step 6: Load the v3 fonts in the root layout**

Replace `src/app/layout.tsx` with:

```tsx
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { DATA } from "@/data";
import "./globals.css";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: { default: DATA.name, template: `%s | ${DATA.name}` },
  description: DATA.description,
  openGraph: { title: DATA.name, description: DATA.description, url: DATA.url, siteName: DATA.name, locale: "en_US", type: "website" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  twitter: { title: DATA.name, card: "summary_large_image" },
  verification: { google: "", yandex: "" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          grotesk.variable,
          plexMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Add the favicon**

Create `src/app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="88">🦈</text></svg>
```

- [ ] **Step 8: Create the copy file**

Create `src/data/v3-copy.ts`. This is the one file Calvin edits for prose; everything is a draft.

```ts
/**
 * All v3 prose in one place. Lowercase by convention except proper nouns.
 * Edit freely; nothing here is referenced by tests except `headline`.
 */
export const COPY = {
  headline: "i like 2 build stuff :D",

  intro: [
    "cs @ Rice University, based in Houston, TX. i've been making things since before i knew what a compiler was, and the design, test, fail, fix loop is still the fun part.",
    "somewhere along the way i took a sidequest into classics and won a national championship. then i came back to software, which has been way more fun than it has any right to be.",
    "🦈 always circling for the next thing to build.",
  ],

  skills: {
    label: "stuff i've played with (drag it)",
  },

  list: {
    heading: "stuff i've done",
    hint: "there's a bunch, so feel free to filter ;)",
    empty: "nothing here yet. the shark is still looking. 🦈",
  },

  footer: {
    previous: "previous versions:",
    shark: "no sharks were harmed in the making of this site 🦈",
  },

  about: {
    heading: "about me",
    paragraphs: [
      "hi, i'm Calvin. i'm a computer science student at Rice University (class of 2027) with a minor in classical civilizations, a combination that confuses recruiters and delights me.",
      "i've always liked making things and then making them better. it started with physical electronics, moved into software, and the loop of designing, testing, and failing has been the good part the whole way through.",
      "somewhere in there i took a sidequest into classics and ended up winning a national championship in certamen. then i came back to software, which has been a blast ever since.",
      "most recently i interned at JPMorgan Chase as a software engineer. before that i designed and built for Fermilab's DUNE experiment and went through Headstarter's fellowship.",
    ],
    educationHeading: "school",
    shark: "why the shark? sharks have to keep moving to breathe. so do side projects. 🦈",
  },
} as const;
```

- [ ] **Step 9: Create ContactRow**

Create `src/components/v3/ContactRow.tsx`:

```tsx
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { DATA } from "@/data";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "github", href: DATA.contact.social.GitHub.url, Icon: Github },
  { label: "linkedin", href: DATA.contact.social.LinkedIn.url, Icon: Linkedin },
  { label: "email", href: `mailto:${DATA.contact.email}`, Icon: Mail },
  { label: "resume", href: DATA.resumeUrl, Icon: FileText },
];

export function ContactRow({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 font-plex text-xs", className)}>
      {ITEMS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-teal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 10: Create ThemeToggle**

Create `src/components/v3/ThemeToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={dark ? "switch to light mode" : "switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="rounded-sm p-1 text-ink-muted transition-colors hover:text-teal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
    >
      {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
```

- [ ] **Step 11: Create SiteNav**

Create `src/components/v3/SiteNav.tsx`:

```tsx
import Link from "next/link";
import { DATA } from "@/data";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav() {
  return (
    <nav className="flex items-center justify-between py-6 text-sm">
      <Link
        href="/"
        className="font-medium transition-colors hover:text-teal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
      >
        🦈 {DATA.name.toLowerCase()}
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/about"
          className="text-ink-muted transition-colors hover:text-teal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
        >
          about
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
```

- [ ] **Step 12: Create Footer**

Create `src/components/v3/Footer.tsx`:

```tsx
import Link from "next/link";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

const PREVIOUS = [
  { label: "v1", href: "/v1" },
  { label: "v2", href: "/v2" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line py-8 font-plex text-xs text-ink-muted">
      <ContactRow />
      <p className="mt-6">
        {COPY.footer.previous}{" "}
        {PREVIOUS.map((p, i) => (
          <span key={p.href}>
            {i > 0 && " · "}
            <Link href={p.href} className="underline decoration-line underline-offset-4 hover:text-teal-ink">
              {p.label}
            </Link>
          </span>
        ))}
      </p>
      <p className="mt-2">{COPY.footer.shark}</p>
    </footer>
  );
}
```

- [ ] **Step 13: Create the route group layout and a placeholder page**

Create `src/app/(v3)/layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/shared/theme-provider";
import { SiteNav } from "@/components/v3/SiteNav";
import { Footer } from "@/components/v3/Footer";

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div data-portfolio="v3" className="min-h-screen bg-paper font-grotesk text-ink">
        <style>{`body{background:var(--v3-paper)}`}</style>
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 sm:px-6">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
```

Create `src/app/(v3)/page.tsx` (placeholder, replaced in Task 6):

```tsx
import { ContactRow } from "@/components/v3/ContactRow";

export default function HomePage() {
  return <ContactRow className="pt-10" />;
}
```

- [ ] **Step 14: Run the e2e test to verify it passes**

```bash
npx tsc --noEmit && npx playwright test --reporter=list --project=chromium
```

Expected: no tsc output, 1 passed. If the dev server fails to bind port 3000, stop any process already on it first.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat(v3): add warm paper tokens, fonts, favicon, and the root route shell"
```

---

### Task 6: Intro section and home page composition

**Files:**
- Create: `src/components/v3/Intro.tsx`
- Modify: `src/app/(v3)/page.tsx`, `e2e/v3.spec.ts`

**Interfaces:**
- Consumes: `COPY` from `@/data/v3-copy`, `DATA`, `ContactRow`.
- Produces: `Intro` server component. Home page renders `Intro`.

- [ ] **Step 1: Add the failing e2e assertion**

Append to `e2e/v3.spec.ts`:

```ts
test("home shows the headline and intro", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("i like 2 build stuff :D");
  await expect(page.getByText(/national championship/i).first()).toBeVisible();
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npx playwright test --reporter=list --project=chromium -g "headline"
```

Expected: FAIL, no h1 found.

- [ ] **Step 3: Create Intro**

Create `src/components/v3/Intro.tsx`:

```tsx
import { DATA } from "@/data";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

export function Intro() {
  return (
    <section className="pb-8 pt-8 sm:pt-12">
      <p className="font-plex text-xs text-ink-muted">{DATA.name.toLowerCase()}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{COPY.headline}</h1>
      <div className="mt-5 max-w-prose space-y-2 text-base leading-relaxed text-ink-muted">
        {COPY.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <ContactRow className="mt-6" />
    </section>
  );
}
```

- [ ] **Step 4: Compose the home page**

Replace `src/app/(v3)/page.tsx` with:

```tsx
import { Intro } from "@/components/v3/Intro";

export default function HomePage() {
  return <Intro />;
}
```

- [ ] **Step 5: Run e2e to verify it passes**

```bash
npx tsc --noEmit && npx playwright test --reporter=list --project=chromium
```

Expected: 2 passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/v3/Intro.tsx "src/app/(v3)/page.tsx" e2e/v3.spec.ts
git commit -m "feat(v3): add intro section with headline and contact row"
```

---

### Task 7: Skills globe

**Files:**
- Modify: `src/components/shared/magicui/icon-cloud.tsx`
- Create: `src/components/v3/SkillsGlobe.tsx`
- Modify: `src/app/(v3)/page.tsx`

**Interfaces:**
- Consumes: `IconCloud` default export.
- Produces: `IconCloud` gains optional props `bgHexLight?: string`, `bgHexDark?: string`, `containerStyle?: React.CSSProperties`, and uses `resolvedTheme`. `SkillsGlobe` client component.

- [ ] **Step 1: Extend IconCloud without changing v1 behavior**

Replace the section of `src/components/shared/magicui/icon-cloud.tsx` from `export const renderCustomIcon` to the end of the file with:

```tsx
export const renderCustomIcon = (icon: SimpleIcon, theme: string, bgHex?: string) => {
  const bg = bgHex ?? (theme === "light" ? "#f3f2ef" : "#080510");
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex: bg,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  });
};

export type DynamicCloudProps = {
  iconSlugs: string[];
  /** Background the icons are contrast-checked against in light mode. */
  bgHexLight?: string;
  /** Background the icons are contrast-checked against in dark mode. */
  bgHexDark?: string;
  /** Merged over the default container style (width 40%, centered). */
  containerStyle?: React.CSSProperties;
};

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

export default function IconCloud({ iconSlugs, bgHexLight, bgHexDark, containerStyle }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme ?? "light";

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
  }, [iconSlugs]);

  const renderedIcons = useMemo(() => {
    if (!data) return null;
    const bg = theme === "light" ? bgHexLight : bgHexDark;
    return Object.values(data.simpleIcons).map((icon) => renderCustomIcon(icon, theme, bg));
  }, [data, theme, bgHexLight, bgHexDark]);

  const props: Omit<ICloud, "children"> = {
    ...cloudProps,
    containerProps: {
      ...cloudProps.containerProps,
      style: { ...cloudProps.containerProps?.style, ...containerStyle },
    },
  };

  return (
    // @ts-ignore
    <Cloud {...props}>
      <>{renderedIcons}</>
    </Cloud>
  );
}
```

Also add `import type React from "react";` is not needed: `React.CSSProperties` resolves via the global JSX namespace in Next. If tsc complains, change the import line to `import React, { useEffect, useMemo, useState } from "react";`.

- [ ] **Step 2: Create SkillsGlobe**

Create `src/components/v3/SkillsGlobe.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { COPY } from "@/data/v3-copy";

const IconCloud = dynamic(() => import("@/components/shared/magicui/icon-cloud"), { ssr: false });

/** simpleicons slugs. Hand-picked; Calvin plans to replace this component later. */
const SKILL_SLUGS = [
  "typescript", "javascript", "java", "python", "c",
  "react", "nextdotjs", "nodedotjs", "prisma", "graphql",
  "html5", "css3", "tailwindcss", "mantine", "mui", "nextui",
  "amazonaws", "firebase", "vercel", "mongodb", "sql",
  "git", "github", "visualstudiocode", "intellijidea",
  "figma", "latex", "adobe", "adobephotoshop", "adobelightroom", "adobeillustrator", "adobepremierepro",
];

export function SkillsGlobe() {
  return (
    <section aria-label="skills" className="py-2">
      <p className="font-plex text-xs text-ink-muted">{COPY.skills.label}</p>
      <div className="mx-auto max-w-sm">
        <IconCloud
          iconSlugs={SKILL_SLUGS}
          bgHexLight="#fffdf8"
          bgHexDark="#181a1f"
          containerStyle={{ width: "100%", paddingTop: 8 }}
        />
      </div>
    </section>
  );
}
```

(The two raw hex values here are the paper colors; they must be literal strings because react-icon-cloud does contrast math on them, not CSS.)

- [ ] **Step 3: Add it to the home page**

Replace `src/app/(v3)/page.tsx` with:

```tsx
import { Intro } from "@/components/v3/Intro";
import { SkillsGlobe } from "@/components/v3/SkillsGlobe";

export default function HomePage() {
  return (
    <>
      <Intro />
      <SkillsGlobe />
    </>
  );
}
```

- [ ] **Step 4: Verify types, e2e, and that v1 still renders the cloud**

```bash
npx tsc --noEmit && npx playwright test --reporter=list --project=chromium
```

Expected: no tsc output, 2 passed. Then open `http://localhost:3000/v1` in the dev server (`bun run dev`) and confirm the skills globe still appears in the Skills section; open `http://localhost:3000/` and confirm a globe renders below the intro. Use the Playwright MCP or a screenshot if a browser is unavailable.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/magicui/icon-cloud.tsx src/components/v3/SkillsGlobe.tsx "src/app/(v3)/page.tsx"
git commit -m "feat(v3): reuse the icon cloud as a skills globe under the intro"
```

---

### Task 8: Filterable entry list with URL state

**Files:**
- Create: `src/components/v3/useListParams.ts`, `src/components/v3/FilterBar.tsx`, `src/components/v3/EntryRow.tsx`, `src/components/v3/EntryList.tsx`
- Modify: `src/app/(v3)/page.tsx`, `e2e/v3.spec.ts`

**Interfaces:**
- Consumes: `ENTRIES`, `FILTERS`, `Filter`, `Entry`, `filterEntries`, `findEntry` from `@/data/adapters/v3`; `parseListParams`, `buildListHref` from `@/lib/v3-url`.
- Produces:
  - `useListParams(): { filter: Filter; item: string | null; setFilter(f: Filter): void; openItem(slug: string): void; closeItem(): void }`
  - `FilterBar({ value: Filter; onChange(f: Filter): void })`
  - `EntryRow({ entry: Entry; onOpen(): void })` renders `<li>` with a `<button data-testid="entry-row" data-type={entry.type}>`
  - `EntryList()` client component. Renders a `{active && <EntryModal .../>}` slot that Task 9 fills; in this task it renders nothing for the modal.

- [ ] **Step 1: Add the failing e2e tests**

Append to `e2e/v3.spec.ts`:

```ts
test("home lists all fifteen entries newest first", async ({ page }) => {
  await page.goto("/");
  const rows = page.getByTestId("entry-row");
  await expect(rows).toHaveCount(15);
  await expect(rows.first()).toContainText("JPMorgan Chase");
  await expect(rows.last()).toContainText("Oculosophy");
});

test("filter updates the URL and the list, and survives reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "hackathons", exact: true }).click();
  await expect(page).toHaveURL(/\?filter=hackathons$/);
  const rows = page.getByTestId("entry-row");
  await expect(rows).toHaveCount(4);
  for (const row of await rows.all()) {
    await expect(row).toHaveAttribute("data-type", "hackathons");
  }
  await page.reload();
  await expect(page.getByTestId("entry-row")).toHaveCount(4);
  await expect(page.getByRole("button", { name: "hackathons", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "all", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId("entry-row")).toHaveCount(15);
});
```

- [ ] **Step 2: Run them to verify they fail**

```bash
npx playwright test --reporter=list --project=chromium -g "entries|filter"
```

Expected: 2 failed, no `entry-row` elements.

- [ ] **Step 3: Create useListParams**

Create `src/components/v3/useListParams.ts`:

```ts
"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Filter } from "@/data/adapters/v3";
import { buildListHref, parseListParams } from "@/lib/v3-url";

export function useListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filter, item } = parseListParams(searchParams);

  const setFilter = useCallback(
    (next: Filter) => {
      router.replace(buildListHref(pathname, searchParams, { filter: next }), { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const openItem = useCallback(
    (slug: string) => {
      router.push(buildListHref(pathname, searchParams, { item: slug }), { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const closeItem = useCallback(() => {
    router.replace(buildListHref(pathname, searchParams, { item: null }), { scroll: false });
  }, [router, pathname, searchParams]);

  return { filter, item, setFilter, openItem, closeItem };
}
```

- [ ] **Step 4: Create FilterBar**

Create `src/components/v3/FilterBar.tsx`:

```tsx
import { FILTERS, type Filter } from "@/data/adapters/v3";
import { cn } from "@/lib/utils";

export function FilterBar({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div role="group" aria-label="filter" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-plex text-xs">
      {FILTERS.map((f) => {
        const active = f === value;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f)}
            className={cn(
              "border-b-2 pb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm",
              active ? "border-teal text-ink" : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Create EntryRow**

Create `src/components/v3/EntryRow.tsx`:

```tsx
import type { Entry } from "@/data/adapters/v3";

export function EntryRow({ entry, onOpen }: { entry: Entry; onOpen: () => void }) {
  return (
    <li>
      <button
        type="button"
        data-testid="entry-row"
        data-type={entry.type}
        onClick={onOpen}
        className="group -mx-2 flex w-full items-start gap-3 rounded-md px-2 py-4 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        <span aria-hidden className="pt-0.5 text-xl leading-none">{entry.emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-medium transition-colors group-hover:text-teal-ink">{entry.title}</span>
            <span className="font-plex text-xs text-ink-muted">{entry.dateLabel}</span>
          </span>
          <span className="mt-1 block text-sm text-ink-muted">{entry.tagline}</span>
        </span>
        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 font-plex text-[11px] text-ink-muted">
          {entry.type}
        </span>
      </button>
    </li>
  );
}
```

- [ ] **Step 6: Create EntryList**

Create `src/components/v3/EntryList.tsx`:

```tsx
"use client";

import { ENTRIES, filterEntries, findEntry } from "@/data/adapters/v3";
import { COPY } from "@/data/v3-copy";
import { EntryRow } from "./EntryRow";
import { FilterBar } from "./FilterBar";
import { useListParams } from "./useListParams";

export function EntryList() {
  const { filter, item, setFilter, openItem, closeItem } = useListParams();
  const visible = filterEntries(ENTRIES, filter);
  const active = findEntry(ENTRIES, item);

  return (
    <section id="list" className="py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-medium">{COPY.list.heading}</h2>
        <p className="font-plex text-xs text-ink-muted">{COPY.list.hint}</p>
      </div>
      <FilterBar value={filter} onChange={setFilter} />
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">{COPY.list.empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-b border-t border-line">
          {visible.map((entry) => (
            <EntryRow key={entry.slug} entry={entry} onOpen={() => openItem(entry.slug)} />
          ))}
        </ul>
      )}
      {/* Task 9 replaces this with <EntryModal entry={active} onClose={closeItem} /> */}
      {active && <span data-testid="modal-slot" hidden>{active.slug}</span>}
    </section>
  );
}
```

- [ ] **Step 7: Add the list to the home page inside Suspense**

Replace `src/app/(v3)/page.tsx` with:

```tsx
import { Suspense } from "react";
import { Intro } from "@/components/v3/Intro";
import { SkillsGlobe } from "@/components/v3/SkillsGlobe";
import { EntryList } from "@/components/v3/EntryList";

export default function HomePage() {
  return (
    <>
      <Intro />
      <SkillsGlobe />
      <Suspense fallback={null}>
        <EntryList />
      </Suspense>
    </>
  );
}
```

`useSearchParams` in a client component requires a Suspense boundary for static rendering in Next 14; without it `next build` fails with "Missing Suspense boundary with useSearchParams".

- [ ] **Step 8: Run tests to verify they pass**

```bash
bun test src && npx tsc --noEmit && npx playwright test --reporter=list --project=chromium
```

Expected: unit tests pass, no tsc output, 4 e2e passed.

- [ ] **Step 9: Commit**

```bash
git add src/components/v3/useListParams.ts src/components/v3/FilterBar.tsx src/components/v3/EntryRow.tsx src/components/v3/EntryList.tsx "src/app/(v3)/page.tsx" e2e/v3.spec.ts
git commit -m "feat(v3): add merged entry list with URL-synced filters"
```

---

### Task 9: Entry modal

**Files:**
- Create: `src/components/v3/EntryModal.tsx`
- Modify: `src/components/v3/EntryList.tsx`, `e2e/v3.spec.ts`

**Interfaces:**
- Consumes: `Entry` from `@/data/adapters/v3`; `closeItem` from `useListParams`.
- Produces: `EntryModal({ entry: Entry; onClose(): void })`. Renders `role="dialog"` with `aria-labelledby="entry-title"`, an `<h2 id="entry-title">`, a close button labelled "close", and a backdrop button labelled "close dialog".

- [ ] **Step 1: Add the failing e2e tests**

Append to `e2e/v3.spec.ts`:

```ts
test("modal opens from the URL and escape closes it", async ({ page }) => {
  await page.goto("/?item=mockowl");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "MockOwl" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /source/i })).toHaveAttribute("href", /github\.com/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("clicking a row opens its modal and keeps the filter", async ({ page }) => {
  await page.goto("/?filter=work");
  await page.getByTestId("entry-row").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/filter=work/);
  await expect(page).toHaveURL(/item=jpmorgan-chase/);
  await page.getByRole("button", { name: "close", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\?filter=work$/);
});
```

- [ ] **Step 2: Run them to verify they fail**

```bash
npx playwright test --reporter=list --project=chromium -g "modal"
```

Expected: 2 failed, no dialog.

- [ ] **Step 3: Create EntryModal**

Create `src/components/v3/EntryModal.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Entry } from "@/data/adapters/v3";

export function EntryModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center sm:justify-center sm:p-6">
      <button
        type="button"
        aria-label="close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-title"
        className="relative flex h-full w-full flex-col overflow-y-auto bg-paper p-6 text-ink outline-none sm:h-auto sm:max-h-[85vh] sm:max-w-xl sm:rounded-2xl sm:border sm:border-line sm:p-8 sm:shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute right-5 top-5 rounded-sm font-plex text-xs text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          esc ✕
        </button>

        <header className="flex items-start gap-3 pr-16">
          {entry.logo ? (
            <Image src={entry.logo} alt="" width={40} height={40} className="size-10 rounded-md object-contain" />
          ) : (
            <span aria-hidden className="text-3xl leading-none">{entry.emoji}</span>
          )}
          <div className="min-w-0">
            <h2 id="entry-title" className="text-xl font-semibold leading-tight">{entry.title}</h2>
            <p className="mt-1 font-plex text-xs text-ink-muted">
              {entry.type} · {entry.dateLabel}
              {entry.location ? ` · ${entry.location}` : ""}
            </p>
          </div>
        </header>

        {entry.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-surface px-2 py-0.5 font-plex text-[11px] text-ink-muted">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 space-y-3 text-sm leading-relaxed text-ink-muted">
          {entry.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {entry.links.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-plex text-xs">
            {entry.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-ink underline decoration-line underline-offset-4 hover:decoration-teal"
                >
                  {l.type.toLowerCase()} ↗
                </a>
              </li>
            ))}
          </ul>
        )}

        {entry.video ? (
          <video src={entry.video} controls muted playsInline className="mt-6 w-full rounded-lg border border-line" />
        ) : entry.image ? (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg border border-line bg-surface">
            <Image
              src={entry.image}
              alt={`${entry.title} screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, 576px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire it into EntryList**

In `src/components/v3/EntryList.tsx`, add the import:

```ts
import { EntryModal } from "./EntryModal";
```

and replace the two lines

```tsx
      {/* Task 9 replaces this with <EntryModal entry={active} onClose={closeItem} /> */}
      {active && <span data-testid="modal-slot" hidden>{active.slug}</span>}
```

with

```tsx
      {active && <EntryModal entry={active} onClose={closeItem} />}
```

- [ ] **Step 5: Run the full e2e suite on both projects**

```bash
npx tsc --noEmit && npx playwright test --reporter=list
```

Expected: no tsc output, 12 passed (6 tests × chromium + Mobile Chrome).

- [ ] **Step 6: Visually check both breakpoints**

With `bun run dev` running, open `http://localhost:3000/?item=hackrice-13` at desktop width and at 390px width. Desktop: centered card with dimmed backdrop. Mobile: sheet fills the screen. Use the Playwright MCP `browser_resize` and `browser_take_screenshot` if no manual browser is available. Fix any overflow before committing.

- [ ] **Step 7: Commit**

```bash
git add src/components/v3/EntryModal.tsx src/components/v3/EntryList.tsx e2e/v3.spec.ts
git commit -m "feat(v3): add URL-addressable entry modal with mobile sheet"
```

---

### Task 10: About page

**Files:**
- Create: `src/components/v3/AboutContent.tsx`, `src/app/(v3)/about/page.tsx`
- Modify: `e2e/v3.spec.ts`

**Interfaces:**
- Consumes: `DATA.education`, `DATA.avatarUrl`, `COPY.about`, `ContactRow`.
- Produces: `/about` route.

- [ ] **Step 1: Add the failing e2e test**

Append to `e2e/v3.spec.ts`:

```ts
test("about page shows bio, education, and photo", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("about me");
  await expect(page.getByText("Rice University")).toBeVisible();
  await expect(page.getByText("Klein Collins")).toBeVisible();
  await expect(page.getByRole("img", { name: /calvin/i })).toBeVisible();
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npx playwright test --reporter=list --project=chromium -g "about page"
```

Expected: FAIL with 404.

- [ ] **Step 3: Create AboutContent**

Create `src/components/v3/AboutContent.tsx`:

```tsx
import Image from "next/image";
import { DATA } from "@/data";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

export function AboutContent() {
  return (
    <article className="pb-8 pt-8 sm:pt-12">
      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-prose">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{COPY.about.heading}</h1>
          <div className="mt-5 space-y-3 text-base leading-relaxed text-ink-muted">
            {COPY.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface sm:size-36">
          <Image src={DATA.avatarUrl} alt={`photo of ${DATA.name}`} fill sizes="144px" className="object-cover" priority />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-plex text-xs text-ink-muted">{COPY.about.educationHeading}</h2>
        <ul className="mt-3 divide-y divide-line border-b border-t border-line">
          {DATA.education.map((edu) => (
            <li key={edu.school} className="flex items-start gap-3 py-4">
              <Image src={edu.logoUrl} alt="" width={32} height={32} className="size-8 rounded-md object-contain" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <a
                    href={edu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium transition-colors hover:text-teal-ink"
                  >
                    {edu.school}
                  </a>
                  <span className="font-plex text-xs text-ink-muted">
                    {edu.start} – {edu.end}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{edu.degree}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-ink-muted">{COPY.about.shark}</p>
      <ContactRow className="mt-6" />
    </article>
  );
}
```

- [ ] **Step 4: Create the page**

Create `src/app/(v3)/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import { AboutContent } from "@/components/v3/AboutContent";

export const metadata: Metadata = { title: "about" };

export default function AboutPage() {
  return <AboutContent />;
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx tsc --noEmit && npx playwright test --reporter=list
```

Expected: no tsc output, 14 passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/v3/AboutContent.tsx "src/app/(v3)/about/page.tsx" e2e/v3.spec.ts
git commit -m "feat(v3): add about page with bio draft, education, and photo"
```

---

### Task 11: Full verification and visual pass

**Files:**
- Possibly modify any `src/components/v3/*` file for visual fixes only.

- [ ] **Step 1: Run everything**

```bash
bun test src && npx tsc --noEmit && bun run build && npx playwright test --reporter=list
```

Expected: all green. Build output lists `/`, `/about`, `/v1`, `/v2` as static routes. Note the `First Load JS` of `/` in the build output.

- [ ] **Step 2: Screenshot light and dark, desktop and mobile**

Start `bun run dev` and capture, using the Playwright MCP tools (`browser_navigate`, `browser_resize`, `browser_take_screenshot`), or manually:

1. `/` at 1280×900 light
2. `/` at 1280×900 dark (click the theme toggle)
3. `/` at 390×844 light
4. `/?item=jpmorgan-chase` at 1280×900
5. `/?item=jpmorgan-chase` at 390×844
6. `/about` at 1280×900

Check against the spec: lowercase copy, teal only on non-text accents in light mode, mono for name/dates/tags/filters, no horizontal scroll on mobile, modal readable in dark mode. Fix and re-run the suite for anything off. Save screenshots to `docs/superpowers/plans/screenshots/` is not required; do not commit them.

- [ ] **Step 3: Confirm archives still work**

Open `/v1` and `/v2`. Both must render as before. `/v2` must not have inherited a white body background (the v3 `<style>` tag is only in the v3 layout, so it should not).

- [ ] **Step 4: Commit any visual fixes**

```bash
git add -A
git commit -m "style(v3): visual fixes from screenshot pass"
```

Skip this commit if nothing changed.

---

### Task 12: Push and open the PR

- [ ] **Step 1: Push the branch**

```bash
git push -u origin v3
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --base main --head v3 --title "feat: v3 minimal single-page portfolio" --body "$(cat <<'EOF'
## Summary

- Replaces the root route with a minimal, text-forward single-page portfolio inspired by hanluxi.com: intro, skills globe, one merged filterable list (work / projects / hackathons), URL-addressable modals, and an `/about` page.
- Keeps `/v1` and `/v2` as archives, linked from the footer.
- Extends `resume.json` additively with `slug`, `tagline`, `emoji`, `startDate`, `endDate` on every timeline entry.
- Removes dead dependencies (gsap, three, lenis, react-three) and orphaned hooks/assets from the abandoned ocean theme.
- Adds `bun test` unit tests for the adapter and URL helpers, and Playwright smoke tests.

## Needs Calvin's eyes

- Project `startDate`/`endDate` values were inferred from GitHub repo creation dates. Correct them in `src/data/resume.json`.
- All prose is a draft in `src/data/v3-copy.ts`.
- Owl Certamen and Oculosophy had placeholder `href` values pointing at shopify.com; they are now blank.

## Test plan

- [ ] `bun test src`
- [ ] `npx playwright test`
- [ ] Vercel preview: `/`, `/?filter=hackathons`, `/?item=mockowl`, `/about`, `/v1`, `/v2`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Report the PR URL**

Print the URL from the previous command's output.

---

## Self-review

**Spec coverage.** Top-of-page order (Task 6, 7, 8). Filters single-select, URL-synced, `all` unset (Tasks 4, 8). Row content and sort (Tasks 3, 8). Modal contents, URL addressing, escape/close/backdrop, mobile sheet (Task 9). About page contents (Task 10). Palette, dark mode, fonts, lowercase, teal rules (Task 5, enforced in components). Shark in nav, favicon, intro, footer, about (Tasks 5, 6, 10). Data schema additive with inferred dates (Task 2). Archives reachable from footer (Task 5). Cleanup list (Task 1). Playwright smoke tests (Tasks 5 through 10). Branch and PR (Tasks 1, 12). The MLH badge is simply never rendered.

**Placeholder scan.** None. Every step has literal code or a literal command.

**Type consistency.** `Entry`, `Filter`, `FILTERS`, `filterEntries`, `findEntry`, `ENTRIES` are defined in Task 3 and consumed by the same names in Tasks 4, 8, 9. `parseListParams` / `buildListHref` defined in Task 4, consumed in Task 8. `COPY` shape (`headline`, `intro`, `skills.label`, `list.heading/hint/empty`, `footer.previous/shark`, `about.heading/paragraphs/educationHeading/shark`) defined in Task 5 and consumed in Tasks 6 through 10 with matching keys. `ContactRow({ className? })` defined in Task 5 and used in Tasks 6 and 10. `IconCloud` new props defined in Task 7 and used in the same task.
