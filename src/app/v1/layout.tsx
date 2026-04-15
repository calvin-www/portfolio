"use client";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/shared/ui/tooltip";
import { DesktopLayout } from "@/components/v1/layouts/desktop-layout";
import { MobileLayout } from "@/components/v1/layouts/mobile-layout";

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portfolio="v1">
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider delayDuration={0}>
          <div className="md:hidden"><MobileLayout>{children}</MobileLayout></div>
          <div className="hidden md:block"><DesktopLayout>{children}</DesktopLayout></div>
        </TooltipProvider>
      </ThemeProvider>
    </div>
  );
}
