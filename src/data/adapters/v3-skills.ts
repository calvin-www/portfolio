/**
 * v3 skills adapter
 *
 * Four rows for the skills marquee. Each skill keeps the names it goes by in
 * resume.json so the rows can be cross-referenced with entries later.
 */

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
      s("AWS", "amazonaws"), s("Google Cloud", "google cloud platform", "gcp"),
      s("Azure", "microsoft azure", "azure functions", "azure container instances"), s("Cosmos DB"), s("Service Bus"), s("Event Grid"), s("Vercel"), s("Firebase", "firebase auth"),
      s("Heroku"), s("Docker"), s("MongoDB"), s("Neon"), s("GraphQL"), s("gRPC"), s("WebSocket", "websockets"),
      s("REST", "rest apis", "apis"), s("Spark"), s("CI/CD"), s("Distributed Systems"),
      s("Machine Learning", "ml"), s("Agentic Workflows", "llm agents"), s("Gemini", "gemini ai"), s("OpenAI"), s("Cohere", "cohere command r"), s("RAG", "ai rag"),
    ],
  },
  {
    id: "tools",
    label: "tools",
    skills: [
      s("Git"), s("GitHub"), s("VS Code", "vscode"), s("IntelliJ", "intellijidea"), s("Figma"), s("Photoshop"),
      s("Illustrator"), s("Lightroom"), s("Premiere Pro", "premierepro"), s("LaTeX"), s("Maven"), s("JUnit"),
      s("Bruno"), s("Clerk"), s("Monaco", "monaco editor"), s("AST Analysis", "ast"),
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_ROWS.flatMap((r) => r.skills);

export function findSkill(id: string | null): Skill | null {
  return id ? ALL_SKILLS.find((k) => k.id === id) ?? null : null;
}
