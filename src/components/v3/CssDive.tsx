"use client";

/**
 * The assetless renderer.
 *
 * Until the scroll-world skill has generated real dive clips, each scene is a
 * stack of procedural SVG layers sitting at different depths in a CSS 3D scene.
 * Scroll pushes the camera forward through the stack: near layers blow up and
 * fade past you, far ones rise out of the haze. It is the same "fly into the
 * scene" grammar as the video chain, with no assets and no cost.
 *
 * Layer composition is seeded from the scene id, so the markup is identical on
 * the server and the client — the flight is deterministic, not random.
 */

import { useEffect, useMemo, useRef } from "react";
import type { ScrollWorldSection, SceneMood } from "@/data/adapters/v3";
import { smoothstep, type Frame } from "./useScrollWorld";

const LAYERS = 7;
const PERSPECTIVE = 900;
const GAP = 420;
const TRAVEL = GAP * 5.5;

/* ── deterministic randomness ─────────────────────────────────────────────── */

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;
const between = (rng: Rng, lo: number, hi: number) => lo + rng() * (hi - lo);

/* ── per-mood layer vocabulary ────────────────────────────────────────────── */

/**
 * Each mood draws one layer's worth of geometry into a 1000×1000 viewBox.
 * `depth` runs 0 (nearest) to LAYERS-1 (farthest) so compositions can thin out
 * with distance.
 */
type MoodPainter = (rng: Rng, depth: number, accent: string) => JSX.Element[];

const PAINTERS: Record<SceneMood, MoodPainter> = {
  // Open sky over a flat horizon — a low sun and thin strata, kept sparse so
  // seven stacked layers read as depth rather than as one solid wall.
  horizon: (rng, depth, accent) => {
    const out: JSX.Element[] = [];
    const y = 520 + depth * 42;
    if (depth === LAYERS - 1) {
      out.push(<circle key="sun" cx={500} cy={430} r={150} fill={accent} opacity={0.28} />);
    }
    out.push(
      <rect key="strata" x={-100} y={y} width={1200} height={3} fill={accent} opacity={0.42} />
    );
    for (let i = 0; i < 2; i++) {
      out.push(
        <rect
          key={`bar${i}`}
          x={between(rng, -60, 780)}
          y={y - between(rng, 14, 64)}
          width={between(rng, 90, 260)}
          height={between(rng, 2, 5)}
          fill={accent}
          opacity={0.3}
        />
      );
    }
    return out;
  },

  // A colonnade: paired columns receding into the room.
  hall: (rng, depth, accent) => {
    const out: JSX.Element[] = [];
    const inset = 90 + depth * 46;
    const top = 200 + depth * 18;
    const h = 640 - depth * 26;
    [inset, 1000 - inset - 74].forEach((x, i) => {
      out.push(
        <rect key={`col${i}`} x={x} y={top} width={74} height={h} rx={6} fill={accent} opacity={0.2} />
      );
      out.push(
        <rect key={`cap${i}`} x={x - 14} y={top - 26} width={102} height={26} rx={4} fill={accent} opacity={0.3} />
      );
    });
    out.push(
      <rect key="lintel" x={inset - 20} y={top - 58} width={1000 - 2 * inset + 40} height={26} fill={accent} opacity={0.25} />
    );
    if (depth % 2 === 0) {
      out.push(
        <rect key="floor" x={0} y={top + h} width={1000} height={8} fill={accent} opacity={0.18} />
      );
    }
    return out;
  },

  // Concentric rings and laurel chevrons — a stadium, a wreath.
  arena: (rng, depth, accent) => {
    const out: JSX.Element[] = [];
    const r = 150 + depth * 78;
    out.push(
      <circle key="ring" cx={500} cy={500} r={r} fill="none" stroke={accent} strokeWidth={10} opacity={0.28} />
    );
    const spokes = 8;
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2 + depth * 0.16;
      const x = 500 + Math.cos(a) * r;
      const y = 500 + Math.sin(a) * r;
      out.push(
        <circle key={`s${i}`} cx={x} cy={y} r={between(rng, 8, 20)} fill={accent} opacity={0.34} />
      );
    }
    return out;
  },

  // A skyline of towers, denser and shorter as it recedes.
  tower: (rng, depth, accent) => {
    const out: JSX.Element[] = [];
    const baseY = 880 - depth * 8;
    const n = 4 + depth;
    for (let i = 0; i < n; i++) {
      const w = between(rng, 60, 150);
      const h = between(rng, 180, 620 - depth * 40);
      const x = (i / n) * 1000 + between(rng, -30, 30);
      out.push(
        <rect key={`t${i}`} x={x} y={baseY - h} width={w} height={h} fill={accent} opacity={0.16 + depth * 0.01} />
      );
      for (let wy = baseY - h + 24; wy < baseY - 20; wy += 46) {
        out.push(
          <rect key={`w${i}-${wy}`} x={x + 12} y={wy} width={w - 24} height={12} fill={accent} opacity={0.3} />
        );
      }
    }
    return out;
  },

  // A regular lattice of tiles — the project grid.
  grid: (_rng, depth, accent) => {
    const out: JSX.Element[] = [];
    const cells = 3 + (depth % 3);
    const pad = 60;
    const size = (1000 - pad * 2) / cells;
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const skip = (r + c + depth) % 4 === 0;
        if (skip) continue;
        out.push(
          <rect
            key={`c${r}-${c}`}
            x={pad + c * size + 10}
            y={pad + r * size + 10}
            width={size - 20}
            height={size - 20}
            rx={12}
            fill="none"
            stroke={accent}
            strokeWidth={6}
            opacity={0.26}
          />
        );
      }
    }
    return out;
  },

  // Diagonal streaks — motion, deadline, weekend.
  sprint: (rng, depth, accent) => {
    const out: JSX.Element[] = [];
    for (let i = 0; i < 6 - Math.floor(depth / 2); i++) {
      const y = between(rng, 60, 940);
      const len = between(rng, 200, 560);
      const x = between(rng, -80, 700);
      out.push(
        <path
          key={`k${i}`}
          d={`M ${x} ${y} L ${x + len} ${y - len * 0.32}`}
          stroke={accent}
          strokeWidth={between(rng, 6, 16)}
          strokeLinecap="round"
          opacity={0.28}
          fill="none"
        />
      );
    }
    return out;
  },

  // Concentric arcs radiating from a point — a transmission.
  signal: (_rng, depth, accent) => {
    const out: JSX.Element[] = [];
    const r = 120 + depth * 90;
    out.push(
      <circle key="a" cx={500} cy={520} r={r} fill="none" stroke={accent} strokeWidth={8} opacity={0.24} strokeDasharray="34 26" />
    );
    if (depth === 0) {
      out.push(<circle key="core" cx={500} cy={520} r={46} fill={accent} opacity={0.5} />);
    }
    return out;
  },
};

/* ── geometry ─────────────────────────────────────────────────────────────── */

function layerZ(depth: number, camera: number): number {
  return -(depth + 1) * GAP + camera * TRAVEL;
}

function layerOpacity(z: number): number {
  // Fade out as a layer sweeps past the camera, and in as it emerges from haze.
  // The near fade starts before the layer reaches the camera plane, otherwise
  // the closest layers blow up to full opacity and flood the frame.
  const passing = 1 - smoothstep(-GAP * 0.7, PERSPECTIVE * 0.45, z);
  const emerging = smoothstep(-(LAYERS + 0.6) * GAP, -(LAYERS - 1.2) * GAP, z);
  return Math.max(0, Math.min(1, passing * emerging));
}

/* ── component ────────────────────────────────────────────────────────────── */

interface CssDiveProps {
  index: number;
  section: ScrollWorldSection;
  subscribe: (fn: (frame: Frame) => void) => () => void;
  /** Render a single static frame instead of subscribing (reduced motion). */
  staticCamera?: number;
}

export function CssDive({ index, section, subscribe, staticCamera }: CssDiveProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const layers = useMemo(() => {
    const paint = PAINTERS[section.mood];
    return Array.from({ length: LAYERS }, (_, depth) => {
      const rng = mulberry32(hashString(`${section.id}:${depth}`));
      return paint(rng, depth, section.accent);
    });
  }, [section.id, section.mood, section.accent]);

  useEffect(() => {
    if (staticCamera !== undefined) return;

    const apply = (frame: Frame) => {
      const scene = frame.scenes[index];
      const root = rootRef.current;
      if (!root || !scene) return;

      if (scene.opacity <= 0.001) {
        if (root.style.visibility !== "hidden") {
          root.style.visibility = "hidden";
          root.style.opacity = "0";
        }
        return;
      }
      root.style.visibility = "visible";
      root.style.opacity = String(scene.opacity);

      for (let d = 0; d < LAYERS; d++) {
        const el = layerRefs.current[d];
        if (!el) continue;
        const z = layerZ(d, scene.camera);
        const o = layerOpacity(z);
        if (o <= 0.001 || z > PERSPECTIVE * 0.72) {
          el.style.opacity = "0";
          continue;
        }
        el.style.opacity = String(o);
        el.style.transform = `translate3d(-50%, -50%, ${z.toFixed(1)}px)`;
      }
    };

    return subscribe(apply);
  }, [index, subscribe, staticCamera]);

  const isStatic = staticCamera !== undefined;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="sw-scene"
      style={{
        position: "absolute",
        inset: 0,
        perspective: `${PERSPECTIVE}px`,
        opacity: isStatic ? 1 : 0,
        visibility: isStatic ? "visible" : "hidden",
        background: `radial-gradient(120% 90% at 50% 45%, ${section.accent}1f 0%, transparent 62%)`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
        {layers.map((glyphs, depth) => {
          const z = layerZ(depth, staticCamera ?? 0);
          return (
            <div
              key={depth}
              ref={(el) => {
                layerRefs.current[depth] = el;
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "150vmax",
                height: "150vmax",
                transform: `translate3d(-50%, -50%, ${z}px)`,
                opacity: isStatic ? layerOpacity(z) : 0,
                willChange: "transform, opacity",
              }}
            >
              <svg
                viewBox="0 0 1000 1000"
                preserveAspectRatio="xMidYMid slice"
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                {glyphs}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
