"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface ContactCardProps {
  platform: string;
  url: string;
  icon: React.ReactNode;
  testId: string;
}

export function ContactCard({ platform, url, icon, testId }: ContactCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 15, stiffness: 200 });
  const springY = useSpring(y, { damping: 15, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const strength = 50;
    const factor = strength / 100;
    x.set(deltaX * factor);
    y.set(deltaY * factor);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      data-interactive
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="flex items-center gap-4 p-6 rounded-2xl
                 bg-white dark:bg-white/5 
                 border border-ocean-muted/20
                 hover:border-ocean-cyan
                 transition-colors duration-300
                 group"
    >
      <div className="w-12 h-12 flex items-center justify-center text-ocean-muted group-hover:text-ocean-cyan transition-colors">
        {icon}
      </div>
      
      <div className="flex-1">
        <p className="font-heading font-bold text-ocean-text dark:text-abyss-text">
          {platform}
        </p>
        <p
          className={`text-sm text-ocean-cyan transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          CONNECT &gt;&gt;
        </p>
      </div>

      <svg
        className="w-5 h-5 text-ocean-muted group-hover:text-ocean-cyan transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </motion.a>
  );
}
