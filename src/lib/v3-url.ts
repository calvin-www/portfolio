/**
 * Pure helpers for the v3 list's URL state: ?filter= and ?item=.
 * Kept free of next/navigation so it can be unit tested with bun.
 */
import { isFilter, type Filter } from "@/data/adapters/v3";

export interface ListParams {
  filter: Filter;
  item: string | null;
}

export function parseListParams(sp: URLSearchParams): ListParams {
  const filter = sp.get("filter");
  const item = sp.get("item");
  return { filter: isFilter(filter) ? filter : "all", item: item ? item : null };
}

export function buildListHref(
  pathname: string,
  sp: URLSearchParams,
  patch: Partial<ListParams>,
): string {
  const next = new URLSearchParams(sp.toString());
  if ("filter" in patch) {
    if (patch.filter && patch.filter !== "all") next.set("filter", patch.filter);
    else next.delete("filter");
  }
  if ("item" in patch) {
    if (patch.item) next.set("item", patch.item);
    else next.delete("item");
  }
  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}
