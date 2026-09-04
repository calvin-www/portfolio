import Link from "next/link";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

const PREVIOUS = [
  { label: "v1", href: "/v1" },
  { label: "v2", href: "/v2" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line py-8 font-plex text-xs text-ink-muted">
      <ContactRow />
      <p className="mt-6">
        {COPY.footer.previous}{" "}
        {PREVIOUS.map((p, i) => (
          <span key={p.href}>
            {i > 0 && " · "}
            <Link href={p.href} className="underline decoration-line underline-offset-4 hover:text-teal-ink">
              {p.label}
            </Link>
          </span>
        ))}
      </p>
      <p className="mt-2">{COPY.footer.shark}</p>
    </footer>
  );
}
