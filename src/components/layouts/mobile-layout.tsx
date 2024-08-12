import { BottomDock }  from "@/components/bottom-dock";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow px-2 py-6">{children}</main>
      <BottomDock />
    </div>
  );
}