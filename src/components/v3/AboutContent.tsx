import Image from "next/image";
import { DATA } from "@/data";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

export function AboutContent() {
  return (
    <article className="pb-8 pt-8 sm:pt-12">
      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-prose">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{COPY.about.heading}</h1>
          <div className="mt-5 space-y-3 text-base leading-relaxed text-ink-muted">
            {COPY.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface sm:size-36">
          <Image src={DATA.avatarUrl} alt={`photo of ${DATA.name}`} fill sizes="144px" className="object-cover" priority />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-plex text-xs text-ink-muted">{COPY.about.educationHeading}</h2>
        <ul className="mt-3 divide-y divide-line border-b border-t border-line">
          {DATA.education.map((edu) => (
            <li key={edu.school} className="flex items-start gap-3 py-4">
              <Image src={edu.logoUrl} alt="" width={32} height={32} className="size-8 rounded-md object-contain" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <a
                    href={edu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium transition-colors hover:text-teal-ink"
                  >
                    {edu.school}
                  </a>
                  <span className="font-plex text-xs text-ink-muted">
                    {edu.start} – {edu.end}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{edu.degree}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-ink-muted">{COPY.about.shark}</p>
      <ContactRow className="mt-6" />
    </article>
  );
}
