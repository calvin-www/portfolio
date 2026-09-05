import { FILTERS, type Filter } from "@/data/adapters/v3";
import { cn } from "@/lib/utils";

export function FilterBar({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div role="group" aria-label="filter" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-v3-sm">
      {FILTERS.map((f) => {
        const active = f === value;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f)}
            className={cn(
              "border-b-2 pb-1 transition-colors",
              active ? "border-teal font-medium text-ink" : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
