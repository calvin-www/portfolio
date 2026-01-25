import BlurFade from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export function EducationSection() {
  return (
    <section id="education">
        <div className="space-y-12 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-[var(--ocean-shallow)] to-[var(--ocean-deep)] text-transparent bg-clip-text drop-shadow-sm">
                Education
            </h2>
        </BlurFade>
          {DATA.education.map((education, id) => (
              <BlurFade
                  key={education.school}
                  delay={BLUR_FADE_DELAY * 8 + id * 0.05}
              >
                <ResumeCard
                  key={education.school}
                  href={education.href}
                  logoUrl={education.logoUrl}
                  altText={education.school}
                  title={education.school}
                  subtitle={education.degree}
                  period={`${education.start} - ${education.end}`}
                  className="bg-white/40 dark:bg-black/40 backdrop-blur-md border-2 border-[var(--ocean-coral)]/30 hover:border-[var(--ocean-coral)] transition-all duration-500 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,188,212,0.1)]"
                  badges={[]}
                  description=""
                />
              </BlurFade>
          ))}
      </div>
    </section>
  );
}