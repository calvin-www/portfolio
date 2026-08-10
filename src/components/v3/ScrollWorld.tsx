"use client";

/**
 * v3 — "Scroll World"
 * The portfolio as one continuous camera flight: scrolling flies from outside
 * each scene into its interior, then on to the next with no cuts.
 *
 * Three fixed layers sit above a tall scroll spacer — the stage (video chain or
 * procedural CSS dive), the pinned copy, and the route rail. Only the copy layer
 * takes pointer events, and only while its scene is actually on screen.
 *
 * All content comes from resume.json via V3_DATA.
 */

import { useEffect, useRef, useState } from "react";
import { V3_DATA, type ScrollWorldSection } from "@/data/adapters/v3";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsTouch } from "@/hooks/useIsMobile";
import { CssDive } from "./CssDive";
import { VideoChain } from "./VideoChain";
import { useScrollWorld, type Frame } from "./useScrollWorld";

/** Below this width the engine serves the portrait chain, per the skill's spec. */
const PORTRAIT_BREAKPOINT = 860;

type Subscribe = (fn: (frame: Frame) => void) => () => void;

/* ── pinned per-scene copy ────────────────────────────────────────────────── */

function SceneCopy({
  index,
  section,
  subscribe,
  isFirst,
}: {
  index: number;
  section: ScrollWorldSection;
  subscribe: Subscribe;
  isFirst: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    return subscribe((frame) => {
      const el = ref.current;
      if (!el) return;
      const o = frame.copy[index] ?? 0;
      el.style.opacity = String(o);
      el.style.transform = `translate3d(0, ${((1 - o) * 26).toFixed(1)}px, 0)`;
      el.style.visibility = o > 0.001 ? "visible" : "hidden";
      // Only accept clicks once the panel is genuinely readable, otherwise a
      // ghost panel would swallow the pointer.
      el.style.pointerEvents = o > 0.6 ? "auto" : "none";
    });
  }, [index, subscribe]);

  return (
    <section
      ref={ref}
      className="sw-copy"
      aria-label={section.label}
      style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
    >
      <div className="sw-copy__inner" style={{ ["--sw-accent" as string]: section.accent }}>
        <p className="sw-copy__eyebrow">{section.eyebrow}</p>
        <h2 className={isFirst ? "sw-copy__title sw-copy__title--hero" : "sw-copy__title"}>
          {section.title}
        </h2>
        <p className="sw-copy__body">{section.body}</p>

        {section.tags?.length ? (
          <ul className="sw-copy__tags">
            {section.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}

        {section.items?.length ? (
          <ul className="sw-copy__items">
            {section.items.map((item) => {
              const body = (
                <>
                  <span className="sw-item__label">{item.label}</span>
                  {item.meta ? <span className="sw-item__meta">{item.meta}</span> : null}
                  {item.note ? <span className="sw-item__note">{item.note}</span> : null}
                </>
              );
              return (
                <li key={item.label} className="sw-item">
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}

        {section.cta?.length ? (
          <div className="sw-copy__ctas">
            {section.cta.map((cta) => (
              <a
                key={cta.label}
                className={`sw-cta sw-cta--${cta.kind}`}
                href={cta.href}
                target={cta.href.startsWith("http") ? "_blank" : undefined}
                rel={cta.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {cta.label}
              </a>
            ))}
          </div>
        ) : null}

        {isFirst ? <p className="sw-copy__hint">Scroll to fly through</p> : null}
      </div>
    </section>
  );
}

/* ── reduced-motion fallback ──────────────────────────────────────────────── */

/**
 * `prefers-reduced-motion` gets the same content as a plain stacked document:
 * each scene held at a fixed camera position, no scroll-driven movement.
 */
function StaticWorld({ sections }: { sections: ScrollWorldSection[] }) {
  const noop: Subscribe = () => () => {};
  return (
    <div className="sw-static">
      {sections.map((section, i) => (
        <section
          key={section.id}
          id={`scene-${section.id}`}
          className="sw-static__scene"
          style={{ ["--sw-accent" as string]: section.accent }}
        >
          <div className="sw-static__art" aria-hidden>
            <CssDive index={i} section={section} subscribe={noop} staticCamera={0.72} />
          </div>
          <div className="sw-copy__inner sw-static__copy">
            <p className="sw-copy__eyebrow">{section.eyebrow}</p>
            <h2 className="sw-copy__title">{section.title}</h2>
            <p className="sw-copy__body">{section.body}</p>
            {section.items?.length ? (
              <ul className="sw-copy__items">
                {section.items.map((item) => (
                  <li key={item.label} className="sw-item">
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        <span className="sw-item__label">{item.label}</span>
                        {item.meta ? <span className="sw-item__meta">{item.meta}</span> : null}
                        {item.note ? <span className="sw-item__note">{item.note}</span> : null}
                      </a>
                    ) : (
                      <>
                        <span className="sw-item__label">{item.label}</span>
                        {item.meta ? <span className="sw-item__meta">{item.meta}</span> : null}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.cta?.length ? (
              <div className="sw-copy__ctas">
                {section.cta.map((cta) => (
                  <a key={cta.label} className={`sw-cta sw-cta--${cta.kind}`} href={cta.href}>
                    {cta.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ── root ─────────────────────────────────────────────────────────────────── */

export function ScrollWorld() {
  const config = V3_DATA;
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const [portrait, setPortrait] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setPortrait(window.innerWidth <= PORTRAIT_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const enabled = mounted && !reduced;
  const { totalVh, activeIndex, subscribe, jumpTo } = useScrollWorld(config, enabled);

  // A dive clip on the first section is the signal that assets were generated.
  const hasVideo = config.sections.some((s) => s.clip);
  const usePortraitChain = portrait || isTouch;

  // The tall document body is what the fixed layers are scrubbed against; it
  // must not linger once we switch to the reduced-motion document.
  const showFlight = enabled;

  if (mounted && reduced) {
    return (
      <div className="sw-root sw-root--static">
        <StaticWorld sections={config.sections} />
      </div>
    );
  }

  return (
    <div className="sw-root">
      <header className="sw-topbar">
        <a className="sw-brand" href="#scene-arrival">
          <span className="sw-brand__mark">{config.brand.initials}</span>
          <span className="sw-brand__name">{config.brand.name}</span>
        </a>
        <nav className="sw-topnav" aria-label="Scenes">
          {config.sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpTo(i)}
              aria-current={i === activeIndex ? "true" : undefined}
              className={i === activeIndex ? "is-active" : undefined}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="sw-stage" aria-hidden>
        {showFlight && hasVideo ? (
          <VideoChain config={config} subscribe={subscribe} portrait={usePortraitChain} />
        ) : (
          config.sections.map((section, i) => (
            <CssDive key={section.id} index={i} section={section} subscribe={subscribe} />
          ))
        )}
      </div>

      <div className="sw-copylayer">
        {config.sections.map((section, i) => (
          <SceneCopy
            key={section.id}
            index={i}
            section={section}
            subscribe={subscribe}
            isFirst={i === 0}
          />
        ))}
      </div>

      <nav className="sw-rail" aria-label="Jump to scene">
        {config.sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={i === activeIndex ? "sw-rail__dot is-active" : "sw-rail__dot"}
            style={{ ["--sw-accent" as string]: s.accent }}
            onClick={() => jumpTo(i)}
            aria-current={i === activeIndex ? "true" : undefined}
          >
            {/* The bead scales, not the button — scaling the button would drag
                its absolutely-positioned label out of alignment. */}
            <span className="sw-rail__bead" />
            <span className="sw-rail__label">{s.label}</span>
          </button>
        ))}
      </nav>

      {/* The scroll length the fixed layers are scrubbed against. */}
      <div className="sw-spacer" style={{ height: `${totalVh * 100}vh` }} aria-hidden />
    </div>
  );
}
