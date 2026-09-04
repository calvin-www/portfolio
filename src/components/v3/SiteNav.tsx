import Link from "next/link";
import { DATA } from "@/data";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav() {
  return (
    <nav className="flex items-center justify-between py-6 text-sm">
      <Link
        href="/"
        className="font-medium transition-colors hover:text-teal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
      >
        🦈 {DATA.name.toLowerCase()}
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/about"
          className="text-ink-muted transition-colors hover:text-teal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
        >
          about
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
