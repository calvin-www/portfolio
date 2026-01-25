"use client";

import { Canvas } from "@react-three/fiber";
import { DATA } from "@/data/resume";
import { ProjectFish } from "./ProjectFish";
import { Suspense } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProjectCard } from "@/components/project-card";

const FISH_CONFIG = [
  {
    color: "#FF6B9D", // Coral
    scale: 1.5,
    position: [-4, 1, 0] as [number, number, number],
    swimRange: [2, 1] as [number, number],
    speed: 0.8
  },
  {
    color: "#26C6DA", // Seafoam
    scale: 1.3,
    position: [4, -1, -1] as [number, number, number],
    swimRange: [2.5, 1.5] as [number, number],
    speed: 0.7
  },
  {
    color: "#00E5FF", // Biolum
    scale: 1.2,
    position: [-2, -2, 1] as [number, number, number],
    swimRange: [1.5, 1] as [number, number],
    speed: 0.9
  },
  {
    color: "#00BCD4", // Shallow
    scale: 1.0,
    position: [2, 2, -2] as [number, number, number],
    swimRange: [3, 1] as [number, number],
    speed: 0.6
  },
  {
    color: "#0288D1", // Mid
    scale: 1.0,
    position: [0, 0, 0] as [number, number, number],
    swimRange: [2, 2] as [number, number],
    speed: 0.5
  },
  {
    color: "#FF6B9D", // Coral
    scale: 0.9,
    position: [5, 1, 1] as [number, number, number],
    swimRange: [1.5, 1.5] as [number, number],
    speed: 1.0
  }
];

export function FishProjects() {
  // Take only the first 6 projects
  const projects = DATA.projects.slice(0, 6);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 w-full">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            dates=""
            tags={project.technologies}
            image={project.image}
            video={project.video}
            links={project.links}
            href={project.href}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative -my-20 z-10">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <pointLight position={[-5, 0, 5]} intensity={0.5} color="#00BCD4" />
        
        <Suspense fallback={null}>
          {projects.map((project, i) => {
            const config = FISH_CONFIG[i] || FISH_CONFIG[0];
            return (
              <ProjectFish
                key={project.title}
                project={project}
                position={config.position}
                color={config.color}
                scale={config.scale}
                swimRange={config.swimRange}
                speed={config.speed}
              />
            );
          })}
        </Suspense>
      </Canvas>
      
      {/* Overlay instruction */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm font-light tracking-widest pointer-events-none">
        CLICK FISH TO EXPLORE
      </div>
    </div>
  );
}
