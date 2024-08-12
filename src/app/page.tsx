import { HeroSection } from "@/components/hero-section";
import { ScrollableContent } from "@/components/scrollable-content";
import { AnimatedBackground } from "@/components/animated-background";

function Page() {
  return (
    <>
      <AnimatedBackground />
      <div className="md:hidden">
        <HeroSection className="w-full" />
        <ScrollableContent className="w-full" />
      </div>
      <div className="hidden md:flex min-h-screen">
        <HeroSection className="flex-shrink-0 w-1/4" />
        <ScrollableContent className="flex-grow" />
      </div>
    </>
  );
}

export default Page;