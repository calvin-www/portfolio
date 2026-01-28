"use client";

import React, { useState, useEffect } from "react";
import Particles from "./magicui/particles";
import { useTheme } from "next-themes";

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Define colors for light and dark modes
  const lightModeColor = "rgb(230,231,232)";
  const darkModeColor = "rgb(14,17,17)";

  const gradientColor = theme === "dark" ? darkModeColor : lightModeColor;
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-gradient-radial"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor}, transparent 80%)`,
        }}
      />
      <Particles
        className="absolute inset-0"
        quantity={100}
        staticity={50}
        ease={50}
        refresh={false}
        color={theme === "dark" ? "#38b3ff" : "#1a365d"}
      />
    </div>
  );
}