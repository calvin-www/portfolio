import { HackathonCard } from "@/components/hackathon-card";
import { DATA } from "@/data/resume";

export function HackathonSection() {
  return (
    <section id="hackathons">
      <div className="space-y-12 w-full py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
                Hackathons!
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Starting in Highschool, I&apos;ve attended{" "}
                {DATA.hackathons.length} hackathons so far. These events have taught me a lot about problem-solving, collaboration, and teamwork, as
                well as how to best go from Idea to design to testing, then to failure, then back to design, which would eventually lead to the best
                version of our product!
              </p>
            </div>
          </div>
          <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
            {DATA.hackathons.map((project) => (
                <HackathonCard
                  key={project.title + project.dates}
                  title={project.title}
                  description={project.description}
                  location={project.location}
                  dates={project.dates}
                  image={project.image}
                  links={project.links}
                />
            ))}
          </ul>
      </div>
    </section>
  );
}