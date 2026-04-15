import { Badge } from "@/components/shared/ui/badge";
import { V1_DATA as DATA } from "@/data/adapters/v1";
import IconCloud from "@/components/shared/magicui/icon-cloud";
import { GradientText } from "@/components/shared/ui/gradient-text";

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
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        <GradientText>Skills</GradientText>
                    </h2>
                <div className="flex flex-wrap gap-1">
                {DATA.skills.map((skill) => (
                            <Badge key={skill}>{skill}</Badge>
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