import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export function ContactSection() {
  return (
    <section id="contact" className="relative w-full py-24 overflow-hidden bg-[#000a12]">
      {/* Deep Ocean Atmosphere - Bioluminescent Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#01579B]/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <div className="space-y-8">
            
            {/* Signal/Icon */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#00E5FF] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-[#001e3c] border border-[#00E5FF]/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.1)] group-hover:shadow-[0_0_50px_rgba(0,229,255,0.3)] transition-all duration-500">
                  <Mail className="w-8 h-8 text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-b from-white via-cyan-200 to-cyan-800 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                Send a Signal
              </h2>
              
              <p className="mx-auto max-w-[600px] text-blue-100/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed leading-relaxed">
                The journey through the depths is better with company. <br />
                Send a message in a bottle to{" "}
                <Link
                  href={'mailto:calvinwong25@gmail.com'}
                  className="inline-block text-[#00E5FF] font-medium transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_15px_rgba(0,229,255,1)] hover:scale-105"
                >
                  calvinwong25@gmail.com
                </Link>{" "}
                or connect via{" "}
                <Link
                  href={'https://www.linkedin.com/in/calvin-wong-aa8874251/'}
                  className="inline-block text-[#00E5FF] font-medium transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_15px_rgba(0,229,255,1)] hover:scale-105"
                >
                  LinkedIn
                </Link>.
              </p>
              
              <p className="text-sm text-blue-300/40 italic pt-4">
                Resurfacing to respond as soon as possible.
              </p>
            </div>

          </div>
        </BlurFade>
      </div>
    </section>
  );
}
