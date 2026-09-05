import type { Entry } from "@/data/adapters/v3";

export function EntryRow({ entry, onOpen }: { entry: Entry; onOpen: () => void }) {
  return (
    <li>
      <button
        type="button"
        data-testid="entry-row"
        data-type={entry.type}
        onClick={onOpen}
        className="group -mx-2 flex w-full items-start gap-3 rounded-md px-2 py-4 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-ink"
      >
        <span aria-hidden className="pt-0.5 text-xl leading-none">{entry.emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-medium transition-colors group-hover:text-teal-ink">{entry.title}</span>
            <span className="font-plex text-xs text-ink-muted">{entry.dateLabel}</span>
          </span>
          <span className="mt-1 block text-sm text-ink-muted">{entry.tagline}</span>
        </span>
        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 font-plex text-[11px] text-ink-muted">
          {entry.type}
        </span>
      </button>
    </li>
  );
}
