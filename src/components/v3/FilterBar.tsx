"use client";

import { motion } from "framer-motion";
import { FILTERS, type Filter } from "@/data/adapters/v3";
import { cn } from "@/lib/utils";

export function FilterBar({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div role="group" aria-label="filter" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-v3-sm">
      {FILTERS.map((f) => {
        const active = f === value;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f)}
            className={cn(
              "relative pb-1 transition-colors",
              active ? "font-medium text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {f}
            {active && (
              <motion.span
                layoutId="filter-underline"
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 bg-teal"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
