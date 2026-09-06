"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig } from "framer-motion";
import { ENTRIES, filterEntries, findEntry } from "@/data/adapters/v3";
import { COPY } from "@/data/v3-copy";
import { EntryModal } from "./EntryModal";
import { EntryRow } from "./EntryRow";
import { FilterBar } from "./FilterBar";
import { HoverPreview } from "./HoverPreview";
import { useListParams } from "./useListParams";

type Point = { x: number; y: number };

export function EntryList() {
  const { filter, item, setFilter, openItem, closeItem } = useListParams();
  const visible = filterEntries(ENTRIES, filter);
  const active = findEntry(ENTRIES, item);

  const [hovered, setHovered] = useState<{ slug: string; point: Point } | null>(null);
  const hoverEntry = hovered ? findEntry(ENTRIES, hovered.slug) : null;
  const onHover = useCallback((slug: string, point: Point | null) => {
    setHovered(point ? { slug, point } : null);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <section id="list" className="mt-10 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 className="text-v3-xl font-semibold tracking-[-0.01em]">{COPY.list.heading}</h2>
            <p className="text-v3-sm text-ink-muted">{COPY.list.hint}</p>
          </div>
          <FilterBar value={filter} onChange={setFilter} />
          {visible.length === 0 ? (
            <p className="mt-8 text-ink-muted">{COPY.list.empty}</p>
          ) : (
            <ul className="mt-5 divide-y divide-line border-t border-line">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((entry) => (
                  <EntryRow
                    key={entry.slug}
                    entry={entry}
                    onOpen={() => openItem(entry.slug)}
                    onHover={(point) => onHover(entry.slug, point)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
          <HoverPreview entry={active ? null : hoverEntry} point={hovered?.point ?? null} />
          <AnimatePresence initial={false}>
            {active && <EntryModal key={active.slug} entry={active} onClose={closeItem} />}
          </AnimatePresence>
        </section>
      </LayoutGroup>
    </MotionConfig>
  );
}
