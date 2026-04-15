"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  parallaxFactor: number;
}

export function ParallaxBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < 25; i++) {
      const size = 10 + Math.random() * 50;
      newBubbles.push({
        id: i,
        x: Math.random() * 100,
        size,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 20,
        parallaxFactor: size / 60,
      });
    }
    setBubbles(newBubbles);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMouseOffset({
      x: (e.clientX - centerX) / centerX,
      y: (e.clientY - centerY) / centerY,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          data-testid="bubble"
          className="absolute rounded-full bg-ocean-blue/10 dark:bg-ocean-cyan/10"
          style={{
            left: `${bubble.x}%`,
            width: bubble.size,
            height: bubble.size,
            x: mouseOffset.x * 30 * bubble.parallaxFactor,
            y: mouseOffset.y * 20 * bubble.parallaxFactor,
          }}
          animate={{
            y: [window.innerHeight + 100, -100],
            x: [0, Math.sin(bubble.id) * 30, 0],
            rotate: [0, 360],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
