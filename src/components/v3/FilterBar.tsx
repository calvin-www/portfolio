import { FILTERS, type Filter } from "@/data/adapters/v3";
import { cn } from "@/lib/utils";

export function FilterBar({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div role="group" aria-label="filter" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-plex text-xs">
      {FILTERS.map((f) => {
        const active = f === value;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f)}
            className={cn(
              "border-b-2 pb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm",
              active ? "border-teal text-ink" : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
