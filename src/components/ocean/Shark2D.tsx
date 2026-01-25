"use client";

import { useState, useEffect, useRef } from "react";

export function Shark2D() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);
  const lastPosition = useRef({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show shark after mount to avoid hydration mismatch
    setIsVisible(true);

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      const x = (touch.clientX / window.innerWidth) * 100;
      const y = (touch.clientY / window.innerHeight) * 100;
      
      // Calculate rotation to face movement
      const dx = x - lastPosition.current.x;
      const dy = y - lastPosition.current.y;
      
      // Only update rotation if movement is significant
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        // Calculate angle in degrees
        // dx is percentage, but aspect ratio matters for true angle
        // We'll approximate or use window dimensions for better accuracy
        const realDx = touch.clientX - (lastPosition.current.x / 100 * window.innerWidth);
        const realDy = touch.clientY - (lastPosition.current.y / 100 * window.innerHeight);
        const angle = Math.atan2(realDy, realDx) * (180 / Math.PI);
        setRotation(angle);
      }

      setPosition({ x, y });
      lastPosition.current = { x, y };
    };
    
    window.addEventListener("touchstart", handleTouch);
    window.addEventListener("touchmove", handleTouch);
    
    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);
  
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <div 
        className="absolute w-32 h-16 transition-all duration-700 ease-out will-change-transform"
        style={{ 
          left: `${position.x}%`, 
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`
        }}
      >
        <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-lg filter drop-shadow-cyan-500/50">
           {/* Tail Fin */}
           <path d="M0,10 L25,30 L0,50 L10,30 Z" fill="#0097A7" />
           
           {/* Body Main */}
           <path d="M20,20 L90,20 L90,40 L20,40 Z" fill="#00BCD4" />
           
           {/* Nose */}
           <path d="M90,20 L120,30 L90,40 Z" fill="#00BCD4" />
           
           {/* Belly (lighter underside) */}
           <path d="M20,40 L90,40 L85,45 L25,45 Z" fill="#B2EBF2" />
           
           {/* Dorsal Fin */}
           <path d="M50,20 L60,0 L70,20 Z" fill="#0097A7" />
           
           {/* Pectoral Fin (Side) */}
           <path d="M55,30 L45,55 L70,40 Z" fill="#0097A7" />
           
           {/* Eye */}
           <circle cx="100" cy="28" r="2" fill="black" />
        </svg>
      </div>
    </div>
  );
}
