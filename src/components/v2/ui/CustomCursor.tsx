"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/hooks/useCursor";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const { x, y, isHovering, isClicking } = useCursor();
  const [isTouch, setIsTouch] = useState(true);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const checkTouch = () => {
      const isTouchDevice = window.matchMedia("(hover: none)").matches;
      setIsTouch(isTouchDevice);
      
      if (!isTouchDevice) {
        document.body.classList.add("custom-cursor-active");
      }
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    return () => {
      window.removeEventListener("resize", checkTouch);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  const handleClick = useCallback(() => {
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 400);
  }, [x, y]);

  useEffect(() => {
    if (isClicking) {
      handleClick();
    }
  }, [isClicking, handleClick]);

  if (isTouch) {
    return null;
  }

  const dotSize = 8;
  const ringSize = isHovering ? 64 : 24;

  return (
    <>
      <motion.div
        data-testid="custom-cursor"
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: x,
          top: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-ocean-cyan"
          animate={{
            width: dotSize,
            height: dotSize,
            scale: isClicking ? 0.8 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      <motion.div
        data-testid="cursor-ring"
        className="fixed pointer-events-none z-[9998] rounded-full border border-ocean-cyan"
        style={{
          left: x,
          top: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: isHovering ? 0.8 : 0.3,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed pointer-events-none z-[9997] rounded-full border border-ocean-cyan"
            style={{
              left: ripple.x,
              top: ripple.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 100, height: 100, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
