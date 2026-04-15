import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export function GradientText({
  children, className, from = "#67e8f9", to = "#1e40af",
}: GradientTextProps) {
  return (
    <span className={cn(className)} style={{
      background: `linear-gradient(to right, ${from}, ${to})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}>{children}</span>
  );
}
