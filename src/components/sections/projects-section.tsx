import BlurFade from "@/components/magicui/blur-fade";
import { FishProjects } from "@/components/ocean/FishProjects";

const BLUR_FADE_DELAY = 0.04;

export function ProjectsSection() {
  return (
    <section id="projects">
      <div className="space-y-12 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
                Check out what I&apos;ve been up to!
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From Discord chatbots to full stack web apps, I love trying new ways to solve problems.
                <br />
                <span className="text-cyan-500 font-medium">Click a fish below to explore my projects!</span>
              </p>
            </div>
          </div>
        </BlurFade>
        
        <BlurFade delay={BLUR_FADE_DELAY * 12}>
          <FishProjects />
        </BlurFade>
      </div>
    </section>
  );
}