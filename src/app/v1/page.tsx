import { AnimatedBackground } from "@/components/v1/animated-background";
import { ScrollableContent } from "@/components/v1/scrollable-content";

export default function V1Page() {
  return (
    <>
      <AnimatedBackground />
      <ScrollableContent className="lg:w-3/4">{null}</ScrollableContent>
    </>
  );
}
