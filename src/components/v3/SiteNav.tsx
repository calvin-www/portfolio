"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DATA } from "@/data";
import { ThemeToggle } from "./ThemeToggle";
import { Shark } from "./Shark";

/**
 * The nav sits wherever the page puts it and sticks to the top from there.
 * A sentinel just above it tells us when it has caught the top of the
 * viewport, so the hairline and tinted bar only appear once stuck.
 */
export function SiteNav() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    // The root extends far below the viewport, so the sentinel only stops
    // intersecting when it crosses the top edge. That makes the flip fire
    // even for instant jumps that skip straight past it.
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      rootMargin: "0px 0px 100000px 0px",
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px w-full" />
      <nav data-stuck={stuck} className="v3-nav sticky top-0 z-30 -mx-5 px-5 sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between py-5 text-v3-sm">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold transition-colors hover:text-teal-ink">
            <Shark className="h-4 w-auto" />
            {DATA.name.toLowerCase()}
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-ink-muted transition-colors hover:text-ink">
              about
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
