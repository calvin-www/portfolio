"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Shark } from "./Shark";

/** Scroll distance for one crossing of the viewport. */
const CROSSING_PX = 650;
/** Where the first crossing starts: just as the hero has scrolled away. */
const START_FRACTION_OF_VIEWPORT = 0.85;
/** Vertical anchor of the lane, as a fraction of the viewport height. */
const LANE_TOP = 0.58;

function viewportHeight() {
  return typeof window === "undefined" ? 800 : window.innerHeight;
}

/**
 * The shark's path as motion values driven by window scroll. Shared by the
 * fixed copy behind the page and the copy painted inside the ink band, so
 * the two line up exactly and read as one shark.
 */
/** Scroll position → progress in crossings, starting once the hero has left. */
function crossingsAt(y: number) {
  return Math.max(0, (y - viewportHeight() * START_FRACTION_OF_VIEWPORT) / CROSSING_PX);
}

/** Gentle vertical bob in vh, a pure function of progress so both copies agree. */
function bobAt(t: number) {
  return Math.sin(t * Math.PI * 1.5) * 4;
}

function useRoamingPath() {
  const { scrollY } = useScroll();
  const t = useTransform(scrollY, crossingsAt);
  // Triangle wave: 0 → 1 going right, 1 → 0 coming back, and so on.
  const x = useTransform(t, (v) => {
    const phase = v % 2;
    const p = phase < 1 ? phase : 2 - phase;
    return `${-18 + p * 118}vw`;
  });
  const facing = useTransform(t, (v): number => (v % 2 < 1 ? -1 : 1));
  const bob = useTransform(t, bobAt);
  const opacity = useTransform(scrollY, (v) => {
    const start = viewportHeight() * START_FRACTION_OF_VIEWPORT;
    return Math.max(0, Math.min(1, (v - start) / 240));
  });
  return { scrollY, x, facing, bob, opacity };
}

function SharkBody({ x, facing, opacity, top }: { x: MotionValue<string>; facing: MotionValue<number>; opacity: MotionValue<number>; top: MotionValue<string> }) {
  return (
    <motion.div style={{ x, opacity, top }} className="absolute left-0 w-[min(10rem,34vw)]">
      <motion.div style={{ scaleX: facing }}>
        <div className="shark-idle">
          <Shark className="h-auto w-full" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * "always circling": once the hero is gone, the shark swims back and forth
 * across the whole page for as long as you scroll, turning around off-screen.
 * Rendered by the layout as a sibling of <main> so it paints behind the
 * content; home page only. Decorative, and removed under reduced motion.
 */
export function RoamingShark() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { x, facing, bob, opacity } = useRoamingPath();
  const top = useTransform(bob, (b) => `calc(${LANE_TOP * 100}vh + ${b}vh)`);

  if (reduced || pathname !== "/") return null;

  return (
    <div aria-hidden className="v3-roam pointer-events-none fixed inset-0 z-0">
      <SharkBody x={x} facing={facing} opacity={opacity} top={top} />
    </div>
  );
}

/**
 * The same shark, painted inside a solid band that would otherwise hide the
 * fixed copy. Positioned absolutely within the band at the spot the fixed
 * copy occupies on screen, and clipped by the band, so the shark appears to
 * swim straight through it in the band's text colour.
 */
export function BandShark() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [bandTop, setBandTop] = useState(0);
  const { scrollY, x, facing, opacity } = useRoamingPath();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBandTop(el.getBoundingClientRect().top + window.scrollY);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Viewport position → band-relative position. Derived from scrollY alone
  // (recomputing the bob) so it never reads a stale intermediate value.
  const top = useTransform(scrollY, (y) => {
    const vh = viewportHeight();
    return `${y - bandTop + vh * LANE_TOP + (bobAt(crossingsAt(y)) / 100) * vh}px`;
  });

  if (reduced) return null;

  return (
    <div ref={ref} aria-hidden className="v3-roam-band pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <SharkBody x={x} facing={facing} opacity={opacity} top={top} />
    </div>
  );
}
