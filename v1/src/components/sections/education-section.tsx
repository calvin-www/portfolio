import BlurFade from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export function EducationSection() {
  return (
    <section id="education">
        <div className="space-y-12 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
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
                  className="bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg"
                  badges={[]}
                  description=""
                />
              </BlurFade>
          ))}
      </div>
    </section>
  );
}