"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { DATA } from "@/data";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;

    if (!section || !content || !image) return;

    const ctx = gsap.context(() => {
      gsap.from(content.children, {
        x: -100,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });

      gsap.from(image, {
        x: 100,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-testid="about-section"
      className="min-h-screen py-24 px-6 md:px-12 flex items-center"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div ref={contentRef} className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ocean-cyan/50">
            <span className="w-2 h-2 rounded-full bg-ocean-cyan" />
            <span className="text-sm font-mono text-ocean-cyan uppercase tracking-wider">
              Bio-Data Analysis
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-heading font-bold">
            <span className="text-ocean-text dark:text-abyss-text">DIGITAL</span>
            <br />
            <span className="text-ocean-cyan">ALCHEMIST</span>
          </h2>

          <p className="text-lg text-ocean-muted dark:text-ocean-muted/80 leading-relaxed">
            {DATA.summary}
          </p>

          <p className="text-ocean-cyan font-mono text-sm uppercase tracking-wider">
            BRIDGING AESTHETIC PRECISION WITH TECHNICAL PERFORMANCE.
          </p>

          <div className="flex gap-12 pt-4">
            <div>
              <p className="text-5xl font-heading font-bold text-ocean-text dark:text-abyss-text">
                05+
              </p>
              <p className="hud-text">YEARS EXP.</p>
            </div>
            <div>
              <p className="text-5xl font-heading font-bold text-ocean-text dark:text-abyss-text">
                20+
              </p>
              <p className="hud-text">PROJECTS DEPLOYED</p>
            </div>
          </div>
        </div>

        <div
          ref={imageRef}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-square max-w-md mx-auto">
            <CornerBrackets />
            
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={DATA.avatarUrl}
                alt="Calvin Wong"
                width={400}
                height={400}
                data-testid="about-image"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? "grayscale-0" : "grayscale"
                }`}
              />
              
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-x-0 h-1 bg-gradient-to-b from-ocean-cyan/50 to-transparent animate-scan"
                  style={{ height: "20%" }}
                />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-abyss/80 backdrop-blur-sm px-3 py-1 rounded">
              <p className="hud-text text-[10px]">SUBJECT: CALVIN</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerBrackets() {
  return (
    <>
      <div className="absolute -top-2 -left-2 w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full text-ocean-cyan">
          <path d="M0 12 L0 0 L12 0" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full text-ocean-cyan">
          <path d="M20 0 L32 0 L32 12" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -bottom-2 -left-2 w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full text-ocean-cyan">
          <path d="M0 20 L0 32 L12 32" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -bottom-2 -right-2 w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full text-ocean-cyan">
          <path d="M20 32 L32 32 L32 20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </>
  );
}
