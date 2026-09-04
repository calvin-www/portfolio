"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Entry } from "@/data/adapters/v3";

export function EntryModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center sm:justify-center sm:p-6">
      <button
        type="button"
        aria-label="close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-title"
        className="relative flex h-full w-full flex-col overflow-y-auto bg-paper p-6 text-ink outline-none sm:h-auto sm:max-h-[85vh] sm:max-w-xl sm:rounded-2xl sm:border sm:border-line sm:p-8 sm:shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute right-5 top-5 rounded-sm font-plex text-xs text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          esc ✕
        </button>

        <header className="flex items-start gap-3 pr-16">
          {entry.logo ? (
            <Image src={entry.logo} alt="" width={40} height={40} className="size-10 rounded-md object-contain" />
          ) : (
            <span aria-hidden className="text-3xl leading-none">{entry.emoji}</span>
          )}
          <div className="min-w-0">
            <h2 id="entry-title" className="text-xl font-semibold leading-tight">{entry.title}</h2>
            <p className="mt-1 font-plex text-xs text-ink-muted">
              {entry.type} · {entry.dateLabel}
              {entry.location ? ` · ${entry.location}` : ""}
            </p>
          </div>
        </header>

        {entry.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-surface px-2 py-0.5 font-plex text-[11px] text-ink-muted">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 space-y-3 text-sm leading-relaxed text-ink-muted">
          {entry.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {entry.links.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-plex text-xs">
            {entry.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-ink underline decoration-line underline-offset-4 hover:decoration-teal"
                >
                  {l.type.toLowerCase()} ↗
                </a>
              </li>
            ))}
          </ul>
        )}

        {entry.video ? (
          <video src={entry.video} controls muted playsInline className="mt-6 w-full rounded-lg border border-line" />
        ) : entry.image ? (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg border border-line bg-surface">
            <Image
              src={entry.image}
              alt={`${entry.title} screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, 576px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
