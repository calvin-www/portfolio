import { BottomDock } from "@/components/bottom-dock";
import { cn } from '@/lib/utils';
import { HeroSection } from "@/components/hero-section";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col px-4", className)}>
      <HeroSection className="w-full py-6" />
      <main className="flex-grow py-6">{children}</main>
      <BottomDock />
    </div>
  );
}