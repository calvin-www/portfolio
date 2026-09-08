"use client";

import { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { COPY } from "@/data/v3-copy";
import { BandShark } from "./RoamingShark";

const FACE = ":D";

/**
 * A line that types itself out as you scroll, inside an inverted full-width
 * band. The section is tall and the text is pinned inside it; scroll progress
 * through the section becomes a character count written to one CSS variable
 * (`--typed`), and CSS derives each character's opacity and colour from that.
 * Words are inline-block so lines still break between words. A trailing ":D"
 * is rotated to face the reader and blinks, as the old headline did.
 *
 * Reduced motion: globals.css unpins the text and shows every character.
 */
export function ScrollStatement() {
  const ref = useRef<HTMLElement>(null);
  const text = COPY.statement;
  const words = text.split(" ");
  const total = text.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.55", "end 1"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    ref.current?.style.setProperty("--typed", (p * (total + 2)).toFixed(2));
  });

  let index = 0;
  const char = (ch: string, extra?: string) => {
    const i = index++;
    return (
      <span key={i} className={extra ? `v3-ch ${extra}` : "v3-ch"} style={{ "--i": i } as React.CSSProperties}>
        {ch}
      </span>
    );
  };

  return (
    <section
      ref={ref}
      aria-label="in one line"
      className="v3-pin-section v3-band v3-band-ink relative"
      style={{ "--typed": 0, "--total": total } as React.CSSProperties}
    >
      <BandShark />
      <div className="v3-pin v3-band-inner z-[1]">
        <p className="sr-only">{text}</p>
        <p
          aria-hidden
          className="v3-typed v3-display max-w-[14ch] text-[clamp(2.75rem,8vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.02em]"
        >
          {words.map((word, w) => {
            const isFace = word === FACE;
            const chars = isFace ? [char(":", "v3-face-eyes"), char("D")] : word.split("").map((ch) => char(ch));
            index++; // the space after the word
            return (
              <span key={w}>
                <span className={isFace ? "v3-face" : "inline-block whitespace-nowrap"}>{chars}</span>
                {w < words.length - 1 ? " " : null}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
