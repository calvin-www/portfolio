"use client";

/**
 * The scroll-world timeline.
 *
 * Scroll position is mapped onto an ordered chain of segments — a dive into
 * each scene, a linger while its copy is readable, and a connector that carries
 * the camera on to the next scene. Consumers subscribe to per-frame updates
 * rather than re-rendering: only `activeIndex` goes through React state, so the
 * flight itself costs no reconciliation.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ScrollWorldConfig } from "@/data/adapters/v3";

export type SegmentKind = "dive" | "linger" | "conn";

export interface Segment {
  kind: SegmentKind;
  /** Section index. For a connector this is the section being left. */
  index: number;
  /** Length of the segment in viewport heights. */
  vh: number;
  /** Global progress (0..1) at which this segment starts. */
  start: number;
  end: number;
}

/** How far the camera has flown into a scene, and how visible that scene is. */
export interface SceneFrame {
  camera: number;
  opacity: number;
}

export interface Frame {
  /** Global scroll progress, 0..1. */
  progress: number;
  segment: Segment;
  /** Local progress within the current segment, 0..1. */
  t: number;
  /** Per-section camera/opacity, indexed like config.sections. */
  scenes: SceneFrame[];
  /** Per-section copy opacity, indexed like config.sections. */
  copy: number[];
  /** Section whose copy is currently front-and-centre. */
  active: number;
}

type FrameListener = (frame: Frame) => void;

/** Smoothstep between two edges — used for copy fades and camera easing. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function buildSegments(config: ScrollWorldConfig): Segment[] {
  const out: Omit<Segment, "start" | "end">[] = [];
  config.sections.forEach((s, i) => {
    out.push({ kind: "dive", index: i, vh: config.diveScroll * (s.scroll ?? 1) });
    out.push({ kind: "linger", index: i, vh: s.linger ?? 0.4 });
    if (i < config.sections.length - 1) {
      out.push({ kind: "conn", index: i, vh: config.connScroll });
    }
  });

  const total = out.reduce((sum, seg) => sum + seg.vh, 0);
  let acc = 0;
  return out.map((seg) => {
    const start = acc / total;
    acc += seg.vh;
    return { ...seg, start, end: acc / total };
  });
}

/**
 * Resolve a global progress value into the full per-scene frame state.
 * Exported so tests and the reduced-motion path can reason about the timeline
 * without mounting the scroll listener.
 */
export function frameAt(segments: Segment[], count: number, progress: number): Frame {
  const p = Math.min(1, Math.max(0, progress));
  let segment = segments[segments.length - 1];
  for (const seg of segments) {
    if (p < seg.end || seg === segments[segments.length - 1]) {
      segment = seg;
      break;
    }
  }

  const span = segment.end - segment.start || 1;
  const t = Math.min(1, Math.max(0, (p - segment.start) / span));

  const scenes: SceneFrame[] = Array.from({ length: count }, () => ({
    camera: 0,
    opacity: 0,
  }));
  const copy = new Array<number>(count).fill(0);
  const i = segment.index;

  if (segment.kind === "dive") {
    scenes[i] = { camera: t, opacity: 1 };
    // The opening scene greets on landing — its copy is already up before the
    // first scroll. Every other scene resolves as the camera settles into it.
    copy[i] = i === 0 ? 1 : smoothstep(0.3, 0.62, t);
  } else if (segment.kind === "linger") {
    scenes[i] = { camera: 1, opacity: 1 };
    copy[i] = 1;
  } else {
    // Connector: the camera keeps travelling past the scene it is leaving while
    // the next one rises to meet it, so the seam reads as one continuous move.
    // The fades are deliberately offset rather than symmetric — holding both at
    // half opacity double-exposes two worlds into mush, so the outgoing scene
    // clears out first and the brief dip reads as passing through darkness.
    scenes[i] = { camera: 1 + t * 0.35, opacity: 1 - smoothstep(0.05, 0.5, t) };
    if (i + 1 < count) {
      scenes[i + 1] = { camera: t * 0.18, opacity: smoothstep(0.35, 0.85, t) };
    }
    copy[i] = 1 - smoothstep(0.3, 0.6, t);
  }

  const active = segment.kind === "conn" && t > 0.5 ? Math.min(i + 1, count - 1) : i;
  return { progress: p, segment, t, scenes, copy, active };
}

export function useScrollWorld(config: ScrollWorldConfig, enabled: boolean) {
  const segments = useMemo(() => buildSegments(config), [config]);
  const totalVh = useMemo(
    () => segments.reduce((sum, s) => sum + s.vh, 0),
    [segments]
  );
  const count = config.sections.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const listeners = useRef(new Set<FrameListener>());
  const activeRef = useRef(0);

  const subscribe = useCallback((fn: FrameListener) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    // Smoothed progress trails the raw scroll position, which is what turns a
    // trackpad's jittery deltas into a steady camera move.
    let smoothed = 0;
    let target = 0;
    let running = true;

    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? window.scrollY / max : 0;
    };

    const emit = (frame: Frame) => {
      listeners.current.forEach((fn) => fn(frame));
      if (frame.active !== activeRef.current) {
        activeRef.current = frame.active;
        setActiveIndex(frame.active);
      }
    };

    const tick = () => {
      if (!running) return;
      smoothed += (target - smoothed) * 0.14;
      if (Math.abs(target - smoothed) < 0.00005) smoothed = target;
      emit(frameAt(segments, count, smoothed));
      raf = requestAnimationFrame(tick);
    };

    read();
    smoothed = target;
    emit(frameAt(segments, count, smoothed));
    raf = requestAnimationFrame(tick);

    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [segments, count, enabled]);

  /** Scroll to the point where section `i` is fully arrived (its linger). */
  const jumpTo = useCallback(
    (i: number) => {
      const linger = segments.find((s) => s.kind === "linger" && s.index === i);
      if (!linger) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const mid = linger.start + (linger.end - linger.start) * 0.5;
      window.scrollTo({ top: mid * max, behavior: "smooth" });
    },
    [segments]
  );

  return { segments, totalVh, activeIndex, subscribe, jumpTo };
}
