'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Navbar from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { ScrollableContent } from '@/components/scrollable-content';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
    const [activeSection, setActiveSection] = useState('home');
    const sectionPositionsRef = useRef<{ [key: string]: number }>({});
    const mainRef = useRef<HTMLDivElement>(null);

    const calculatePositions = useCallback(() => {
        const positions: { [key: string]: number } = {};
        const sections = document.querySelectorAll('[id^="home"], [id^="experience"], [id^="education"], [id^="skills"], [id^="projects"], [id^="hackathons"], [id^="contact"]');

        sections.forEach((section) => {
            const id = section.id;
            const position = section.getBoundingClientRect().top + window.pageYOffset;
            positions[id] = position;
        });

        sectionPositionsRef.current = positions;
        console.log("DesktopLayout: Calculated positions", positions);
    }, []);

    useEffect(() => {
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

    const handleScroll = useCallback(() => {
        if (!mainRef.current) return;

        const scrollPosition = mainRef.current.scrollTop;
        let newActiveSection = 'home';

        for (const [section, position] of Object.entries(sectionPositionsRef.current)) {
            if (scrollPosition >= position - 100) { // 100px offset for better UX
                newActiveSection = section;
            }
        }

        setActiveSection(newActiveSection);
    }, []);

const handleNavClick = (sectionId: string) => {
    if (sectionId === 'home' && mainRef.current) {
        mainRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        const position = sectionPositionsRef.current[sectionId];
        if (position !== undefined && mainRef.current) {
            mainRef.current.scrollTo({
                top: position,
                behavior: 'smooth'
            });
        }
    }
};

    return (
        <div className="hidden md:flex h-screen overflow-hidden">
            <Navbar activeSection={activeSection} onNavClick={handleNavClick} className="" />
            <div className="flex-1 overflow-hidden">
                <div className="flex h-full">
                    <HeroSection className="w-1/3 lg:w-1/4 sticky top-0 h-screen pl-32" />
                    <main ref={mainRef} className="flex-1 overflow-y-auto scrollbar-hide  pl-6 pr-32" onScroll={handleScroll}>
                        <ScrollableContent calculatePositions={calculatePositions}>
                            {children}
                        </ScrollableContent>
                    </main>
                </div>
            </div>
        </div>
    );
}