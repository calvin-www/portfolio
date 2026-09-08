"use client";

import { useEffect, useRef } from "react";
import { Shark } from "./Shark";

const MAX_TILT_DEG = 7;

/**
 * The hero shark. The drawing animates in with CSS (see `.shark-draw` in
 * globals.css). On pointer devices this wrapper also tilts the shark a few
 * degrees toward the cursor: nose up when the cursor is above it, nose down
 * when below. Reduced-motion users get the finished drawing, still.
 */
export function HeroShark() {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        // The shark faces left. Cursor ahead of it pulls the nose; behind it, the tail.
        const ahead = e.clientX < cx ? 1 : -0.5;
        const raw = ((cy - e.clientY) / box.height) * 10 * ahead;
        const tilt = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, raw));
        el.style.setProperty("--shark-tilt", `${tilt.toFixed(2)}deg`);
      });
    };
    const onLeave = () => el.style.setProperty("--shark-tilt", "0deg");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={tiltRef} className="shark-tilt w-[min(17rem,60vw)]">
      <div className="shark-idle">
        <Shark className="shark-draw h-auto w-full" title="a line drawing of a shark" />
      </div>
    </div>
  );
}
