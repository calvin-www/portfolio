import { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <span
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
          "inline-flex font-bold animate-shine bg-[linear-gradient(110deg,#FFD700,45%,#FFA500,55%,#FFD700)] bg-[length:250%_100%] bg-clip-text text-transparent",
          className
      )}
    >
      {children}
    </span>
  );
};

export default AnimatedShinyText;