import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import IconCloud from "@/components/magicui/icon-cloud";

const BLUR_FADE_DELAY = 0.04;

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
                <BlurFade delay={BLUR_FADE_DELAY * 9}>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
                        Skills
                    </h2>
                </BlurFade>
                <div className="flex flex-wrap gap-1">
                {DATA.skills.map((skill, id) => (
                        <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                            <Badge key={skill.name}>{skill.name}</Badge>
                        </BlurFade>
                    ))}
                </div>
                <BlurFade delay={BLUR_FADE_DELAY * 11}>
                    <div className="mt-8 flex justify-center">
                        <div className="w-full max-w-3xl">
                            <IconCloud iconSlugs={iconSlugs} />
                        </div>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}