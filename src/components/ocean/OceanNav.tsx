'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface OceanNavProps {
  activeSection: string;
  onNavClick: (sectionId: string) => void;
  className?: string;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'contact', label: 'Contact' },
];

export function OceanNav({ activeSection, onNavClick, className }: OceanNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavClick(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300',
          scrolled 
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-ocean-surface/20' 
            : 'bg-transparent',
          className
        )}
      >
        {/* Logo / Brand */}
        <div 
          className="text-xl font-bold tracking-tighter cursor-pointer text-ocean-deep dark:text-ocean-surface"
          onClick={() => handleNavClick('home')}
        >
          calvin<span className="text-ocean-shallow">.dev</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.id} className="relative px-3 py-2 group">
              <button
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'relative z-10 text-sm font-medium transition-colors duration-200',
                  activeSection === item.id
                    ? 'text-ocean-deep dark:text-ocean-surface'
                    : 'text-muted-foreground hover:text-ocean-mid dark:hover:text-ocean-shallow'
                )}
              >
                {item.label}
              </button>
              
              {/* Active State Wave */}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeWave"
                  className="absolute bottom-0 left-0 right-0 h-2 text-ocean-shallow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <WaveSVG />
                </motion.div>
              )}

              {/* Hover State Wave (only if not active) */}
              {activeSection !== item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-2 text-ocean-shallow/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   <WaveSVG />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-ocean-deep dark:text-ocean-surface"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'text-3xl font-bold tracking-tight transition-colors',
                  activeSection === item.id
                    ? 'text-ocean-deep dark:text-ocean-surface'
                    : 'text-muted-foreground hover:text-ocean-mid'
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div 
                    layoutId="mobileActiveWave"
                    className="h-3 w-full mt-2 text-ocean-shallow"
                  >
                    <WaveSVG />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function WaveSVG() {
  return (
    <svg
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      className="w-full h-full"
      fill="none"
    >
      <motion.path
        d="M0 10 Q 25 20 50 10 T 100 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </svg>
  );
}
