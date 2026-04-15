"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";

export function FlashlightOverlay() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  if (!mounted || resolvedTheme !== "dark") {
    return null;
  }

  return (
    <div
      data-testid="flashlight-overlay"
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        background: `radial-gradient(circle 200px at ${position.x}px ${position.y}px, 
          transparent 0%, 
          rgba(10, 22, 40, 0.3) 50%, 
          rgba(10, 22, 40, 0.6) 100%)`,
      }}
    />
  );
}
