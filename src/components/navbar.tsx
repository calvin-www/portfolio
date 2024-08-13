'use client';

import {useEffect, useState, useRef, useMemo} from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dock, DockIcon } from "@/components/magicui/dock";
import {
  HomeIcon,
  Folder,
  Mail,
  Briefcase,
  Gem,
  Computer,
  GraduationCap,
} from "lucide-react";

interface NavbarProps {
  className?: string;
}
export default function Navbar({ className }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('home');
  const sectionPositionsRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const handleSectionPositionsUpdated = (event: CustomEvent) => {
      sectionPositionsRef.current = event.detail;
      console.log("Navbar: Updated section positions", sectionPositionsRef.current);
    };

    const handleScroll = (event: CustomEvent) => {
      const { scrollPosition } = event.detail;
      let newActiveSection = 'home';

      for (const [section, position] of Object.entries(sectionPositionsRef.current)) {
        if (scrollPosition >= position - 100) { // 100px offset for better UX
          newActiveSection = section;
        }
      }

      setActiveSection(newActiveSection);
    };

    window.addEventListener('sectionPositionsUpdated', handleSectionPositionsUpdated as EventListener);
    window.addEventListener('scrollableContentScroll', handleScroll as EventListener);

    return () => {
      window.removeEventListener('sectionPositionsUpdated', handleSectionPositionsUpdated as EventListener);
      window.removeEventListener('scrollableContentScroll', handleScroll as EventListener);
    };
  }, []);

const handleNavClick = (sectionId: string) => {
    const position = sectionPositionsRef.current[sectionId];
    console.log("Navbar: Clicked section", sectionId, "Position", position);
    if (position !== undefined) {
        window.dispatchEvent(new CustomEvent('scrollToSection', { 
            detail: { sectionId, position } 
        }));
    } else {
        console.log("Navbar: Position not found for section", sectionId);
        console.log("Current positions:", sectionPositionsRef.current);
    }
};

  const navItems = useMemo(
      () => [
        { href: "#home", icon: HomeIcon, label: "Home" },
        { href: "#experience", icon: Briefcase, label: "Experience" },
        { href: "#education", icon: GraduationCap, label: "Education" },
        { href: "#skills", icon: Gem, label: "Skills" },
        { href: "#projects", icon: Folder, label: "Projects" },
        { href: "#hackathons", icon: Computer, label: "Hackathons" },
        { href: "#contact", icon: Mail, label: "Contact" },
      ],
      []
  );
  return (
      <div className={cn("fixed left-0 top-0 h-full w-16 z-50", className)}>
        <Dock className="flex flex-col h-full w-full items-center justify-center py-4 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
          {navItems.map((item) => (
              <DockIcon key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "size-16 w-full",
                            activeSection === item.href.slice(1)
                                ? "nav-item-active bg-secondary"
                                : "hover:bg-secondary/50"
                        )}
                        onClick={() => handleNavClick(item.href.slice(1))}
                    >
                      <item.icon className="size-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
          ))}
        <Separator className="w-full my-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}