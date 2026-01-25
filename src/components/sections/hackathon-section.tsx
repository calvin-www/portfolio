import BlurFade from "@/components/magicui/blur-fade";
import { HackathonCard } from "@/components/hackathon-card";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export function HackathonSection() {
  return (
    <section id="hackathons" className="relative py-24 bg-gradient-to-b from-[#01579B] to-[#000a12] text-white overflow-hidden">
      {/* Deep Ocean Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-[80px]" />
      </div>

      <div className="space-y-12 w-full max-w-4xl mx-auto px-4 relative z-10">
        <BlurFade delay={BLUR_FADE_DELAY * 13}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-[#00E5FF] text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                Sunken Treasures
              </h2>
              <p className="text-cyan-100/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl mx-auto">
                Discovering artifacts of innovation in the deep. Starting in Highschool, I&apos;ve attended{" "}
                {DATA.hackathons.length} hackathons. These events taught me that failure is just part of the voyage to the best product!
              </p>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 14}>
          <ul className="mb-4 ml-4 divide-y divide-transparent border-l border-[#00E5FF]/30 relative">
             {/* Glowing line effect */}
            <div className="absolute top-0 left-[-1px] w-[2px] h-full bg-gradient-to-b from-transparent via-[#00E5FF] to-transparent opacity-50 blur-[1px]" />
            
            {DATA.hackathons.map((project, id) => (
              <BlurFade
                key={project.title + project.dates}
                delay={BLUR_FADE_DELAY * 15 + id * 0.05}
              >
                <HackathonCard
                  title={project.title}
                  description={project.description}
                  location={project.location}
                  dates={project.dates}
                  image={project.image}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </ul>
        </BlurFade>
      </div>
    </section>
  );
}