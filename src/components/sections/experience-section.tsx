import  BlurFade  from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export function ExperienceSection() {
  return (
    <section id="experience">
        <div className="space-y-12 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-[var(--ocean-shallow)] to-[var(--ocean-deep)] text-transparent bg-clip-text drop-shadow-sm">
            Experience
          </h2>
        </BlurFade>
        {DATA.work.map((work, id) => (
          <BlurFade
            key={work.company}
            delay={BLUR_FADE_DELAY * 6 + id * 0.05}
          >
              <ResumeCard
              key={work.company}
              logoUrl={work.logoUrl}
              altText={work.company}
              title={work.company}
              subtitle={work.title}
              href={work.href}
              badges={work.badges}
              period={`${work.start} - ${work.end ?? "Present"}`}
              description={work.description}
              className="bg-white/40 dark:bg-black/40 backdrop-blur-md border-2 border-[var(--ocean-coral)]/30 hover:border-[var(--ocean-coral)] transition-all duration-500 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,188,212,0.1)]"
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}