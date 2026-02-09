import { ResumeCard } from "@/components/resume-card";
import { DATA } from "@/data/resume";

export function EducationSection() {
  return (
    <section id="education">
        <div className="space-y-12 w-full py-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
                Education
            </h2>
          {DATA.education.map((education) => (
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
          ))}
      </div>
    </section>
  );
}