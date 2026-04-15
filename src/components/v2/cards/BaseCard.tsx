"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface BaseCardProps {
  className?: string;
  children: React.ReactNode;
  testId?: string;
}

export function BaseCard({ className, children, testId }: BaseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Magnetic effect motion values
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springMagneticX = useSpring(magneticX, { damping: 20, stiffness: 300 });
  const springMagneticY = useSpring(magneticY, { damping: 20, stiffness: 300 });

  // 3D tilt calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });
    setCardDimensions({ width: rect.width, height: rect.height });

    // Magnetic effect: calculate offset from center (20% strength)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const offsetX = (x - centerX) * 0.2;
    const offsetY = (y - centerY) * 0.2;

    magneticX.set(offsetX);
    magneticY.set(offsetY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    magneticX.set(0);
    magneticY.set(0);
  };

  // Calculate 3D tilt transforms
  const tiltX = useTransform(
    () => {
      if (prefersReducedMotion || cardDimensions.height === 0) return 0;
      const normalizedY = (mousePos.y - cardDimensions.height / 2) / cardDimensions.height;
      return normalizedY * 20; // Max ±10 degrees
    }
  );

  const tiltY = useTransform(
    () => {
      if (prefersReducedMotion || cardDimensions.width === 0) return 0;
      const normalizedX = (mousePos.x - cardDimensions.width / 2) / cardDimensions.width;
      return normalizedX * -20; // Max ±10 degrees (inverted)
    }
  );

  // Smooth spring transitions for tilt
  const springTiltX = useSpring(tiltX, { damping: 20, stiffness: 300 });
  const springTiltY = useSpring(tiltY, { damping: 20, stiffness: 300 });

  // Combined transform for 3D tilt
  const rotateX = useTransform(springTiltX, (val) => `${val}deg`);
  const rotateY = useTransform(springTiltY, (val) => `${val}deg`);

  return (
    <motion.div
      ref={cardRef}
      data-testid={testId}
      data-interactive
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springMagneticX,
        y: springMagneticY,
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformPerspective: 1000,
      }}
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative flex-shrink-0 rounded-2xl overflow-hidden
                 bg-white dark:bg-white/5 
                 border border-ocean-muted/20 hover:border-ocean-cyan/50
                 transition-all duration-300
                 base-card ${className || ""}`}
    >
      {/* Conic gradient border glow */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-[-2px] rounded-2xl pointer-events-none z-[-1]"
          style={{
            opacity: isHovered ? 1 : 0,
            background: "conic-gradient(from var(--angle), transparent 60%, rgba(0, 181, 216, 0.6) 100%)",
            animation: isHovered ? "rotate 3s linear infinite" : "none",
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Inner glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered && !prefersReducedMotion ? 0.4 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 181, 216, 0.15), transparent 40%)`,
        }}
      />

      {/* Card content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* CSS for conic gradient animation */}
      <style jsx>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes rotate {
          from {
            --angle: 0deg;
          }
          to {
            --angle: 360deg;
          }
        }
      `}</style>
    </motion.div>
  );
}
