import Link from "next/link";
import { DATA } from "@/data";
import { ThemeToggle } from "./ThemeToggle";
import { Shark } from "./Shark";

export function SiteNav() {
  return (
    <nav className="flex items-center justify-between py-7 text-v3-sm">
      <Link href="/" className="inline-flex items-center gap-2 font-semibold transition-colors hover:text-teal-ink">
        <Shark className="h-4 w-auto" />
        {DATA.name.toLowerCase()}
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/about" className="text-ink-muted transition-colors hover:text-ink">
          about
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
