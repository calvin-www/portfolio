"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface BubblesProps {
  className?: string;
  minBubbles?: number;
  maxBubbles?: number;
}

export const Bubbles: React.FC<BubblesProps> = ({
  className = "",
  minBubbles = 20,
  maxBubbles = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll();
  const [targetQuantity, setTargetQuantity] = useState(minBubbles);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const currentMin = isMobile ? Math.floor(minBubbles / 2) : minBubbles;
    const currentMax = isMobile ? Math.floor(maxBubbles / 2) : maxBubbles;
    setTargetQuantity(Math.floor(currentMin + latest * (currentMax - currentMin)));
  });

  const resizeCanvas = useCallback(() => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  }, [dpr]);

  type Circle = {
    x: number;
    y: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dy: number; // Vertical speed (negative for up)
    wobblePhase: number;
    wobbleSpeed: number;
    wobbleAmp: number;
  };

  const circleParams = useCallback((fromBottom = false): Circle => {
    const x = Math.random() * canvasSize.current.w;
    const y = fromBottom 
      ? canvasSize.current.h + 10 
      : Math.random() * canvasSize.current.h;
    
    const size = Math.random() * 4 + 2; // 2-6px
    const alpha = 0;
    const targetAlpha = Math.random() * 0.4 + 0.1; // 0.1-0.5 opacity
    
    // Speed depends on size (larger = faster)
    const dy = -(Math.random() * 0.5 + 0.2 + (size * 0.1)); 
    
    const wobblePhase = Math.random() * Math.PI * 2;
    const wobbleSpeed = Math.random() * 0.05 + 0.02;
    const wobbleAmp = Math.random() * 20 + 10;

    return {
      x,
      y,
      size,
      alpha,
      targetAlpha,
      dy,
      wobblePhase,
      wobbleSpeed,
      wobbleAmp,
    };
  }, []);

  const drawCircle = useCallback((circle: Circle) => {
    if (context.current) {
      context.current.beginPath();
      context.current.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
      // Ocean bubble color: white/cyan tint
      context.current.fillStyle = `rgba(224, 247, 250, ${circle.alpha})`;
      context.current.fill();
      
      // Optional: Add a stroke for better visibility
      context.current.strokeStyle = `rgba(255, 255, 255, ${circle.alpha * 1.2})`;
      context.current.lineWidth = 1;
      context.current.stroke();
    }
  }, []);

  const clearContext = useCallback(() => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  }, []);

  const animate = useCallback(() => {
    clearContext();
    
    // Manage quantity
    if (circles.current.length < targetQuantity) {
      // Add new bubble
      circles.current.push(circleParams(true)); // Spawn from bottom
    } else if (circles.current.length > targetQuantity) {
      // Remove excess if they are off screen, or just let them float away
      // We'll handle removal in the loop below
    }

    // Filter out bubbles that are way off screen (top)
    circles.current = circles.current.filter(circle => circle.y > -50);

    circles.current.forEach((circle: Circle) => {
      // Fade in
      if (circle.alpha < circle.targetAlpha) {
        circle.alpha += 0.01;
      }

      // Movement
      circle.y += circle.dy;
      circle.wobblePhase += circle.wobbleSpeed;
      const wobbleOffset = Math.sin(circle.wobblePhase) * 0.5; // Incremental wobble
      circle.x += wobbleOffset;

      // Cursor Repulsion
      const dx = circle.x - mouse.current.x;
      const dy = circle.y - mouse.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 150;

      if (distance < repulsionRadius) {
        const force = (repulsionRadius - distance) / repulsionRadius;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force * 2;
        const pushY = Math.sin(angle) * force * 2;
        
        circle.x += pushX;
        circle.y += pushY;
      }

      // Wrap around X if needed (optional, but keeps them on screen)
      if (circle.x < -50) circle.x = canvasSize.current.w + 50;
      if (circle.x > canvasSize.current.w + 50) circle.x = -50;

      drawCircle(circle);
    });

    // If we have too few bubbles (e.g. after filtering), add more
    // But only if we are below target
    while (circles.current.length < targetQuantity) {
       circles.current.push(circleParams(true));
    }

    window.requestAnimationFrame(animate);
  }, [targetQuantity, circleParams, drawCircle, clearContext]);

  const initCanvas = useCallback(() => {
    resizeCanvas();
    // Don't clear and redraw immediately, let the loop handle it to avoid flickering
  }, [resizeCanvas]);

  const onMouseMove = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left; // Local coordinates
      const y = mousePosition.y - rect.top;
      mouse.current.x = x;
      mouse.current.y = y;
    }
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [prefersReducedMotion, initCanvas, animate]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    onMouseMove();
  }, [mousePosition.x, mousePosition.y, prefersReducedMotion, onMouseMove]);

  if (prefersReducedMotion) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
