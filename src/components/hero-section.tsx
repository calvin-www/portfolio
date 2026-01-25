'use client';
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";

const BLUR_FADE_DELAY = 0.04;

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-[var(--ocean-surface)] to-[var(--ocean-shallow)]",
        className
      )}
    >
      {/* Water Surface Effect */}
      <div className="absolute top-0 left-0 w-full h-32 opacity-30 pointer-events-none overflow-hidden">
         <div className="absolute w-[200%] h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 animate-wave-surface"></div>
         <div className="absolute w-full h-full bg-gradient-to-b from-white/40 to-transparent"></div>
      </div>

      {/* Sunbeams/Light shafts */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.4),transparent_70%)]"></div>

      <div className="relative z-10 w-full max-w-md space-y-4 md:space-y-6 text-center px-2 md:px-4 lg:px-6">
        
        {/* Avatar with Ripples */}
        <div className="relative mx-auto mb-6 md:mb-8 size-24 md:size-32 lg:size-40 flex items-center justify-center">
            {/* Ripple Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ripple" style={{ animationDelay: '0s' }}></div>
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ripple" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ripple" style={{ animationDelay: '2s' }}></div>
            
            <Avatar className="size-full border-4 border-white/50 shadow-xl z-10 bg-white/20 backdrop-blur-sm">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} className="object-cover" />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
            </Avatar>
        </div>

        <div className="space-y-2 md:space-y-4">
          <div className="min-h-[36px] md:min-h-[48px] lg:min-h-[60px] flex items-center justify-center">
            <BlurFadeText
              delay={BLUR_FADE_DELAY}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-[var(--ocean-deep)] drop-shadow-sm"
              yOffset={8}
              text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
            />
          </div>
          <div className="min-h-[48px] md:min-h-[60px] lg:min-h-[72px] flex items-center justify-center px-4">
            <BlurFadeText
              className="text-sm md:text-base lg:text-lg text-[var(--ocean-deep)]/80 font-medium max-w-[90%]"
              delay={BLUR_FADE_DELAY}
              text={DATA.description}
            />
          </div>
        </div>

        {/* Social Dock as Bubbles */}
        <div className="hidden md:block pt-4">
          <Dock className="mx-auto w-max p-3 flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-full">
            {Object.entries(DATA.contact.social)
              .filter(([_, social]) => social.navbar)
              .map(([name, social], index) => (
                <DockIcon key={name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={social.url}
                        style={{ animationDelay: `${index * 0.2}s` }}
                        className={cn(
                          buttonVariants({variant: "ghost", size: "icon"}),
                          "size-10 md:size-12 rounded-full bg-white/40 hover:bg-white/60 text-[var(--ocean-deep)] transition-all duration-300 hover:scale-110 border border-white/20 animate-float-bubble"
                        )}
                      >
                        <social.icon className="size-5 md:size-6"/>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[var(--ocean-deep)] text-white border-none">
                      <p>{name}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              ))}
          </Dock>
        </div>

        <div className="flex justify-center mt-6 md:mt-8">
          <ShimmerButton
            onClick={() => window.open(
                'https://drive.google.com/file/d/1aIbBhANoJIwF2334zYdCqqV9EuuxxN5h/view?usp=sharing'
                , '_blank')}
            className="text-sm md:text-base shadow-xl"
            background="var(--ocean-mid)"
            shimmerColor="var(--ocean-surface)"
          >
            <span className="text-white font-bold tracking-wide">My Resume!</span>
          </ShimmerButton>
        </div>
      </div>
    </section>
  );
}
