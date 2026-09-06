/**
 * v3 skills adapter
 *
 * Four rows for the skills marquee. Each skill carries the names it goes by
 * in resume.json so we can find the work, projects and hackathons that used
 * it and build a "where i used it" line without hand-written copy.
 */
import type { Entry } from "./v3";

export interface Skill {
  id: string;
  /** Display name, real product casing. */
  label: string;
  /** Lowercase names that may appear in resume.json technologies/badges. */
  aliases: string[];
}

export interface SkillRow {
  id: "languages" | "frameworks" | "infra" | "tools";
  label: string;
  skills: Skill[];
}

const s = (label: string, ...aliases: string[]): Skill => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  label,
  aliases: [label.toLowerCase(), ...aliases],
});

export const SKILL_ROWS: SkillRow[] = [
  {
    id: "languages",
    label: "languages",
    skills: [
      s("TypeScript"), s("JavaScript"), s("Python"), s("Java"), s("C"), s("Go"),
      s("SQL"), s("HTML", "html5"), s("CSS", "css3"), s("Bash"), s("JSON"),
    ],
  },
  {
    id: "frameworks",
    label: "frameworks",
    skills: [
      s("React"), s("Next.js", "nextjs"), s("Node.js", "nodejs"), s("Express", "express.js"),
      s("Prisma"), s("Tailwind", "tailwindcss"), s("shadcn/ui", "shadcn-ui"), s("Mantine", "mantine ui"),
      s("NextUI", "next ui"), s("MUI"), s("Spring"), s("Angular"),
    ],
  },
  {
    id: "infra",
    label: "infra",
    skills: [
      s("AWS", "amazonaws"), s("Google Cloud", "google cloud platform", "gcp"), s("Vercel"), s("Firebase", "firebase auth"),
      s("Heroku"), s("Docker"), s("MongoDB"), s("Neon"), s("GraphQL"), s("gRPC"), s("WebSocket", "websockets"),
      s("Spark"), s("CI/CD"), s("Gemini", "gemini ai"), s("OpenAI"), s("Cohere", "cohere command r"), s("RAG", "ai rag"),
    ],
  },
  {
    id: "tools",
    label: "tools",
    skills: [
      s("Git"), s("GitHub"), s("VS Code", "vscode"), s("IntelliJ", "intellijidea"), s("Figma"), s("Photoshop"),
      s("Illustrator"), s("Lightroom"), s("Premiere Pro", "premierepro"), s("LaTeX"), s("Maven"), s("JUnit"),
      s("Bruno"), s("Clerk"), s("Monaco", "monaco editor"),
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_ROWS.flatMap((r) => r.skills);

export function findSkill(id: string | null): Skill | null {
  return id ? ALL_SKILLS.find((k) => k.id === id) ?? null : null;
}

/** Titles of the entries whose tags mention this skill, newest first. */
export function usedIn(skill: Skill, entries: Entry[]): Entry[] {
  return entries.filter((e) => e.tags.some((t) => skill.aliases.includes(t.toLowerCase())));
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** One line: where the skill shows up on this site. */
export function usageLine(skill: Skill, entries: Entry[], notes: Record<string, string>, none: string): string {
  if (notes[skill.id]) return notes[skill.id];
  const used = usedIn(skill, entries);
  if (used.length === 0) return none;
  const work = used.filter((e) => e.type === "work").map((e) => e.title);
  const built = used.filter((e) => e.type !== "work").map((e) => e.title);
  const parts: string[] = [];
  if (work.length) parts.push(`at ${joinNames(work)}`);
  if (built.length) parts.push(`in ${joinNames(built)}`);
  return `used ${parts.join(", and ")}.`;
}
