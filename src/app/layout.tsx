import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans, Bricolage_Grotesque } from "next/font/google";
import { DATA } from "@/data";
import "./globals.css";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });
// One family for v3. The variable font carries its own width and optical-size
// axes, so the display headline and body text come from the same file.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: { default: DATA.name, template: `%s | ${DATA.name}` },
  description: DATA.description,
  openGraph: { title: DATA.name, description: DATA.description, url: DATA.url, siteName: DATA.name, locale: "en_US", type: "website" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  twitter: { title: DATA.name, card: "summary_large_image" },
  verification: { google: "", yandex: "" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, bricolage.variable)}>
        {children}
      </body>
    </html>
  );
}
