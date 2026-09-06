import { ThemeProvider } from "@/components/shared/theme-provider";
import { Footer } from "@/components/v3/Footer";
import { RoamingShark } from "@/components/v3/RoamingShark";

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div data-portfolio="v3" className="min-h-screen bg-paper font-bricolage text-v3-base text-ink">
        <RoamingShark />
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 sm:px-6">
          <main className="relative z-[1] flex-1">{children}</main>
          <Footer />
        </div>
        <div aria-hidden className="v3-grain" />
      </div>
    </ThemeProvider>
  );
}
