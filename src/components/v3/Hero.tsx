"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";
import { HeroShark } from "./HeroShark";

const FACE = " :D";

/**
 * Splits the headline so the emoticon can be rotated to face the reader.
 * The rotation is visual only; the text content stays "i like 2 build stuff :D".
 */
function Headline({ text }: { text: string }) {
  if (!text.endsWith(FACE)) return <>{text}</>;
  const words = text.slice(0, -FACE.length);
  return (
    <>
      {words}{" "}
      <span className="v3-face">
        <span className="v3-face-eyes">:</span>D
      </span>
    </>
  );
}

/** First screen: no nav, the shark swims off to the left as you scroll past. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", reduced ? "0vw" : "-45vw"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col pb-8 pt-10">
      <div className="my-auto">
        <motion.div style={{ x, opacity }}>
          <HeroShark />
        </motion.div>
        <h1 className="v3-display mt-4 text-[clamp(2.75rem,8vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.02em]">
          <Headline text={COPY.headline} />
        </h1>
        <ContactRow className="mt-8" />
      </div>
      <p aria-hidden className="v3-scroll-hint text-v3-xs text-ink-muted">
        {COPY.hero.scrollHint} ↓
      </p>
    </section>
  );
}
