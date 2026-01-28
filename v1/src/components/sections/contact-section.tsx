import  BlurFade  from "@/components/magicui/blur-fade";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export function ContactSection() {
  return (
    <section id="contact">
      <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-cyan-300 to-blue-800 text-transparent bg-clip-text">
              Get in Touch!
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Feel free to reach out to me at{" "}
              <Link
                href={'mailto:calvinwong25@gmail.com'}
                className="text-blue-500 hover:underline"
              >
                calvinwong25@gmail.com
              </Link>{" "}
              or through {" "}
              <Link
                href={'https://www.linkedin.com/in/calvin-wong-aa8874251/'}
                className="text-blue-500 hover:underline"
              >
                my LinkedIn
              </Link>!{" "}
              I&apos;ll respond as fast as possible, Thanks so much!!
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}