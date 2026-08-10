/**
 * v3 "Scroll World" adapter
 *
 * Maps the shared resume.json (DATA) into the config object the scroll-world
 * engine consumes: an ordered list of scenes the camera flies through, each
 * carrying its own copy, accent and (optionally) a pre-rendered dive clip.
 *
 * The shape here deliberately matches the `mountScrollWorld()` contract from the
 * oso95/scroll-world skill — `sections[]` with `still`/`clip`/`clipMobile`, a
 * top-level `connectors[]` of length sections-1, and `diveScroll`/`connScroll`
 * pacing. Asset paths are computed up front but the files are optional: until
 * they exist the renderer falls back to a procedural CSS dive, so /v3 works with
 * nothing in public/scroll-world at all.
 *
 * As with the v1 and v2 adapters, only art direction (accent, mood, eyebrow) is
 * authored here — every fact on screen still comes from resume.json.
 */
import { DATA } from "@/data";

/** A single item listed inside a scene's overlay panel (a job, a project, …). */
export interface SceneItem {
  label: string;
  meta?: string;
  note?: string;
  href?: string;
}

/** Visual character of a scene, consumed by the procedural CSS dive renderer. */
export type SceneMood =
  | "horizon"
  | "hall"
  | "arena"
  | "tower"
  | "grid"
  | "sprint"
  | "signal";

export interface ScrollWorldSection {
  id: string;
  label: string;
  /** Poster image. Optional — absent until assets are generated. */
  still?: string;
  /** 16:9 dive clip. When absent the CSS dive renderer takes over. */
  clip?: string;
  /** Native 9:16 portrait dive clip, used on coarse-pointer/narrow viewports. */
  clipMobile?: string;
  /** First frame of the portrait clip, used as the mobile poster. */
  stillMobile?: string;
  /** Pacing overrides, both <= 1, multiplied into the global dive length. */
  scroll?: number;
  linger?: number;
  accent: string;
  mood: SceneMood;
  eyebrow: string;
  title: string;
  body: string;
  tags?: string[];
  items?: SceneItem[];
  cta?: { label: string; href: string; kind: "primary" | "secondary" }[];
}

export interface ScrollWorldConfig {
  brand: { name: string; initials: string };
  /** Viewport-heights of scroll per dive clip. */
  diveScroll: number;
  /** Viewport-heights of scroll per connector clip. */
  connScroll: number;
  sections: ScrollWorldSection[];
  /** Connector clip paths, length = sections.length - 1. */
  connectors?: string[];
  connectorsMobile?: string[];
}

/** Where the scroll-world skill's generated assets get copied to. */
const ASSET_ROOT = "/scroll-world";

/**
 * Assets are wired optimistically: the paths follow the skill's naming
 * convention (`vid/dive_<i>.mp4`, `_m` suffix for portrait) so a generated
 * `assets/` tree can be copied into public/scroll-world and light up with no
 * code change. `HAS_ASSETS` stays false until that copy happens.
 *
 * Flip this to true once public/scroll-world/vid is populated.
 */
export const HAS_ASSETS = false;

function diveClip(i: number) {
  return HAS_ASSETS ? `${ASSET_ROOT}/vid/dive_${i}.mp4` : undefined;
}
function diveClipMobile(i: number) {
  return HAS_ASSETS ? `${ASSET_ROOT}/vid/dive_${i}_m.mp4` : undefined;
}
function still(i: number) {
  return HAS_ASSETS ? `${ASSET_ROOT}/stills/scene_${i}.png` : undefined;
}
function stillMobile(i: number) {
  return HAS_ASSETS ? `${ASSET_ROOT}/stills_mobile/scene_${i}_m.png` : undefined;
}

/** Compact "Feb 2025 — Aug 2025" style range. */
function range(start: string, end: string): string {
  return end && end !== start ? `${start} — ${end}` : start;
}

/** First sentence of a longer blurb, for the scene list rows. */
function firstSentence(text: string): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  const cut = trimmed.match(/^(.{0,150}?[.!?])(\s|$)/);
  return cut ? cut[1] : trimmed.slice(0, 150);
}

/** Hackathon descriptions lead with a "Won ..." line when there was a placing. */
function hackathonAward(description: string): string | undefined {
  const first = description.split("\n")[0]?.trim();
  return first && /^won/i.test(first) ? first : undefined;
}

const socials = Object.values(DATA.contact.social).filter(
  (s) => s.navbar && s.name !== "Send Email"
);

const sections: ScrollWorldSection[] = [
  {
    id: "arrival",
    label: "Arrival",
    accent: "#5b8cff",
    mood: "horizon",
    eyebrow: DATA.location,
    title: DATA.name,
    body: DATA.description,
    tags: ["Software Engineer", "Rice University", "Class of 2027"],
    scroll: 0.9,
    linger: 1,
  },
  {
    id: "rice",
    label: "Study",
    accent: "#3fb6a8",
    mood: "hall",
    eyebrow: "Where it's being built",
    title: "Rice University",
    body: DATA.education[0]?.degree ?? "",
    items: DATA.education.map((e) => ({
      label: e.school,
      meta: range(e.start, e.end),
      note: e.degree,
      href: e.href,
    })),
    scroll: 0.85,
    linger: 0.95,
  },
  {
    id: "classics",
    label: "Sidequest",
    accent: "#e0a63a",
    mood: "arena",
    eyebrow: "A brief detour",
    title: "National Champion, Classics.",
    body: DATA.summary,
    tags: ["Certamen", "Classical Civilizations minor", "Lead Organizer"],
    scroll: 0.9,
    linger: 1,
  },
  {
    id: "work",
    label: "Work",
    accent: "#6f7bff",
    mood: "tower",
    eyebrow: `${DATA.work.length} roles`,
    title: "Shipping in the real world.",
    body: "From a trading-floor bank to a national physics lab — the places the work has actually gone to production.",
    items: DATA.work.map((w) => ({
      label: w.company,
      meta: `${w.title} · ${range(w.start, w.end)}`,
      note: w.location,
      href: w.href,
    })),
    scroll: 1,
    linger: 1.25,
  },
  {
    id: "projects",
    label: "Projects",
    accent: "#c86bff",
    mood: "grid",
    eyebrow: `${DATA.projects.length} builds`,
    title: "Things built because they should exist.",
    body: "Mock servers, pantry inventories, trading simulators — each one started as a problem worth solving twice.",
    items: DATA.projects.map((p) => ({
      label: p.title,
      meta: p.technologies.slice(0, 3).join(" · "),
      note: firstSentence(p.description),
      href: p.links?.[0]?.href || p.href,
    })),
    scroll: 1,
    linger: 1.35,
  },
  {
    id: "hackathons",
    label: "Hackathons",
    accent: "#ff7a59",
    mood: "sprint",
    eyebrow: `${DATA.hackathons.length} weekends`,
    title: "Built between Friday and Sunday.",
    body: "Short deadlines, strange constraints, and a surprising number of trophies.",
    items: DATA.hackathons.map((h) => ({
      label: h.title,
      meta: [h.location, hackathonAward(h.description)].filter(Boolean).join(" · "),
      note: firstSentence(h.description.split("\n").slice(-1)[0] ?? h.description),
      href: h.links?.[0]?.href,
    })),
    scroll: 0.9,
    linger: 1,
  },
  {
    id: "contact",
    label: "Contact",
    accent: "#4fd1c5",
    mood: "signal",
    eyebrow: "The end of the flight",
    title: "Let's build something.",
    body: `Currently at Rice, always up for interesting problems. The fastest way to reach me is email.`,
    items: [
      {
        label: "Email",
        meta: DATA.contact.email,
        href: `mailto:${DATA.contact.email}`,
      },
      ...socials.map((s) => ({
        label: s.name,
        meta: s.url.replace(/^https?:\/\//, "").replace(/\/+$/, ""),
        href: s.url,
      })),
    ],
    cta: [
      { label: "Email me", href: `mailto:${DATA.contact.email}`, kind: "primary" },
      { label: "Résumé", href: DATA.resumeUrl, kind: "secondary" },
    ],
    scroll: 0.8,
    linger: 1.2,
  },
];

export const V3_DATA: ScrollWorldConfig = {
  brand: { name: DATA.name, initials: DATA.initials },
  diveScroll: 0.8,
  connScroll: 0.5,
  sections: sections.map((s, i) => ({
    ...s,
    still: still(i),
    stillMobile: stillMobile(i),
    clip: diveClip(i),
    clipMobile: diveClipMobile(i),
  })),
  connectors: HAS_ASSETS
    ? sections.slice(1).map((_, i) => `${ASSET_ROOT}/vid/connector_${i}.mp4`)
    : undefined,
  connectorsMobile: HAS_ASSETS
    ? sections.slice(1).map((_, i) => `${ASSET_ROOT}/vid/connector_${i}_m.mp4`)
    : undefined,
};
