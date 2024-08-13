import { AnimatedBackground } from "@/components/animated-background";
import { ScrollableContent } from "@/components/scrollable-content";
import { HeroSection } from "@/components/hero-section";

function Page() {
  return (
    <>
      <AnimatedBackground />
      <div className="flex min-h-screen">
        <ScrollableContent className="w-2/3 lg:w-3/4" />
      </div>
    </>
  );
}

export default Page;