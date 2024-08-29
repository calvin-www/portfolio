import { BottomDock } from "@/components/bottom-dock";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/hero-section";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col p-4 overflow-hidden md:items-start", className)}>
      <HeroSection className="w-full py-6 text-center md:text-left" />
      <main className="flex-grow overflow-y-auto w-full text-center md:text-left !px-0">
          <div className="w-full max-w-full flex flex-col md:items-start !p-0">{children}</div>
      </main>
        <BottomDock/>
    </div>
  );
}
