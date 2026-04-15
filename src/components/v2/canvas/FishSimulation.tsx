"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createFish, updateFish, drawFish, Fish } from "@/lib/fishSimulation";

interface FishSimulationProps {
  skills: Array<{ name: string; category: string }>;
  maxFish?: number;
}

export function FishSimulation({ skills, maxFish = 30 }: FishSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fishRef = useRef<Fish[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const initializeFish = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const selectedSkills = skills.slice(0, maxFish);
    fishRef.current = selectedSkills.map((skill) =>
      createFish(skill.name, skill.category, canvas.width, canvas.height)
    );

    if (typeof window !== "undefined") {
      (window as unknown as { __fishCount: number }).__fishCount = fishRef.current.length;
    }
  }, [skills, maxFish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeFish();
    }
  }, [dimensions, initializeFish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fishRef.current = fishRef.current.map((fish) =>
        updateFish(fish, canvas.width, canvas.height, mouseRef.current.x, mouseRef.current.y)
      );

      fishRef.current.forEach((fish) => {
        drawFish(ctx, fish, time);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="fish-canvas"
      className="w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
}
