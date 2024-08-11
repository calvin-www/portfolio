import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { SkillsSection } from "./skills-section";
import { ProjectsSection } from "./projects-section";
import { HackathonSection } from "./hackathon-section";
import { ContactSection } from "./contact-section";
import { HomeSection } from "./home-section";
import { cn } from "@/lib/utils";

interface ScrollableContentProps {
    className?: string;
}

    export function ScrollableContent({ className }: ScrollableContentProps) {
        return (
            <div className={cn("w-2/3 space-y-20 overflow-y-auto p- px-32", className)}>
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