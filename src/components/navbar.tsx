'use client';
import { useState, useEffect, useMemo } from 'react';
import { Dock, DockIcon } from "@/components/magicui/dock";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { HomeIcon, Folder, Mail, Briefcase, Gem, Computer, GraduationCap } from 'lucide-react';

interface NavbarProps {
    className?: string;
}

export default function Navbar({ className }: NavbarProps) {
    const [activeSection, setActiveSection] = useState('home');

    const navItems = useMemo(() => [
        { href: "#home", label: "Home", icon: HomeIcon },
        { href: "#experience", label: "Experience", icon: Briefcase },
        { href: "#education", label: "Education", icon: GraduationCap },
        { href: "#skills", label: "Skills", icon: Gem },
        { href: "#projects", label: "Projects", icon: Folder },
        { href: "#hackathons", label: "Hackathons", icon: Computer },
        { href: "#contact", label: "Contact", icon: Mail },
    ], []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        let clickedSection = '';

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) {
                    const newActiveSection = entry.target.id;
                    if (!clickedSection || newActiveSection === clickedSection) {
                        setActiveSection(newActiveSection);
                        if (clickedSection === newActiveSection) {
                            clickedSection = '';
                        }
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sections = navItems.map(item => document.getElementById(item.href.slice(1))).filter((section): section is HTMLElement => section !== null);
        sections.forEach(section => observer.observe(section));

        const handleNavClick = (sectionId: string) => {
            clickedSection = sectionId;
            setActiveSection(sectionId);
            setTimeout(() => {
                if (clickedSection === sectionId) {
                    clickedSection = '';
                }
            }, 1000);
        };

        const handleScroll = () => {
            if (!clickedSection) {
                const scrollPosition = window.scrollY + window.innerHeight / 2;
                for (const section of sections) {
                    const { offsetTop, offsetHeight } = section;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        navItems.forEach(item => {
            const link = document.querySelector(`a[href="${item.href}"]`);
            link?.addEventListener('click', () => handleNavClick(item.href.slice(1)));
        });

        return () => {
            sections.forEach(section => observer.unobserve(section));
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
            navItems.forEach(item => {
                const link = document.querySelector(`a[href="${item.href}"]`);
                link?.removeEventListener('click', () => handleNavClick(item.href.slice(1)));
            });
        };
    }, [navItems]);



    return (
        <div className={cn("fixed left-0 top-0 h-full w-16 z-50", className)}>
            <Dock className="flex flex-col h-full w-full items-center justify-center py-4 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
                {navItems.map((item) => (
                    <DockIcon key={item.href}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                        "size-16 w-full",
                                        activeSection === item.href.slice(1) ? "bg-secondary" : "hover:bg-secondary/50"
                                    )}
                                >
                                    <item.icon className="size-6" />
                                </Link>
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