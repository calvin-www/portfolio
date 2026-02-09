"use client";

import { useState, useEffect, useCallback } from "react";

interface DepthZone {
  name: string;
  color: string;
  label: string;
}

const ZONES: { threshold: number; zone: DepthZone }[] = [
  { threshold: 0, zone: { name: "EPIPELAGIC ZONE", color: "text-ocean-blue", label: "SURFACE" } },
  { threshold: 200, zone: { name: "MESOPELAGIC ZONE", color: "text-ocean-blue", label: "TWILIGHT" } },
  { threshold: 1000, zone: { name: "BATHYPELAGIC ZONE", color: "text-indigo-500", label: "MIDNIGHT" } },
  { threshold: 3000, zone: { name: "ABYSSOPELAGIC ZONE", color: "text-red-500", label: "ABYSS" } },
];

const MAX_DEPTH = 4000;

export function useScrollDepth() {
  const [depth, setDepth] = useState(0);
  const [progress, setProgress] = useState(0);
  const [zone, setZone] = useState<DepthZone>(ZONES[0].zone);

  const updateDepth = useCallback(() => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;
    
    const currentDepth = Math.round(scrollProgress * MAX_DEPTH);

    let currentZone = ZONES[0].zone;
    for (let i = ZONES.length - 1; i >= 0; i--) {
      if (currentDepth >= ZONES[i].threshold) {
        currentZone = ZONES[i].zone;
        break;
      }
    }

    setProgress(scrollProgress);
    setDepth(currentDepth);
    setZone(currentZone);
  }, []);

  useEffect(() => {
    let rafId: number;
    
    const handleScroll = () => {
      rafId = requestAnimationFrame(updateDepth);
    };

    updateDepth();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateDepth]);

  return { depth, progress, zone };
}
