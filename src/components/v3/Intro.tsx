import { DATA } from "@/data";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

export function Intro() {
  return (
    <section className="pb-8 pt-8 sm:pt-12">
      <p className="font-plex text-xs text-ink-muted">{DATA.name.toLowerCase()}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{COPY.headline}</h1>
      <div className="mt-5 max-w-prose space-y-2 text-base leading-relaxed text-ink-muted">
        {COPY.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <ContactRow className="mt-6" />
    </section>
  );
}
