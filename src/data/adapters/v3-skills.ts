/**
 * v3 skills adapter
 *
 * Four rows for the skills marquee, hand-curated with real product casing.
 */

export interface Skill {
  id: string;
  /** Display name, real product casing. */
  label: string;
}

export interface SkillRow {
  id: "languages" | "frameworks" | "infra" | "tools";
  label: string;
  skills: Skill[];
}

const s = (label: string): Skill => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  label,
});

export const SKILL_ROWS: SkillRow[] = [
  {
    id: "languages",
    label: "languages",
    skills: [
      s("TypeScript"), s("JavaScript"), s("Python"), s("Java"), s("C"), s("Go"),
      s("SQL"), s("HTML"), s("CSS"), s("Bash"), s("JSON"),
    ],
  },
  {
    id: "frameworks",
    label: "frameworks",
    skills: [
      s("React"), s("Next.js"), s("Node.js"), s("Express"),
      s("Prisma"), s("Tailwind"), s("shadcn/ui"), s("Mantine"),
      s("NextUI"), s("MUI"), s("Spring"), s("Angular"),
    ],
  },
  {
    id: "infra",
    label: "infra",
    skills: [
      s("AWS"), s("Google Cloud"),
      s("Azure"), s("Cosmos DB"), s("Service Bus"), s("Event Grid"), s("Vercel"), s("Firebase"),
      s("Heroku"), s("Docker"), s("MongoDB"), s("Neon"), s("GraphQL"), s("gRPC"), s("WebSocket"),
      s("REST"), s("Spark"), s("CI/CD"), s("Distributed Systems"),
      s("Machine Learning"), s("Agentic Workflows"), s("Gemini"), s("OpenAI"), s("Cohere"), s("RAG"),
    ],
  },
  {
    id: "tools",
    label: "tools",
    skills: [
      s("Git"), s("GitHub"), s("VS Code"), s("IntelliJ"), s("Figma"), s("Photoshop"),
      s("Illustrator"), s("Lightroom"), s("Premiere Pro"), s("LaTeX"), s("Maven"), s("JUnit"),
      s("Bruno"), s("Clerk"), s("Monaco"), s("AST Analysis"),
    ],
  },
];
