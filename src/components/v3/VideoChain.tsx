"use client";

/**
 * The video scrub chain.
 *
 * When generated dive/connector clips are present, scroll drives each clip's
 * `currentTime` instead of a CSS camera. Clips are fetched as blobs so seeking
 * is instant rather than range-requested, neighbours are prefetched one step
 * ahead, and seams hand off between frame-locked clips with a short crossfade.
 *
 * This mirrors the behaviour of the scroll-world skill's `scrub-engine.js`. If
 * you regenerate assets and the skill ships an updated engine, prefer copying
 * its file over editing this one — the shapes are kept compatible on purpose.
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ScrollWorldConfig } from "@/data/adapters/v3";
import { smoothstep, type Frame } from "./useScrollWorld";

/** Fraction of a segment over which the next clip fades in at a seam. */
const SEAM = 0.06;

interface Clip {
  key: string;
  url: string;
  poster?: string;
}

interface VideoChainProps {
  config: ScrollWorldConfig;
  subscribe: (fn: (frame: Frame) => void) => () => void;
  /** Serve the native 9:16 chain instead of the 16:9 one. */
  portrait: boolean;
}

/** Flatten the config into the ordered clip chain: dive, conn, dive, conn, … */
function buildClips(config: ScrollWorldConfig, portrait: boolean): Clip[] {
  const clips: Clip[] = [];
  config.sections.forEach((s, i) => {
    // clipMobile is optional even when a mobile chain exists — fall back to
    // the desktop clip rather than shipping a hole.
    const url = (portrait && s.clipMobile) || s.clip;
    if (url) {
      clips.push({
        key: `dive:${i}`,
        url,
        poster: (portrait && s.stillMobile) || s.still,
      });
    }
  });
  const conns = (portrait && config.connectorsMobile) || config.connectors;
  conns?.forEach((url, i) => {
    if (url) clips.push({ key: `conn:${i}`, url });
  });
  return clips;
}

export function VideoChain({ config, subscribe, portrait }: VideoChainProps) {
  const clips = useMemo(() => buildClips(config, portrait), [config, portrait]);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const objectUrls = useRef<Map<string, string>>(new Map());
  const loading = useRef<Set<string>>(new Set());
  /** Pending seek target per clip, applied once an in-flight seek settles. */
  const pendingSeek = useRef<Map<string, number>>(new Map());

  const order = useMemo(() => clips.map((c) => c.key), [clips]);

  /** Fetch a clip as a blob and attach it, so scrubbing never hits the network. */
  const ensureLoaded = useCallback(
    async (key: string) => {
      if (objectUrls.current.has(key) || loading.current.has(key)) return;
      const clip = clips.find((c) => c.key === key);
      const video = videoRefs.current.get(key);
      if (!clip || !video) return;

      loading.current.add(key);
      try {
        const res = await fetch(clip.url);
        if (!res.ok) throw new Error(`${res.status} ${clip.url}`);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        objectUrls.current.set(key, objectUrl);
        video.src = objectUrl;
        video.load();
      } catch {
        // A missing clip degrades to its poster rather than breaking the chain.
      } finally {
        loading.current.delete(key);
      }
    },
    [clips]
  );

  /** Seek, coalescing requests so touch scrubbing doesn't queue up seeks. */
  const seek = useCallback((key: string, t: number) => {
    const video = videoRefs.current.get(key);
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const target = Math.min(video.duration, Math.max(0, t * video.duration));

    if (video.seeking) {
      pendingSeek.current.set(key, target);
      return;
    }
    if (Math.abs(video.currentTime - target) > 1 / 240) {
      video.currentTime = target;
    }
  }, []);

  // Drain a coalesced seek once the previous one lands.
  useEffect(() => {
    const videos = Array.from(videoRefs.current.entries());
    const handlers = videos.map(([key, video]) => {
      const onSeeked = () => {
        const next = pendingSeek.current.get(key);
        if (next === undefined) return;
        pendingSeek.current.delete(key);
        if (Math.abs(video.currentTime - next) > 1 / 240) video.currentTime = next;
      };
      video.addEventListener("seeked", onSeeked);
      return () => video.removeEventListener("seeked", onSeeked);
    });
    return () => handlers.forEach((off) => off());
  }, [order]);

  // iOS refuses to decode a video that has never been played from a gesture.
  useEffect(() => {
    const prime = () => {
      videoRefs.current.forEach((video) => {
        const p = video.play();
        if (p && typeof p.then === "function") {
          p.then(() => video.pause()).catch(() => {});
        }
      });
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("pointerdown", prime);
    };
    window.addEventListener("touchstart", prime, { once: true, passive: true });
    window.addEventListener("pointerdown", prime, { once: true });
    return () => {
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("pointerdown", prime);
    };
  }, []);

  useEffect(() => {
    const apply = (frame: Frame) => {
      const { segment, t } = frame;
      const activeKey =
        segment.kind === "conn" ? `conn:${segment.index}` : `dive:${segment.index}`;
      const localT = segment.kind === "linger" ? 1 : t;

      const idx = order.indexOf(activeKey);
      const nextKey = idx >= 0 ? order[idx + 1] : undefined;
      // Frame-locked clips can hand over hard, but a short crossfade hides any
      // drift between an encode and its neighbour.
      const blend = nextKey ? smoothstep(1 - SEAM, 1, localT) : 0;

      order.forEach((key) => {
        const video = videoRefs.current.get(key);
        if (!video) return;
        const opacity = key === activeKey ? 1 - blend : key === nextKey ? blend : 0;
        video.style.opacity = String(opacity);
        video.style.visibility = opacity > 0.001 ? "visible" : "hidden";
      });

      seek(activeKey, localT);
      if (nextKey && blend > 0) seek(nextKey, 0);

      // Keep the active clip and its immediate neighbours resident.
      [idx - 1, idx, idx + 1, idx + 2].forEach((i) => {
        const key = order[i];
        if (key) void ensureLoaded(key);
      });
    };

    return subscribe(apply);
  }, [order, subscribe, seek, ensureLoaded]);

  // Release blob URLs on unmount so a route change doesn't leak decoded video.
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {clips.map((clip) => (
        <video
          key={clip.key}
          ref={(el) => {
            if (el) videoRefs.current.set(clip.key, el);
            else videoRefs.current.delete(clip.key);
          }}
          poster={clip.poster}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0,
            visibility: "hidden",
            willChange: "opacity",
          }}
        />
      ))}
    </div>
  );
}
