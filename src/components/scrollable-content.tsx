'use client'
import React, { useLayoutEffect, useRef, useCallback, useEffect } from 'react';
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const calculatePositions = useCallback(() => {
        const positions: { [key: string]: number } = {};
        const sections = document.querySelectorAll('[id^="home"], [id^="experience"], [id^="education"], [id^="skills"], [id^="projects"], [id^="hackathons"], [id^="contact"]');

        sections.forEach((section) => {
            const id = section.id;
            const position = section.getBoundingClientRect().top + window.pageYOffset;
            positions[id] = position;
        });

        console.log("ScrollableContent: Calculated positions", positions);
        window.dispatchEvent(new CustomEvent('sectionPositionsUpdated', { detail: positions }));
    }, []);

    useLayoutEffect(() => {
        // Add a small delay to ensure all elements are rendered
        const timer = setTimeout(() => {
            calculatePositions();
        }, 100);

        window.addEventListener('resize', calculatePositions);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculatePositions);
        };
    }, [calculatePositions]);

    useEffect(() => {
        const handleScrollTo = (event: CustomEvent) => {
            const { sectionId, position } = event.detail;
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        };

        window.addEventListener('scrollToSection', handleScrollTo as EventListener);

        return () => {
            window.removeEventListener('scrollToSection', handleScrollTo as EventListener);
        };
    }, []);

    const sectionRefs = {
        home: useRef<HTMLDivElement>(null),
        experience: useRef<HTMLDivElement>(null),
        education: useRef<HTMLDivElement>(null),
        skills: useRef<HTMLDivElement>(null),
        projects: useRef<HTMLDivElement>(null),
        hackathons: useRef<HTMLDivElement>(null),
        contact: useRef<HTMLDivElement>(null),
    };
    return (
      <div
        ref={scrollContainerRef}
        className={cn("h-screen overflow-y-auto", className)}
      >
        <div ref={sectionRefs.home} id="home" className="mb-20">
          <HomeSection />
        </div>
        <div ref={sectionRefs.experience} id="experience" className="mb-20">
          <ExperienceSection />
        </div>
        <div ref={sectionRefs.education} id="education" className="mb-20">
          <EducationSection />
        </div>
        <div ref={sectionRefs.skills} id="skills" className="mb-20">
          <SkillsSection />
        </div>
        <div ref={sectionRefs.projects} id="projects" className="mb-20">
          <ProjectsSection />
        </div>
        <div ref={sectionRefs.hackathons} id="hackathons" className="mb-20">
          <HackathonSection />
        </div>
        <div ref={sectionRefs.contact} id="contact" className="mb-20">
          <ContactSection />
        </div>
      </div>
    );
}