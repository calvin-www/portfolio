import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";
import { HeroShark } from "./HeroShark";

const FACE = " :D";

/**
 * Splits the headline so the emoticon can be rotated to face the reader.
 * The rotation is visual only; the text content stays "i like 2 build stuff :D".
 */
function Headline({ text }: { text: string }) {
  if (!text.endsWith(FACE)) return <>{text}</>;
  const words = text.slice(0, -FACE.length);
  return (
    <>
      {words}{" "}
      <span className="v3-face">
        <span className="v3-face-eyes">:</span>D
      </span>
    </>
  );
}

export function Intro() {
  return (
    <section className="pb-10 pt-6 sm:pt-10">
      <HeroShark />
      <h1 className="v3-display mt-4 text-[clamp(2.75rem,8vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.02em]">
        <Headline text={COPY.headline} />
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
