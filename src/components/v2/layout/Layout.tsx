"use client";

import { useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      autoRaf: false, // Let GSAP control RAF
    });

    // Notify ScrollTrigger when Lenis scrolls
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis RAF
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

    // Disable lag smoothing for smooth scrub animations
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navigation />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
