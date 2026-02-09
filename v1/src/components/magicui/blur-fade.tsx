"use client";

import { AnimatePresence, motion, useInView, Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}
const BlurFade = ({
                    children,
                    className,
                    variant,
                    duration = 0.4,
                    delay = 0,
                    yOffset = 6,
                    inView = true,
                    inViewMargin = "-50px",
                    blur = "6px",
                  }: BlurFadeProps) => {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin as any });
  const isInView = !inView || inViewResult;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for IntersectionObserver to report before enabling hide logic.
    // IO callbacks fire before rAF in the event loop, so by the second rAF
    // useInView will have reported true for elements already in the viewport.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;
  return (
      <AnimatePresence>
        <motion.div
            ref={ref}
            initial={false}
            animate={!ready || isInView ? "visible" : "hidden"}
            exit="hidden"
            variants={combinedVariants}
            transition={{
              delay: 0.04 + delay,
              duration,
              ease: "easeOut",
            }}
            className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>
  );
};

export default BlurFade;
