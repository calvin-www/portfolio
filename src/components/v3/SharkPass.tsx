"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shark } from "./Shark";

/**
 * "always circling": the hero shark left to the west as the hero scrolled
 * out; here it comes back from the east and crosses the page once, driven
 * by scroll. Purely decorative, so it is hidden from assistive tech and
 * removed under reduced motion (globals.css).
 */
export function SharkPass() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0.1, 0.9], ["100vw", "-30vw"]);
  const y = useTransform(scrollYProgress, [0.1, 0.5, 0.9], ["1.5rem", "-1rem", "1rem"]);

  return (
    <div ref={ref} aria-hidden className="v3-shark-pass relative py-10 sm:py-14">
      <div className="v3-shark-lane">
        {/* The idle sway lives on an inner element: its CSS transform must not fight the scroll-driven one. */}
        <motion.div style={{ x, y }} className="w-[min(11rem,40vw)] text-ink opacity-40">
          <div className="shark-idle">
            <Shark className="h-auto w-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
