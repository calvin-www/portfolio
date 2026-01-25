"use client";

import { useEffect, useState, useRef } from "react";
import { Fish } from "./Fish";

interface FishData {
  id: string;
  offsetX: number;
  offsetY: number;
  scatterTargetX: number;
  scatterTargetY: number;
  isScattered: boolean;
  angle: number; // For idle movement
  speed: number;
}

interface School {
  id: string;
  x: number;
  y: number;
  fish: FishData[];
}

export const FishSchool = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize schools
  useEffect(() => {
    if (typeof window === "undefined") return;

    const generateSchools = () => {
      const newSchools: School[] = [];
      const schoolCount = 3; // 2-3 schools

      for (let i = 0; i < schoolCount; i++) {
        const fishCount = 5 + Math.floor(Math.random() * 6); // 5-10 fish
        const schoolX = Math.random() * (window.innerWidth * 0.8) + (window.innerWidth * 0.1);
        // Keep in top 70% (shallow/mid)
        const schoolY = Math.random() * (window.innerHeight * 0.7);

        const fish: FishData[] = [];
        for (let j = 0; j < fishCount; j++) {
          fish.push({
            id: `fish-${i}-${j}`,
            offsetX: (Math.random() - 0.5) * 100,
            offsetY: (Math.random() - 0.5) * 60,
            scatterTargetX: 0,
            scatterTargetY: 0,
            isScattered: false,
            angle: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5,
          });
        }

        newSchools.push({
          id: `school-${i}`,
          x: schoolX,
          y: schoolY,
          fish,
        });
      }
      setSchools(newSchools);
    };

    generateSchools();
    
    // Handle resize
    const handleResize = () => generateSchools();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      setSchools(prevSchools => prevSchools.map(school => {
        let schoolChanged = false;
        
        const newFish = school.fish.map(f => {
          // Calculate absolute position of fish
          const fishAbsX = school.x + f.offsetX;
          const fishAbsY = school.y + f.offsetY;
          
          const dx = e.clientX - fishAbsX;
          const dy = e.clientY - fishAbsY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150 && !f.isScattered) { // Increased radius slightly for better feel
            // Trigger scatter
            const angle = Math.atan2(dy, dx);
            // Scatter away from cursor
            const scatterDist = 200 + Math.random() * 100;
            
            schoolChanged = true;
            
            // Set timeout to regroup
            setTimeout(() => {
              setSchools(current => current.map(s => {
                if (s.id !== school.id) return s;
                return {
                  ...s,
                  fish: s.fish.map(currFish => 
                    currFish.id === f.id ? { ...currFish, isScattered: false } : currFish
                  )
                };
              }));
            }, 2000);

            return {
              ...f,
              isScattered: true,
              scatterTargetX: fishAbsX - Math.cos(angle) * scatterDist,
              scatterTargetY: fishAbsY - Math.sin(angle) * scatterDist,
            };
          }
          return f;
        });

        return schoolChanged ? { ...school, fish: newFish } : school;
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Idle animation loop
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      setSchools(prev => prev.map(school => ({
        ...school,
        // Slowly drift the entire school
        x: school.x + Math.sin(Date.now() / 3000 + parseInt(school.id.split('-')[1])) * 0.2,
        y: school.y + Math.cos(Date.now() / 4000) * 0.1,
        fish: school.fish.map(f => ({
          ...f,
          // Update idle movement angle
          angle: f.angle + 0.01 * f.speed,
          // Gentle bobbing when not scattered
          offsetX: f.isScattered ? f.offsetX : f.offsetX + Math.sin(f.angle) * 0.2,
          offsetY: f.isScattered ? f.offsetY : f.offsetY + Math.cos(f.angle) * 0.2,
        }))
      })));
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {schools.map(school => (
        <div key={school.id}>
          {school.fish.map(f => {
            // Determine target position
            const targetX = f.isScattered ? f.scatterTargetX : (school.x + f.offsetX);
            const targetY = f.isScattered ? f.scatterTargetY : (school.y + f.offsetY);
            
            // Calculate rotation based on movement or scatter
            // For simplicity, face left/right based on drift or scatter direction
            let rotation = 0;
            if (f.isScattered) {
               // Face away from scatter origin (which is roughly the mouse)
               // Actually, face towards target
               // We don't have previous pos easily here for velocity vector, 
               // but we can infer from target vs school center
               const dx = targetX - (school.x + f.offsetX);
               const dy = targetY - (school.y + f.offsetY);
               rotation = Math.atan2(dy, dx) * (180 / Math.PI);
            } else {
               // Idle rotation - mostly horizontal with slight wobble
               rotation = Math.sin(f.angle) * 10;
            }

            return (
              <Fish
                key={f.id}
                x={targetX}
                y={targetY}
                rotation={rotation}
                color={parseInt(school.id.split('-')[1]) % 2 === 0 ? "#00BCD4" : "#FF6B9D"}
                scale={f.isScattered ? 1.2 : 1}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
