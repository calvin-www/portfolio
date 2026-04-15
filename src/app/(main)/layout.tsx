"use client";
import { ThemeProvider } from "@/components/shared/theme-provider";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portfolio="v2">
      <ThemeProvider attribute="class" defaultTheme="light">{children}</ThemeProvider>
    </div>
  );
}
