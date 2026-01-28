"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { HomeSection } from "@/components/sections/home-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EducationSection } from "@/components/sections/education-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { HackathonSection } from "@/components/sections/hackathon-section";
import { ContactSection } from "@/components/sections/contact-section";

interface ScrollableContentProps {
    className?: string;
    calculatePositions?: () => void;
    children?: React.ReactNode;
}

export function ScrollableContent({
  calculatePositions,
  children,
  className,
}: ScrollableContentProps) {
  useEffect(() => {
    if (typeof calculatePositions === "function") {
      calculatePositions();
    }
  }, [calculatePositions]);

  return (
      <div className={cn("w-full max-w-full flex flex-col items-center space-y-16 md:space-y-20 !p-0 md:px-4 lg:px-8 scrollable-content-wrapper", className)}>
        <div className="w-full">
          <HomeSection />
        </div>
        <div className="w-full">
          <ExperienceSection />
        </div>
        <div className="w-full ">
          <EducationSection />
        </div>
        <div className="w-full ">
          <SkillsSection />
        </div>
        <div className="w-full ">
          <ProjectsSection />
        </div>
        <div className="w-full">
          <HackathonSection />
        </div>
        <div className="w-full ">
          <ContactSection />
        </div>
      </div>
  );
}