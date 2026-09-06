import Image from "next/image";
import { DATA } from "@/data";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

export function AboutContent() {
  return (
    <article className="pb-8 pt-10 sm:pt-16">
      <div className="flex flex-col-reverse gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[60ch]">
          <h1 className="v3-display text-[clamp(2.25rem,6vw,3.25rem)] font-bold leading-[0.98] tracking-[-0.02em]">
            {COPY.about.heading}
          </h1>
          <div className="mt-6 space-y-3 text-ink-muted">
            {COPY.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-surface sm:size-36">
          <Image src={DATA.avatarUrl} alt={`photo of ${DATA.name}`} fill sizes="144px" className="object-cover" priority />
        </div>
      </div>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-v3-xl font-semibold tracking-[-0.01em]">{COPY.about.educationHeading}</h2>
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {DATA.education.map((edu) => (
            <li key={edu.school} className="flex items-start gap-4 py-4">
              <Image src={edu.logoUrl} alt="" width={28} height={28} className="mt-0.5 size-7 rounded-md object-contain" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <a href={edu.href} target="_blank" rel="noopener noreferrer" className="v3-link font-semibold">
                    {edu.school}
                  </a>
                  <span className="text-v3-xs text-ink-muted">
                    {edu.start} – {edu.end}
                  </span>
                </div>
                <p className="mt-0.5 text-v3-sm text-ink-muted">{edu.degree}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-v3-xl font-semibold tracking-[-0.01em]">{COPY.about.skillsHeading}</h2>
        <p className="mt-4 max-w-[60ch] text-ink-muted">{DATA.skills.map((s) => s.name).join(", ")}</p>
      </section>

      <p className="mt-10 text-v3-sm text-ink-muted">{COPY.about.shark}</p>
      <ContactRow className="mt-6" />
    </article>
  );
}
