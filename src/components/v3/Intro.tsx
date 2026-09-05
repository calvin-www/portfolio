import { DATA } from "@/data";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

export function Intro() {
  return (
    <section className="pb-10 pt-10 sm:pt-16">
      <p className="text-v3-sm text-ink-muted">{DATA.name.toLowerCase()}</p>
      <h1 className="v3-display mt-3 text-[clamp(2.75rem,8vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.02em]">
        {COPY.headline}
      </h1>
      <div className="mt-7 max-w-[60ch] space-y-3 text-ink-muted">
        {COPY.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <ContactRow className="mt-8" />
    </section>
  );
}
