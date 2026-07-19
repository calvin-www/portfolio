import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-portfolio="v2"
      className={cn(grotesk.variable, plexMono.variable)}
      style={{ fontFamily: "var(--font-grotesk), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
