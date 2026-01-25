'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { OceanNav } from "@/components/ocean/OceanNav";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/hero-section";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  const [activeSection, setActiveSection] = useState('home');
  const mainRef = useRef<HTMLElement>(null);

  const handleNavClick = (id: string) => {
     const element = document.getElementById(id);
     if (element) {
       element.scrollIntoView({ behavior: 'smooth' });
     }
  };

  const handleScroll = useCallback(() => {
    if (!mainRef.current) return;
    
    const sections = ['home', 'experience', 'education', 'skills', 'projects', 'hackathons', 'contact'];
    const scrollPosition = mainRef.current.scrollTop + 100; // Offset

    for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
            const offsetTop = element.offsetTop;
            const offsetBottom = offsetTop + element.offsetHeight;
            
            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                setActiveSection(section);
                break;
            }
        }
    }
  }, []);

  return (
    <div className={cn("min-h-screen flex flex-col p-4 overflow-hidden md:items-start pt-20", className)}>
      <OceanNav activeSection={activeSection} onNavClick={handleNavClick} />
      <HeroSection className="w-full py-6 text-center md:text-left" />
      <main 
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-grow overflow-y-auto w-full text-center md:text-left !px-0"
      >
          <div className="w-full max-w-full flex flex-col md:items-start !p-0">{children}</div>
      </main>
    </div>
  );
}

