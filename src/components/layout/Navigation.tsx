"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MagneticButton } from "@/components/ui/MagneticButton";

const navLinks = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      role="navigation"
      className="fixed top-0 left-0 right-0 z-50 h-20 px-6 md:px-12
                 flex items-center justify-between
                 bg-ocean-light/80 dark:bg-abyss/80 backdrop-blur-md
                 border-b border-ocean-muted/10"
    >
      <div className="flex items-center gap-6">
        <ThemeToggle />
        <div className="hidden md:block">
          <p className="hud-text text-[10px] leading-tight">SECTOR: 001 // HOME</p>
          <p className="hud-text text-[10px] leading-tight">SYS.STATUS: OPTIMAL</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {navLinks.map((link) => {
          const isActive = activeSection === link.href.substring(1);
          return (
            <MagneticButton key={link.href} strength={20}>
              <motion.a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                whileHover={{ scale: 1.05 }}
                className={`relative px-4 py-2 rounded-full text-sm font-medium
                         border transition-all duration-300
                         ${
                           isActive
                             ? "border-ocean-cyan text-ocean-cyan bg-ocean-cyan/10"
                             : "border-ocean-muted/30 text-ocean-text dark:text-abyss-text hover:border-ocean-cyan hover:text-ocean-cyan"
                         }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 rounded-full border-2 border-ocean-cyan"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-ocean-cyan"
                  initial={{ width: 0 }}
                  whileHover={{ width: "80%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </MagneticButton>
          );
        })}
      </div>
    </nav>
  );
}
