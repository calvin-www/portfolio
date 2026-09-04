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
