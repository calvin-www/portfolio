"use client";

import { ENTRIES, filterEntries, findEntry } from "@/data/adapters/v3";
import { COPY } from "@/data/v3-copy";
import { EntryModal } from "./EntryModal";
import { EntryRow } from "./EntryRow";
import { FilterBar } from "./FilterBar";
import { useListParams } from "./useListParams";

export function EntryList() {
  const { filter, item, setFilter, openItem, closeItem } = useListParams();
  const visible = filterEntries(ENTRIES, filter);
  const active = findEntry(ENTRIES, item);

  return (
    <section id="list" className="py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-medium">{COPY.list.heading}</h2>
        <p className="font-plex text-xs text-ink-muted">{COPY.list.hint}</p>
      </div>
      <FilterBar value={filter} onChange={setFilter} />
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">{COPY.list.empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-b border-t border-line">
          {visible.map((entry) => (
            <EntryRow key={entry.slug} entry={entry} onOpen={() => openItem(entry.slug)} />
          ))}
        </ul>
      )}
      {active && <EntryModal entry={active} onClose={closeItem} />}
    </section>
  );
}
