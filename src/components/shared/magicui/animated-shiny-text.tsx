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
        <p
            style={{
                "--shimmer-width": `${shimmerWidth}px`,
            } as CSSProperties}
className={cn(
    " max-w-md bg-clip-text font-bold",
    "animate-shimmer bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
    "bg-gradient-to-r from-amber-600 via-yellow-200 to-amber-600",
    "text-amber-500",
    className
)}
        >
            {children}
        </p>
    );
};

export default AnimatedShinyText;