"use client";

import { useScrollDepth } from "@/hooks/useScrollDepth";

export function DepthGauge() {
  const { depth, progress, zone } = useScrollDepth();

  const formattedDepth = depth.toString().padStart(4, "0");

  return (
    <div
      data-testid="depth-gauge"
      className="fixed bottom-8 right-8 z-40 hidden md:flex flex-col items-end gap-2
                 p-4 rounded-lg bg-white/50 dark:bg-abyss/50 backdrop-blur-sm
                 border border-ocean-muted/20"
    >
      <p data-testid="depth-zone" className={`hud-text text-[10px] ${zone.color}`}>
        {zone.name}
      </p>

      <div className="flex items-baseline gap-1">
        <span
          data-testid="depth-value"
          className={`text-4xl font-heading font-bold tabular-nums ${zone.color}`}
        >
          {formattedDepth}
        </span>
        <span className={`text-sm ${zone.color}`}>m</span>
      </div>

      <p className="hud-text text-[9px]">COORDS: 34.052 N, 118.243 W</p>
      <p className="hud-text text-[9px]">DEPTH: {zone.label}</p>

      <div className="w-1 h-24 bg-ocean-muted/20 rounded-full relative mt-2">
        <div
          className={`absolute w-3 h-3 -left-1 rounded-full transition-all duration-300 ${zone.color.replace("text-", "bg-")}`}
          style={{ top: `${progress * 100}%`, transform: "translateY(-50%)" }}
        />
        <div
          className={`absolute w-1 rounded-full transition-all duration-300 ${zone.color.replace("text-", "bg-")} opacity-50`}
          style={{ height: `${progress * 100}%`, top: 0 }}
        />
      </div>
    </div>
  );
}
