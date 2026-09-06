"use client";

import { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { COPY } from "@/data/v3-copy";

/**
 * A statement that types itself out as you scroll. The section is tall and
 * the text is pinned inside it; scroll progress through the section becomes
 * a character count written to one CSS variable (`--typed`), and CSS derives
 * each character's opacity and colour from that. The words are inline-block
 * so lines still break between words.
 *
 * Reduced motion: globals.css unpins the text and shows every character.
 */
export function ScrollStatement() {
  const ref = useRef<HTMLElement>(null);
  const text = COPY.statement;
  const words = text.split(" ");
  const total = text.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.9"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    ref.current?.style.setProperty("--typed", (p * (total + 2)).toFixed(2));
  });

  let index = 0;
  return (
    <section ref={ref} aria-label="about me, briefly" className="v3-pin-section relative" style={{ "--typed": 0, "--total": total } as React.CSSProperties}>
      <div className="v3-pin">
        <p className="sr-only">{text}</p>
        <p aria-hidden className="v3-typed max-w-[24ch] text-[clamp(1.5rem,4.2vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.015em]">
          {words.map((word, w) => {
            const chars = word.split("").map((ch) => {
              const i = index++;
              return (
                <span key={i} className="v3-ch" style={{ "--i": i } as React.CSSProperties}>
                  {ch}
                </span>
              );
            });
            index++; // the space after the word
            return (
              <span key={w}>
                <span className="inline-block whitespace-nowrap">{chars}</span>
                {w < words.length - 1 ? " " : null}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
