import type { Entry } from "@/data/adapters/v3";

export function EntryRow({ entry, onOpen }: { entry: Entry; onOpen: () => void }) {
  return (
    <li>
      <button
        type="button"
        data-testid="entry-row"
        data-type={entry.type}
        onClick={onOpen}
        className="group -mx-3 flex w-[calc(100%+1.5rem)] items-start gap-4 rounded-lg px-3 py-4 text-left transition-colors hover:bg-surface"
      >
        <span aria-hidden className="w-7 shrink-0 text-center text-xl leading-7">
          {entry.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="font-semibold transition-colors group-hover:text-teal-ink">{entry.title}</span>
            <span className="text-v3-xs text-ink-muted">{entry.dateLabel}</span>
          </span>
          <span className="mt-0.5 block text-v3-sm text-ink-muted">{entry.tagline}</span>
        </span>
        <span className="shrink-0 pt-1 text-v3-xs text-ink-muted">{entry.type}</span>
      </button>
    </li>
  );
}
