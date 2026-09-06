"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Skill } from "@/data/adapters/v3-skills";
import { cn } from "@/lib/utils";

const HOVER_FACTOR = 0.2;
const CLICK_SLOP_PX = 6;
/** How quickly a fling's extra velocity decays back to the base scroll (per second). */
const FLING_DECAY = 2.2;
/** How quickly the base velocity eases when hovering starts or stops (per second). */
const EASE = 6;

type Props = {
  skills: Skill[];
  /** Base speed in px/s. Positive moves right, negative moves left. */
  speed: number;
  selected: string | null;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
};

/**
 * One continuously scrolling row. The list is rendered twice and the offset
 * wraps at the width of one copy, so the loop never shows a seam. A rAF loop
 * writes the transform directly; React only re-renders on selection change.
 *
 * Hover eases the row to a fraction of its speed. Dragging scrubs it 1:1;
 * letting go with speed adds momentum that decays back to the base scroll.
 * A press that barely moves is a click and selects the skill.
 */
export function MarqueeRow({ skills, speed, selected, onSelect, reducedMotion }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);
  const state = useRef({
    offset: 0,
    velocity: speed,
    extra: 0,
    hovering: false,
    focused: false,
    dragging: false,
    dragLastX: 0,
    dragLastT: 0,
    dragVelocity: 0,
    dragDistance: 0,
    pointerId: -1,
  });

  // Measure one copy of the list; re-measure on resize or font load.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return;
    const measure = () => setCopyWidth(first.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(first);
    return () => ro.disconnect();
  }, [skills]);

  // The animation loop.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || copyWidth === 0) return;
    const st = state.current;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!st.dragging) {
        const slow = st.hovering || st.focused;
        const base = reducedMotion ? 0 : speed * (slow ? HOVER_FACTOR : 1);
        st.velocity += (base - st.velocity) * Math.min(1, EASE * dt);
        st.extra *= Math.exp(-FLING_DECAY * dt);
        if (Math.abs(st.extra) < 1) st.extra = 0;
        st.offset += (st.velocity + st.extra) * dt;
      }
      // Wrap into (-copyWidth, 0].
      st.offset = ((st.offset % copyWidth) - copyWidth) % copyWidth;
      track.style.transform = `translate3d(${st.offset.toFixed(2)}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [copyWidth, speed, reducedMotion]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const st = state.current;
    st.dragging = true;
    st.dragLastX = e.clientX;
    st.dragLastT = performance.now();
    st.dragVelocity = 0;
    st.dragDistance = 0;
    st.extra = 0;
    st.pointerId = e.pointerId;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = state.current;
    if (!st.dragging || e.pointerId !== st.pointerId) return;
    const now = performance.now();
    const dx = e.clientX - st.dragLastX;
    const dt = Math.max(1, now - st.dragLastT) / 1000;
    st.dragDistance += Math.abs(dx);
    if (st.dragDistance > CLICK_SLOP_PX) e.currentTarget.setPointerCapture(e.pointerId);
    st.offset += dx;
    st.dragVelocity = dx / dt;
    st.dragLastX = e.clientX;
    st.dragLastT = now;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = state.current;
    if (!st.dragging || e.pointerId !== st.pointerId) return;
    st.dragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    // A fling keeps the release velocity as momentum on top of the base scroll.
    if (st.dragDistance > CLICK_SLOP_PX && performance.now() - st.dragLastT < 80) {
      st.extra = Math.max(-4000, Math.min(4000, st.dragVelocity - st.velocity));
    }
  };

  const onSkillClick = (id: string) => {
    // Ignore the click that ends a drag.
    if (state.current.dragDistance > CLICK_SLOP_PX) return;
    onSelect(id);
  };

  const copies = [0, 1];
  return (
    <div
      className="v3-marquee-row"
      data-testid="skill-row"
      onPointerEnter={() => (state.current.hovering = true)}
      onPointerLeave={() => (state.current.hovering = false)}
      onFocusCapture={() => (state.current.focused = true)}
      onBlurCapture={() => (state.current.focused = false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className="v3-marquee-track">
        {copies.map((copy) => (
          <ul key={copy} className="v3-marquee-list" aria-hidden={copy === 1 || undefined}>
            {skills.map((skill) => {
              const isSelected = selected === skill.id;
              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    tabIndex={copy === 1 ? -1 : undefined}
                    aria-pressed={copy === 0 ? isSelected : undefined}
                    data-skill={skill.id}
                    onClick={() => onSkillClick(skill.id)}
                    className={cn(
                      "v3-skill",
                      selected && !isSelected && "is-dimmed",
                      isSelected && "is-selected",
                    )}
                  >
                    {skill.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}
