import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";

export function ProjectsSection() {
  return (
    <section id="projects">
      <div className="space-y-12 w-full py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
                Check out what I&apos;ve been up to!
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From Discord chatbots to full stack web apps, I love trying new ways to solve problems. Though some are
                still WIP, check out some of my work below!
              </p>
            </div>
          </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto ">
          {DATA.projects.map((project) => (
              <ProjectCard
                href={project.href}
                key={project.title}
                title={project.title}
                description={project.description}
                dates={''}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
              />
          ))}
        </div>
      </div>
    </section>
  );
}