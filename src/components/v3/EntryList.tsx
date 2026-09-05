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
          {visible.map((entry) => (
            <EntryRow key={entry.slug} entry={entry} onOpen={() => openItem(entry.slug)} />
          ))}
        </ul>
      )}
      {active && <EntryModal entry={active} onClose={closeItem} />}
    </section>
  );
}
