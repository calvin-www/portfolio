import Markdown from "react-markdown";
import { GradientText } from "@/components/shared/ui/gradient-text";

const ABOUT_TEXT = "I've always had a love for creating and improving, whether it be physical electronics or software development, designing, testing, and failing was all apart of the joy of it. After taking on a brief Sidequest into the field of Classics and winning a National Championship, I commited myself to the challenge of software development, which has been so much fun!";

export function HomeSection() {
  return (
      <div className="space-y-12 w-full py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          <GradientText>About</GradientText>
      </h2>
      <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
        {ABOUT_TEXT}
      </Markdown>
    </div>
  );
}