"use client";

import { useEffect, useState } from "react";
import { DATA } from "@/data";
import { FishSimulation } from "@/components/canvas/FishSimulation";

export function SkillsSection() {
  const [maxFish, setMaxFish] = useState(30);

  useEffect(() => {
    const checkMobile = () => {
      setMaxFish(window.innerWidth < 768 ? 15 : 30);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="skills"
      data-testid="skills-section"
      className="min-h-screen py-24 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-6xl md:text-8xl font-heading font-bold text-ocean-text dark:text-abyss-text">
            SKILL ECOSYSTEM
          </h2>
          <p className="hud-text mt-4">INTERACTIVE TECHNICAL ORGANISMS</p>
          <p className="text-sm text-ocean-muted mt-2">
            Move your cursor to interact with the fish
          </p>
        </div>

        <div className="relative h-[500px] md:h-[600px] rounded-2xl border border-ocean-muted/20 bg-white/50 dark:bg-abyss/50 overflow-hidden">
          <FishSimulation skills={DATA.skills} maxFish={maxFish} />
          
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-4">
            <Legend color="#3182CE" label="Language" />
            <Legend color="#00B5D8" label="Framework" />
            <Legend color="#718096" label="Tool" />
            <Legend color="#805AD5" label="Design" />
            <Legend color="#38A169" label="AI" />
          </div>

          <div className="absolute top-4 right-4">
            <p className="hud-text text-[10px]">ORGANISMS: {maxFish}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="hud-text text-[10px]">{label}</span>
    </div>
  );
}
