"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { Entry } from "@/data/adapters/v3";

type Props = {
  entry: Entry;
  onOpen: () => void;
  /** Called with the pointer position while hovering, and null on leave. */
  onHover: (point: { x: number; y: number } | null) => void;
};

/** Forwards its ref to the <li> so AnimatePresence's popLayout mode can measure it. */
export const EntryRow = forwardRef<HTMLLIElement, Props>(function EntryRow({ entry, onOpen, onHover }, ref) {
  return (
    <motion.li
      ref={ref}
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <button
        type="button"
        data-testid="entry-row"
        data-type={entry.type}
        onClick={onOpen}
        onPointerEnter={(e) => e.pointerType === "mouse" && onHover({ x: e.clientX, y: e.clientY })}
        onPointerMove={(e) => e.pointerType === "mouse" && onHover({ x: e.clientX, y: e.clientY })}
        onPointerLeave={() => onHover(null)}
        className="group -mx-3 flex w-[calc(100%+1.5rem)] items-start gap-4 rounded-lg px-3 py-4 text-left transition-colors hover:bg-surface"
      >
        <span aria-hidden className="w-7 shrink-0 text-center text-xl leading-7">
          {entry.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <motion.span layoutId={`entry-title-${entry.slug}`} className="font-semibold transition-colors group-hover:text-teal-ink">
              {entry.title}
            </motion.span>
            <span className="text-v3-xs text-ink-muted">{entry.dateLabel}</span>
          </span>
          <span className="mt-0.5 block text-v3-sm text-ink-muted">{entry.tagline}</span>
        </span>
        <span className="shrink-0 pt-1 text-v3-xs text-ink-muted">{entry.type}</span>
      </button>
    </motion.li>
  );
});
