import { BottomDock } from "@/components/bottom-dock";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/hero-section";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col p-4 overflow-hidden items-center",
        className,
      )}
    >
      <HeroSection className="w-full py-6 text-center" />
      <main className="flex-grow overflow-y-auto w-full text-center !px-0">
        <div className="w-full max-w-full px-0 !mx-0 flex flex-col items-center">
          {children}
        </div>
      </main>
      <BottomDock />
    </div>
  );
}
