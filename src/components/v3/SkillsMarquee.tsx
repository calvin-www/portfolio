"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SKILL_ROWS } from "@/data/adapters/v3-skills";
import { COPY } from "@/data/v3-copy";
import { MarqueeRow } from "./MarqueeRow";

/** Different speeds and alternating directions so the rows never line up. */
const SPEEDS = [-38, 52, -30, 44];

export function SkillsMarquee() {
  const [selected, setSelected] = useState<string | null>(null);
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="v3-band v3-band-surface mt-16 py-10 sm:py-12"
      data-selected={selected ?? ""}
    >
      <div className="v3-band-inner flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="skills-heading" className="text-v3-xl font-semibold tracking-[-0.01em]">
          {COPY.skills.heading}
        </h2>
        <p className="text-v3-sm text-ink-muted">{COPY.skills.hint}</p>
      </div>

      <div className="mt-6">
        {SKILL_ROWS.map((row, i) => (
          <div key={row.id} className="v3-marquee-band">
            <div className="v3-band-inner">
              <span className="v3-marquee-label" aria-hidden>
                {row.label}
              </span>
            </div>
            <MarqueeRow
              skills={row.skills}
              speed={SPEEDS[i % SPEEDS.length]}
              selected={selected}
              onSelect={(id) => setSelected((cur) => (cur === id ? null : id))}
              reducedMotion={reduced}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
