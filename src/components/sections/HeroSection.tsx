"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { FloatingParticles } from "@/components/effects/FloatingParticles";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const name = nameRef.current;
    const tagline = taglineRef.current;
    const cta = ctaRef.current;

    if (!section || !name || !tagline || !cta) return;

    const ctx = gsap.context(() => {
      gsap.to(name, {
        y: 200,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(tagline, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(cta, {
        y: -50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <RadarDecoration />
      <FloatingParticles count={20} />

      <div className="relative z-10 text-center px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-ocean-cyan/50">
          <span className="w-2 h-2 rounded-full bg-ocean-cyan animate-pulse" />
          <span className="text-sm font-mono text-ocean-cyan uppercase tracking-wider">
            Creative Frontend Engineer
          </span>
        </div>

        <div ref={nameRef}>
          <h1 className="text-7xl sm:text-8xl md:text-[150px] font-heading font-bold leading-[0.9] tracking-tight">
            <span className="block text-ocean-text dark:text-abyss-text">CALVIN</span>
            <span className="block bg-gradient-to-r from-ocean-text dark:from-abyss-text to-ocean-cyan bg-clip-text text-transparent">
              WONG
            </span>
          </h1>
        </div>

        <p
          ref={taglineRef}
          className="mt-8 text-lg sm:text-xl md:text-2xl text-ocean-cyan max-w-lg mx-auto"
        >
          Building immersive web experiences beneath the surface.
        </p>

        <div ref={ctaRef} className="mt-16">
          <button
            onClick={() => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex flex-col items-center gap-2 text-ocean-muted hover:text-ocean-cyan transition-colors"
          >
            <span className="hud-text">INITIALIZE DIVE</span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>

      <CornerBrackets />
    </section>
  );
}

function RadarDecoration() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      data-testid="radar-decoration"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute top-20 right-10 md:right-20 w-48 h-48 md:w-72 md:h-72 opacity-20 dark:opacity-10 cursor-pointer"
    >
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full transition-all duration-500"
        style={{
          animation: isHovered ? "spin 2s linear infinite" : "spin 8s linear infinite"
        }}
      >
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-ocean-blue"
        />
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-ocean-blue"
        />
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-ocean-blue"
        />
        <circle cx="100" cy="100" r="4" fill="currentColor" className="text-ocean-cyan" />
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="10"
          stroke="currentColor"
          strokeWidth="1"
          className="text-ocean-cyan opacity-50"
        />
      </svg>
    </div>
  );
}

function CornerBrackets() {
  return (
    <div className="absolute bottom-20 left-10 md:left-20 w-24 h-24 opacity-30">
      <svg viewBox="0 0 100 100" className="w-full h-full text-ocean-blue">
        <path d="M0 30 L0 0 L30 0" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M70 100 L100 100 L100 70" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}
