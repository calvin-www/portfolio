import Link from "next/link";
import { COPY } from "@/data/v3-copy";
import { ContactRow } from "./ContactRow";

const PREVIOUS = [
  { label: "v1", href: "/v1" },
  { label: "v2", href: "/v2" },
];

export function Footer() {
  return (
    <footer className="relative z-[1] mt-20 border-t border-line py-10 text-v3-sm text-ink-muted">
      <ContactRow />
      <p className="mt-8">
        {COPY.footer.previous}{" "}
        {PREVIOUS.map((p, i) => (
          <span key={p.href}>
            {i > 0 && ", "}
            <Link href={p.href} className="v3-link text-ink">
              {p.label}
            </Link>
          </span>
        ))}
      </p>
      <p className="mt-2">{COPY.footer.shark}</p>
    </footer>
  );
}
