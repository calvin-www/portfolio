"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LightRays() {
  const { scrollYProgress } = useScroll();
  // Opacity 100% at top -> 0% at 35% scroll (surface only)
  const rayOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  
  // Use client-side only rendering to avoid hydration mismatches with random values
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const rays = [
    { id: 1, left: "15%", width: "80px", height: "120vh", delay: 0, duration: 7, angle: -25 },
    { id: 2, left: "35%", width: "120px", height: "140vh", delay: 1.5, duration: 9, angle: -20 },
    { id: 3, left: "60%", width: "100px", height: "110vh", delay: 3, duration: 8, angle: -22 },
    { id: 4, left: "80%", width: "60px", height: "130vh", delay: 4.5, duration: 10, angle: -18 },
    { id: 5, left: "45%", width: "40px", height: "115vh", delay: 2, duration: 11, angle: -28 },
  ];

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: rayOpacity, zIndex: 1 }}
      aria-hidden="true"
    >
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute top-[-20%]"
          style={{
            left: ray.left,
            width: ray.width,
            height: ray.height,
            // Gradient: Light aqua/white with very low alpha -> transparent
            background: "linear-gradient(180deg, rgba(224, 247, 250, 0.08) 0%, rgba(224, 247, 250, 0.02) 40%, transparent 80%)",
            transformOrigin: "top center",
            rotate: `${ray.angle}deg`,
            filter: "blur(8px)", // Soften edges
          }}
          animate={{
            x: [0, 15, 0], // Subtle horizontal shift
            opacity: [0.8, 1, 0.8], // Subtle pulse
          }}
          transition={{
            duration: ray.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ray.delay,
          }}
        />
      ))}
    </motion.div>
  );
}
