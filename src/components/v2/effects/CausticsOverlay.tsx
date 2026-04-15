"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function CausticsOverlay() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || resolvedTheme === "dark") {
    return null;
  }

  return (
    <div
      data-testid="caustics-overlay"
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
      style={{
        background: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(255, 255, 255, 0.03) 100px,
            rgba(255, 255, 255, 0.03) 200px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 100px,
            rgba(255, 255, 255, 0.02) 100px,
            rgba(255, 255, 255, 0.02) 200px
          )
        `,
        animation: "caustics 20s linear infinite",
      }}
    >
      <style jsx>{`
        @keyframes caustics {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 200px 200px, -200px 200px;
          }
        }
      `}</style>
    </div>
  );
}
