import { HomeSection } from "@/components/sections/home-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EducationSection } from "@/components/sections/education-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { HackathonSection } from "@/components/sections/hackathon-section";
import { ContactSection } from "@/components/sections/contact-section";
import { cn } from "@/lib/utils";
interface ScrollableContentProps {
    className?: string;
}

export function ScrollableContent({ className }: ScrollableContentProps) {
    return (
        <div className={cn("w-full md:w-2/3 space-y-16 md:space-y-20 overflow-y-auto p-2 px-2 md:px-4 lg:px-8", className)}>
            <div id="home">
                    <HomeSection/>
                </div>
                <div id="experience">
                    <ExperienceSection/>
                </div>
                <div id="education">
                    <EducationSection/>
                </div>
                <div id="skills">
                    <SkillsSection/>
                </div>
                <div id="projects">
                    <ProjectsSection/>
                </div>
                <div id="hackathon">
                    <HackathonSection/>
                </div>
                <div id="contact">
                    <ContactSection/>
                </div>
            </div>
        );
    }