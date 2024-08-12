import React from 'react';
import Navbar from '@/components/navbar';
import { cn } from '@/lib/utils';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
    return (
        <div className="hidden md:flex h-screen">
            <div className="w-16 md:w-20 h-full sticky top-0">
                <Navbar />
            </div>
            <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">{children}</main>
        </div>
    );
}