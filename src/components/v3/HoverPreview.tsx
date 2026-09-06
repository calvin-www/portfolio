"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import type { Entry } from "@/data/adapters/v3";

const OFFSET = { x: 22, y: 18 };

/**
 * A small thumbnail that trails the cursor while a row with an image is
 * hovered. Rendered once per list; the list tells it which entry and where.
 * Mouse-only by construction: rows only report hover for mouse pointers.
 */
export function HoverPreview({ entry, point }: { entry: Entry | null; point: { x: number; y: number } | null }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 400, damping: 40, mass: 0.6 });

  useEffect(() => {
    if (!point) return;
    x.set(point.x + OFFSET.x);
    y.set(point.y + OFFSET.y);
  }, [point, x, y]);

  const image = entry?.image ?? null;

  return (
    <AnimatePresence>
      {entry && image && (
        <motion.div
          key={entry.slug}
          data-testid="hover-preview"
          aria-hidden
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="pointer-events-none fixed left-0 top-0 z-40 w-52 overflow-hidden rounded-lg border border-line bg-surface shadow-[0_18px_40px_-18px_rgba(32,28,21,0.5)]"
        >
          <Image src={image} alt="" width={208} height={117} className="aspect-video w-full object-cover" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
