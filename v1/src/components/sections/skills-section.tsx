import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import IconCloud from "@/components/magicui/icon-cloud";

export function SkillsSection() {
  // Convert skill names to icon slugs from simpleicons
    const iconSlugs = [
        "typescript",
        "javascript",
        "java",
        "python",
        "c",
        "react",
        "nextdotjs",
        "nodedotjs",
        "prisma",
        "graphql",
        "html5",
        "css3",
        "tailwindcss",
        "mantine",
        "mui",
        "nextui",
        "amazonaws",
        "firebase",
        "vercel",
        "mongodb",
        "sql",
        "git",
        "github",
        "visualstudiocode",
        "intellijidea",
        "figma",
        "latex",
        "adobe",
        "adobephotoshop",
        "adobelightroom",
        "adobeillustrator",
        "adobepremierepro"
    ];
    return (
        <section id="skills">
            <div className="space-y-12 w-full py-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
                        Skills
                    </h2>
                <div className="flex flex-wrap gap-1">
                {DATA.skills.map((skill) => (
                            <Badge key={skill.name}>{skill.name}</Badge>
                    ))}
                </div>
                    <div className="mt-8 flex justify-center">
                        <div className="w-full max-w-3xl">
                            <IconCloud iconSlugs={iconSlugs} />
                        </div>
                    </div>
            </div>
        </section>
    );
}