"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BaseCard } from "./BaseCard";

interface WorkCardProps {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  description: string;
  href?: string;
  index: number;
}

const TECH_KEYWORDS: Record<string, string[]> = {
  "JPMorgan Chase": ["Java", "Spring", "SQL", "Angular", "TypeScript", "REST APIs"],
  "Fermilab": ["Next.js", "React", "Python", "FastAPI", "SQL"],
  "Headstarter": ["AI", "Gemini", "Full-Stack", "CI/CD"],
  "Owl Certamen": ["HTML", "CSS", "JavaScript"],
  "Oculosophy": ["Adobe Suite", "Photoshop", "Premiere Pro"],
};

export function WorkCard({
  company,
  title,
  start,
  end,
  description,
  href,
  index,
}: WorkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const bullets = description
    .split(/[.!]/)
    .filter((s) => s.trim().length > 30)
    .slice(0, 3)
    .map((s) => s.trim());

  const technologies = TECH_KEYWORDS[company] || ["Web Dev"];

  return (
    <BaseCard
      testId={`work-card-${index}`}
      className="w-[350px] md:w-[400px] h-[520px]"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-full p-8 rounded-2xl overflow-hidden
                   bg-white dark:bg-white/5
                   border border-ocean-muted/20 hover:border-ocean-cyan/50
                   transition-all duration-500"
      >
        <DecorativeElements isHovered={isHovered} />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-3xl font-heading font-bold text-white tracking-wide">
              {company}
            </h3>
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-ocean-cyan/30 hover:border-ocean-cyan hover:bg-ocean-cyan/10 transition-all"
              >
                <svg className="w-5 h-5 text-ocean-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded border border-ocean-cyan/50 bg-ocean-cyan/5">
              <span className="text-xs font-mono text-ocean-cyan uppercase tracking-wider">
                {title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-ocean-muted/70 text-sm font-mono">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{start} - {end}</span>
            </div>
          </div>

          <ul className="space-y-3 flex-1 mb-6">
            {bullets.map((bullet, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 text-sm text-gray-300/90 leading-relaxed"
              >
                <span className="text-ocean-cyan mt-1.5 text-[8px]">■</span>
                <span>{bullet}.</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-auto pt-4 border-t border-ocean-cyan/10">
            <p className="text-[10px] font-mono text-ocean-muted/50 uppercase tracking-widest mb-3">
              Technologies Used:
            </p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ scale: 1.05, borderColor: "rgba(0, 181, 216, 0.8)" }}
                  className="px-3 py-1 text-xs font-mono text-ocean-cyan/80 
                           border border-ocean-cyan/30 rounded
                           hover:bg-ocean-cyan/10 transition-all cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

function DecorativeElements({ isHovered }: { isHovered: boolean }) {
  return (
    <>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <motion.div
          animate={{ scale: isHovered ? 1.2 : 1 }}
          className="w-2 h-2 rounded-full bg-ocean-cyan/60"
        />
        <div className="w-px h-8 bg-gradient-to-b from-ocean-cyan/40 to-transparent" />
        <motion.div
          animate={{ scale: isHovered ? 1.3 : 1 }}
          transition={{ delay: 0.1 }}
          className="w-6 h-6 rounded-full border border-ocean-cyan/30 flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-ocean-cyan/40" />
        </motion.div>
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-ocean-cyan/40" />
        <motion.div
          animate={{ scale: isHovered ? 1.2 : 1 }}
          transition={{ delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-ocean-cyan/60"
        />
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-30">
        <div className="w-1 h-1 rounded-full bg-ocean-cyan" />
        <div className="w-1 h-1 rounded-full bg-ocean-cyan" />
        <div className="w-1 h-1 rounded-full bg-ocean-cyan" />
      </div>

      <div className="absolute bottom-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-ocean-cyan/20 to-transparent" />
      
      <svg className="absolute bottom-6 right-6 w-16 h-16 text-ocean-cyan/5" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </>
  );
}
