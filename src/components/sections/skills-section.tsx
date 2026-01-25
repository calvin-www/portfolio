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
        <section id="skills" className="relative overflow-hidden py-24 bg-gradient-to-b from-[#0288D1] to-[#01579B]">
            {/* Ambient light/bubbles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-400/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 space-y-12 w-full px-4 md:px-8">
                <BlurFade delay={BLUR_FADE_DELAY * 9}>
                    <div className="flex flex-col items-center justify-center text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-[#00E5FF] to-white text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                            Skills
                        </h2>
                        <p className="mt-4 text-blue-100/80 max-w-2xl">
                            A collection of technologies I&apos;ve mastered in my journey through the digital depths.
                        </p>
                    </div>
                </BlurFade>
                
                <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
                    {DATA.skills.map((skill, id) => (
                        <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                            <Badge 
                                key={skill}
                                className="bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_6px_rgba(0,0,0,0.1)] rounded-full px-4 py-1.5 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] cursor-default text-sm font-medium tracking-wide"
                            >
                                {skill}
                            </Badge>
                        </BlurFade>
                    ))}
                </div>
                
                <BlurFade delay={BLUR_FADE_DELAY * 11}>
                    <div className="mt-12 flex justify-center">
                        <div className="w-full max-w-2xl relative">
                            {/* Glow behind the cloud */}
                            <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full" />
                            <IconCloud iconSlugs={iconSlugs} />
                        </div>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}