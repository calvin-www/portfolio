import { ResumeCard } from "@/components/resume-card";
import { DATA } from "@/data/resume";

export function ExperienceSection() {
  return (
    <section id="experience">
        <div className="space-y-12 w-full py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
            Experience
          </h2>
        {DATA.work.map((work) => (
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
              className="bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg"
            />
        ))}
      </div>
    </section>
  );
}