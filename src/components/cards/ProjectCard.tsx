"use client";

import { useState } from "react";
import Image from "next/image";
import { BaseCard } from "./BaseCard";

interface ProjectLink {
  type: string;
  href: string;
  icon: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  links: ProjectLink[];
  index: number;
}

export function ProjectCard({
  title,
  description,
  image,
  technologies,
  links,
  index,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <BaseCard
      testId={`project-card-${index}`}
      className="w-[350px] md:w-[400px] h-[520px]"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full"
      >
      <div className="p-4 flex items-center justify-between border-b border-ocean-muted/10">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isHovered ? "bg-green-500 animate-pulse" : "bg-green-500/50"
            }`}
          />
          <span className="hud-text text-[10px]">SYSTEM_ONLINE</span>
        </div>
        <span className="hud-text text-[10px]">ID: {String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="relative aspect-video overflow-hidden">
        <CornerBrackets />
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? "grayscale-0 scale-105" : "grayscale"
            }`}
          />
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-heading font-bold text-ocean-cyan">{title}</h3>
          {links.length > 0 && (
            <a
              href={links[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-muted hover:text-ocean-cyan transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>

        <p
          className={`text-sm text-ocean-muted dark:text-ocean-muted/80 line-clamp-3 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-1" : "opacity-80"
          }`}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {technologies.slice(0, 5).map((tech, i) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-mono border border-ocean-muted/30 rounded
                       text-ocean-muted dark:text-ocean-muted/80
                       transition-transform duration-200"
              style={{
                transitionDelay: isHovered ? `${i * 50}ms` : "0ms",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          {links.map((link) => (
            <a
              key={link.type}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ocean-muted hover:text-ocean-cyan transition-colors flex items-center gap-1"
            >
              <LinkIcon icon={link.icon} />
              <span>{link.type}</span>
            </a>
          ))}
        </div>
      </div>
      </div>
    </BaseCard>
  );
}

function CornerBrackets() {
  return (
    <>
      <div className="absolute top-2 left-2 w-4 h-4 z-10">
        <svg viewBox="0 0 16 16" className="w-full h-full text-ocean-cyan">
          <path d="M0 6 L0 0 L6 0" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute top-2 right-2 w-4 h-4 z-10">
        <svg viewBox="0 0 16 16" className="w-full h-full text-ocean-cyan">
          <path d="M10 0 L16 0 L16 6" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-2 left-2 w-4 h-4 z-10">
        <svg viewBox="0 0 16 16" className="w-full h-full text-ocean-cyan">
          <path d="M0 10 L0 16 L6 16" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-2 right-2 w-4 h-4 z-10">
        <svg viewBox="0 0 16 16" className="w-full h-full text-ocean-cyan">
          <path d="M10 16 L16 16 L16 10" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </>
  );
}

function LinkIcon({ icon }: { icon: string }) {
  if (icon === "github") {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }
  if (icon === "youtube") {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  );
}
