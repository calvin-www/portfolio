'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function OceanBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  // Interpolate colors based on scroll
  // Using the ocean depth colors from globals.css
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    ['#E0F7FA', '#00BCD4', '#0288D1', '#01579B']
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  return (
    <motion.div 
      className="fixed inset-0 -z-10"
      style={{ backgroundColor }}
    >
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 80%)`,
          }}
        />
      )}
    </motion.div>
  );
}
