"use client";

import { motion } from "framer-motion";

interface FishProps {
  x: number;
  y: number;
  rotation: number;
  color?: string;
  scale?: number;
  opacity?: number;
}

export const Fish = ({ 
  x, 
  y, 
  rotation, 
  color = "#00BCD4", 
  scale = 1,
  opacity = 0.8
}: FishProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none will-change-transform"
      animate={{ 
        x, 
        y, 
        rotate: rotation,
        scale
      }}
      transition={{ 
        type: "spring", 
        damping: 20,
        stiffness: 100,
        mass: 0.5
      }}
      style={{
        left: 0,
        top: 0,
        opacity
      }}
    >
      <svg 
        width="20" 
        height="10" 
        viewBox="0 0 20 10" 
        style={{ overflow: 'visible' }}
      >
        {/* Body */}
        <ellipse 
          cx="10" 
          cy="5" 
          rx="8" 
          ry="4" 
          fill={color} 
        />
        {/* Tail */}
        <path 
          d="M 2 5 L -2 2 L -2 8 Z" 
          fill={color} 
        />
        {/* Fin */}
        <path
          d="M 10 5 L 6 5 L 8 1 Z"
          fill={color}
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
};
