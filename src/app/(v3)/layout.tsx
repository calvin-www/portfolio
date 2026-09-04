import { ThemeProvider } from "@/components/shared/theme-provider";
import { SiteNav } from "@/components/v3/SiteNav";
import { Footer } from "@/components/v3/Footer";

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div data-portfolio="v3" className="min-h-screen bg-paper font-grotesk text-ink">
        <style>{`body{background:var(--v3-paper)}`}</style>
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 sm:px-6">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
