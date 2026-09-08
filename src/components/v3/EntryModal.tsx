"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Entry } from "@/data/adapters/v3";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const SHEET_QUERY = "(max-width: 639px)";

/** True below the sm breakpoint, where the dialog is a bottom sheet. False during SSR. */
function useIsSheet() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(SHEET_QUERY);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(SHEET_QUERY).matches,
    () => false,
  );
}

const PANEL = {
  card: {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    shown: { opacity: 1, scale: 1, y: 0 },
  },
  sheet: {
    hidden: { opacity: 1, y: "100%" },
    shown: { opacity: 1, y: 0 },
  },
} as const;

export function EntryModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const sheet = useIsSheet();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const meta = [entry.type, entry.dateLabel, entry.location].filter(Boolean).join(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center sm:justify-center sm:p-6">
      <motion.button
        type="button"
        aria-label="close dialog"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <motion.div
        ref={panelRef}
        variants={sheet ? PANEL.sheet : PANEL.card}
        initial="hidden"
        animate="shown"
        exit="hidden"
        transition={sheet ? { type: "spring", stiffness: 380, damping: 38 } : { type: "spring", stiffness: 420, damping: 34 }}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-title"
        className="relative flex h-full w-full flex-col overflow-y-auto bg-paper px-6 py-7 text-ink outline-none sm:h-auto sm:max-h-[85vh] sm:max-w-xl sm:rounded-xl sm:border sm:border-line sm:px-9 sm:py-8 sm:shadow-[0_24px_64px_-24px_rgba(32,28,21,0.45)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute right-6 top-6 text-v3-sm text-ink-muted transition-colors hover:text-ink sm:right-8 sm:top-7"
        >
          close
        </button>

        <header className="flex items-start gap-4 pr-16">
          {entry.logo ? (
            <Image src={entry.logo} alt="" width={44} height={44} className="size-11 rounded-md object-contain" />
          ) : (
            <span aria-hidden className="w-11 text-center text-[2.25rem] leading-[2.75rem]">
              {entry.emoji}
            </span>
          )}
          <div className="min-w-0 pt-1">
            <motion.h2
              id="entry-title"
              layoutId={`entry-title-${entry.slug}`}
              className="text-v3-xl font-semibold tracking-[-0.01em]"
            >
              {entry.title}
            </motion.h2>
            <p className="mt-1 text-v3-xs text-ink-muted">{meta}</p>
          </div>
        </header>

        {entry.tags.length > 0 && <p className="mt-5 text-v3-sm text-ink-muted">{entry.tags.join(", ")}</p>}

        <div className="mt-5 space-y-3 text-ink-muted">
          {entry.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {entry.links.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-v3-sm">
            {entry.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="v3-link text-ink">
                  {l.type.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        )}

        {entry.video ? (
          <video src={entry.video} controls muted playsInline className="mt-7 w-full rounded-lg border border-line" />
        ) : entry.image ? (
          <div className="relative mt-7 aspect-video w-full overflow-hidden rounded-lg border border-line bg-surface">
            <Image
              src={entry.image}
              alt={`${entry.title} screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, 576px"
              className="object-cover"
            />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
