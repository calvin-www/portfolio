import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { DATA } from "@/data";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "github", href: DATA.contact.social.GitHub.url, Icon: Github },
  { label: "linkedin", href: DATA.contact.social.LinkedIn.url, Icon: Linkedin },
  { label: "email", href: `mailto:${DATA.contact.email}`, Icon: Mail },
  { label: "resume", href: DATA.resumeUrl, Icon: FileText },
];

export function ContactRow({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-2 text-v3-sm", className)}>
      {ITEMS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="v3-link inline-flex items-center gap-1.5 text-ink"
          >
            <Icon className="size-3.5 text-ink-muted" aria-hidden />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
