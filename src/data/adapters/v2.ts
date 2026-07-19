/**
 * v2 "Desk" adapter
 *
 * Maps the shared resume.json (DATA) into the shapes the desktop-OS UI needs:
 * projects become "apps" (emoji + tile color + short stack), social links become
 * contact rows, and the about card pulls name/role/bio straight from the JSON.
 *
 * Only presentation (emoji, tile color, tag) is derived here — all crucial
 * information still lives in resume.json, the single source of truth.
 */
import { DATA } from "@/data";

export interface DeskProject {
  id: string;
  name: string;
  icon: string;
  tag: string;
  color: string;
  stack: string;
  tech: string[];
  desc: string;
  links: { type: string; href: string }[];
  /** Optional numeric highlights; the metric row is hidden when empty. */
  highlights: { value: string; label: string }[];
}

export interface DeskContact {
  icon: string;
  label: string;
  value: string;
  href: string;
}

/** Tile palette from the design handoff, cycled across projects. */
const TILE_COLORS = ["#cfe8ff", "#ffe4d1", "#d5f3ea", "#e8d6ff", "#fff0b8", "#f4e6c0"];

/** Per-project emoji + short tag, keyed by title (falls back to a generic app icon). */
const PROJECT_META: Record<string, { icon: string; tag: string }> = {
  MockOwl: { icon: "🦉", tag: "devtools" },
  PantryPal: { icon: "🥫", tag: "ai" },
  "Market Madness": { icon: "📈", tag: "ai · finance" },
  "AI Customer Service Chatbot": { icon: "💬", tag: "ai · rag" },
  "Money Buddy": { icon: "🧾", tag: "python" },
  "Calc Hunter": { icon: "🎮", tag: "game" },
};

function slug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const deskProjects: DeskProject[] = DATA.projects.map((p, i) => {
  const meta = PROJECT_META[p.title] ?? { icon: "🗂️", tag: "project" };
  return {
    id: slug(p.title),
    name: p.title,
    icon: meta.icon,
    tag: meta.tag,
    color: TILE_COLORS[i % TILE_COLORS.length],
    stack: p.technologies.slice(0, 3).join(" · ").toUpperCase(),
    tech: p.technologies,
    desc: p.description,
    links: p.links.map((l) => ({ type: l.type, href: l.href })).filter((l) => l.href),
    highlights: [],
  };
});

/** Build a human-readable handle/value from a social URL. */
function socialValue(name: string, url: string): string {
  if (name === "GitHub") return "@" + url.replace(/\/+$/, "").split("/").pop();
  if (name === "LinkedIn") return "/in/" + url.replace(/\/+$/, "").split("/in/").pop();
  if (url.startsWith("mailto:")) return url.replace("mailto:", "");
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

const SOCIAL_ICON: Record<string, string> = {
  github: "🐙",
  linkedin: "💼",
  email: "✉️",
  x: "𝕏",
  youtube: "▶️",
  globe: "🌐",
};

export const deskContacts: DeskContact[] = [
  { icon: "✉️", label: "Email", value: DATA.contact.email, href: `mailto:${DATA.contact.email}` },
  ...Object.values(DATA.contact.social)
    .filter((s) => s.name !== "Send Email" && s.navbar)
    .map((s) => ({
      icon: SOCIAL_ICON[s.icon] ?? "🔗",
      label: s.name,
      value: socialValue(s.name, s.url),
      href: s.url,
    })),
];

/** Personal brand motif — the shark is Calvin's own; the owl is Rice's. */
export const BRAND_EMOJI = "🦈";

export const deskAbout = {
  name: DATA.name,
  role: "Software Engineer · Classics National Champion",
  emoji: BRAND_EMOJI,
  paragraphs: [DATA.description, DATA.summary],
  resumeUrl: DATA.resumeUrl,
  githubUrl: DATA.contact.social.GitHub?.url ?? DATA.url,
  email: DATA.contact.email,
  avatar: DATA.avatarUrl,
};

export const V2_DATA = {
  brand: DATA.name.split(" ")[0],
  brandEmoji: BRAND_EMOJI,
  projects: deskProjects,
  contacts: deskContacts,
  about: deskAbout,
};
