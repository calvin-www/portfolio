import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { DATA } from "@/data";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "github", href: DATA.contact.social.GitHub.url, Icon: Github },
  { label: "linkedin", href: DATA.contact.social.LinkedIn.url, Icon: Linkedin },
  { label: "email", href: `mailto:${DATA.contact.email}`, Icon: Mail },
  { label: "resume", href: DATA.resumeUrl, Icon: FileText },
];

/**
 * The four contact links. `compact` is for the nav: icons only on small
 * screens, icon and label from the sm breakpoint up.
 */
export function ContactRow({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <ul className={cn("flex flex-wrap text-v3-sm", compact ? "gap-x-3 sm:gap-x-5" : "gap-x-6 gap-y-2", className)}>
      {ITEMS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            aria-label={compact ? label : undefined}
            className={cn(
              "inline-flex items-center gap-1.5",
              compact ? "text-ink-muted transition-colors hover:text-ink" : "v3-link text-ink",
            )}
          >
            <Icon className={cn("size-3.5", compact ? "size-4 sm:size-3.5" : "text-ink-muted")} aria-hidden />
            <span className={cn(compact && "hidden sm:inline")}>{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
