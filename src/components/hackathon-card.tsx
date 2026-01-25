import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  title: string;
  description: React.ReactNode;
  dates: string;
  location: string;
  image?: string;
  links?: readonly {
    icon: React.ReactNode;
    title: string;
    href: string;
  }[];
}

export function HackathonCard({
  title,
  description,
  dates,
  location,
  image,
  links,
}: Props) {
  return (
    <li className="relative ml-10 py-4 group">
      <div className="absolute -left-16 top-2 flex items-center justify-center bg-[#000a12] rounded-full border-2 border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.3)] z-10">
        <Avatar className="size-12 m-auto">
          <AvatarImage src={image} alt={title} className="object-contain" />
          <AvatarFallback className="bg-[#001e3c] text-[#00E5FF]">{title[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-1 p-4 rounded-xl bg-[#001e3c]/40 border border-[#00E5FF]/20 backdrop-blur-sm hover:bg-[#001e3c]/60 hover:border-[#00E5FF]/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300">
        {dates && (
          <time className="text-xs text-[#00E5FF]/70 font-mono">{dates}</time>
        )}
        <h2 className="font-semibold leading-none text-white group-hover:text-[#00E5FF] transition-colors">{title}</h2>
        {location && (
          <p className="text-sm text-slate-400">{location}</p>
        )}
        {description && (
          <span className="prose dark:prose-invert text-sm text-slate-300 mt-2 block [&_p]:!bg-gradient-to-r [&_p]:!from-[#00E5FF] [&_p]:!via-white [&_p]:!to-[#00E5FF] [&_p]:!text-transparent [&_p]:!bg-clip-text [&_p]:!drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] [&_p]:animate-pulse">
            {description}
          </span>
        )}
      </div>
      {links && links.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap items-start gap-2 ml-4">
          {links?.map((link, idx) => (
            <Link href={link.href} key={idx}>
              <Badge key={idx} title={link.title} className="flex gap-2 bg-[#002f4b] hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                {link.icon}
                {link.title}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}
