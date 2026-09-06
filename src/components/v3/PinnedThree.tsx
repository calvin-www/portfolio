"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { COPY } from "@/data/v3-copy";
import { cn } from "@/lib/utils";

/**
 * A pinned block: three lines that turn from muted to ink one at a time as
 * you scroll through a tall section, then a closing line. Scroll progress
 * picks the active index; CSS transitions the colours.
 *
 * Reduced motion: globals.css unpins the block and shows every line in ink.
 */
export function PinnedThree() {
  const ref = useRef<HTMLElement>(null);
  const lines = COPY.three.lines;
  const steps = lines.length + 1; // the closing line is the last step
  const [active, setActive] = useState(-1);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.9"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = p <= 0 ? -1 : Math.min(steps - 1, Math.floor(p * steps));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section ref={ref} aria-label="three things" className="v3-pin-section v3-pin-section-short relative" data-active={active}>
      <div className="v3-pin">
        <h2 className="text-v3-xl font-semibold tracking-[-0.01em]">{COPY.three.heading}</h2>
        <ol className="mt-6 space-y-4 text-[clamp(1.25rem,3vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.01em]">
          {lines.map((line, i) => (
            <li
              key={line}
              className={cn("v3-three-line max-w-[28ch]", active === i && "is-active")}
            >
              {line}
            </li>
          ))}
        </ol>
        <p className={cn("v3-three-line mt-8 text-v3-lg", active === steps - 1 && "is-active")}>{COPY.three.closing}</p>
      </div>
    </section>
  );
}
