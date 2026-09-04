"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Filter } from "@/data/adapters/v3";
import { buildListHref, parseListParams } from "@/lib/v3-url";

export function useListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filter, item } = parseListParams(searchParams);

  const setFilter = useCallback(
    (next: Filter) => {
      router.replace(buildListHref(pathname, searchParams, { filter: next }), { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const openItem = useCallback(
    (slug: string) => {
      router.push(buildListHref(pathname, searchParams, { item: slug }), { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const closeItem = useCallback(() => {
    router.replace(buildListHref(pathname, searchParams, { item: null }), { scroll: false });
  }, [router, pathname, searchParams]);

  return { filter, item, setFilter, openItem, closeItem };
}
