"use client";

import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Jellyfish() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useReducedMotion();

  if (isMobile || prefersReducedMotion) return null;

  // Mid-depth zone: 40-60% of viewport height
  // 2-3 jellyfish max
  const jellyfish = [
    { id: 1, left: "15%", top: "45%", delay: 0, size: 70, duration: "15s" },
    { id: 2, left: "80%", top: "55%", delay: 2, size: 55, duration: "18s" },
    { id: 3, left: "10%", top: "65%", delay: 5, size: 45, duration: "20s" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {jellyfish.map((jf) => (
        <div
          key={jf.id}
          className="absolute animate-float-vertical"
          style={{
            left: jf.left,
            top: jf.top,
            width: jf.size,
            height: jf.size * 1.4,
            animationDuration: jf.duration,
            animationDelay: `${jf.delay}s`,
            opacity: 0.6,
          }}
        >
          <svg
            viewBox="0 0 60 90"
            className="w-full h-full animate-pulse-slow"
            style={{
              animationDelay: `${jf.delay}s`,
            }}
          >
            {/* Bell/Dome */}
            <path
              d="M 5 30 Q 30 0 55 30 Q 55 45 30 40 Q 5 45 5 30"
              fill="rgba(0, 229, 255, 0.15)"
              stroke="rgba(0, 229, 255, 0.3)"
              strokeWidth="1"
            />
            
            {/* Inner Bell Glow */}
            <ellipse 
              cx="30" 
              cy="30" 
              rx="15" 
              ry="10" 
              fill="rgba(0, 229, 255, 0.2)" 
              filter="blur(2px)"
            />

            {/* Tentacles - Central */}
            <path
              d="M 25 40 Q 20 60 25 85"
              stroke="rgba(0, 229, 255, 0.3)"
              strokeWidth="1.5"
              fill="none"
              className="animate-tentacle-sway"
              style={{ animationDelay: "0.2s" }}
            />
            <path
              d="M 35 40 Q 40 60 35 85"
              stroke="rgba(0, 229, 255, 0.3)"
              strokeWidth="1.5"
              fill="none"
              className="animate-tentacle-sway"
              style={{ animationDelay: "0.5s" }}
            />
            
            {/* Tentacles - Outer */}
            <path
              d="M 15 38 Q 10 60 15 80"
              stroke="rgba(0, 229, 255, 0.2)"
              strokeWidth="1"
              fill="none"
              className="animate-tentacle-sway"
              style={{ animationDelay: "0s" }}
            />
            <path
              d="M 45 38 Q 50 60 45 80"
              stroke="rgba(0, 229, 255, 0.2)"
              strokeWidth="1"
              fill="none"
              className="animate-tentacle-sway"
              style={{ animationDelay: "0.7s" }}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
