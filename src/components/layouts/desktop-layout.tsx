import React from 'react';
import Navbar from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
    return (
        <div className="hidden md:flex h-screen">
            <div className="w-16 md:w-20 h-full sticky top-0 z-50">
                <Navbar />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex">
                    <HeroSection className="w-1/3 lg:w-1/4 sticky top-0 h-screen" />
                    <main className="flex-1 px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}