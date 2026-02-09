"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DATA } from "@/data";
import { ProjectCard } from "@/components/cards/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const cards = cardsRef.current;

    if (!section || !container || !cards) return;

    const totalWidth = cards.scrollWidth - container.offsetWidth;

    const ctx = gsap.context(() => {
      gsap.to(cards, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-testid="projects-section"
      className="relative min-h-screen"
    >
      <div ref={containerRef} className="h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-12 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border border-green-500/50">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-mono text-green-500 uppercase tracking-wider">
                  Research Labs
                </span>
              </div>
              <h2 className="text-6xl md:text-8xl font-heading font-bold text-ocean-text dark:text-abyss-text">
                BIOLUMINESCENCE
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-ocean-muted">
              <span className="hud-text">SCROLL TO SCAN</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          ref={cardsRef}
          className="flex gap-6 px-6 md:px-12"
          style={{ width: "max-content" }}
        >
          {DATA.projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              image={project.image}
              technologies={project.technologies}
              links={project.links}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
