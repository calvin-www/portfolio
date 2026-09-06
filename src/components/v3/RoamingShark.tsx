"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Shark } from "./Shark";

/** Scroll distance for one crossing of the viewport. */
const CROSSING_PX = 650;
/** Where the first crossing starts: just as the hero has scrolled away. */
const START_FRACTION_OF_VIEWPORT = 0.85;

/**
 * "always circling": once the hero is gone, the shark swims back and forth
 * across the whole page for as long as you scroll. It turns around off-screen
 * at each edge so the mirror flip is never seen. Rendered by the layout as a
 * sibling of <main> so it paints behind the content; home page only.
 * Decorative, and removed under reduced motion.
 */
export function RoamingShark() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // Progress in crossings, starting once the hero has left.
  const t = useTransform(scrollY, (y) => {
    const vh = typeof window === "undefined" ? 800 : window.innerHeight;
    return Math.max(0, (y - vh * START_FRACTION_OF_VIEWPORT) / CROSSING_PX);
  });
  // Triangle wave: 0 → 1 going right, 1 → 0 coming back, and so on.
  const x = useTransform(t, (v) => {
    const phase = v % 2;
    const p = phase < 1 ? phase : 2 - phase;
    return `${-18 + p * 118}vw`;
  });
  const facing = useTransform(t, (v) => (v % 2 < 1 ? -1 : 1));
  const y = useTransform(t, (v) => `${Math.sin(v * Math.PI * 1.5) * 4}vh`);
  const opacity = useTransform(scrollY, (v) => {
    const vh = typeof window === "undefined" ? 800 : window.innerHeight;
    const start = vh * START_FRACTION_OF_VIEWPORT;
    return Math.max(0, Math.min(1, (v - start) / 240));
  });

  if (reduced || pathname !== "/") return null;

  return (
    <div aria-hidden className="v3-roam pointer-events-none fixed inset-x-0 top-[58vh] z-0">
      <motion.div style={{ x, y, opacity }} className="w-[min(10rem,34vw)]">
        <motion.div style={{ scaleX: facing }}>
          <div className="shark-idle">
            <Shark className="h-auto w-full" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
