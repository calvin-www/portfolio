import { HeroSection } from "@/components/hero-section";
import { ScrollableContent } from "@/components/scrollable-content";

export default function Page() {
    return (
        <div className="flex min-h-screen">
            <HeroSection className="flex-shrink-0" />
            <ScrollableContent className="flex-grow" />
        </div>
    );
}