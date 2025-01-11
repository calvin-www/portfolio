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
        "flex-shrink-0 flex flex-col justify-center items-center min-h-[calc(100vh-4rem)]",
        className
      )}
    >
      <div className="w-full max-w-md space-y-4 md:space-y-6 text-center px-2 md:px-4 lg:px-6">
        <Avatar className="size-20 md:size-28 lg:size-32 border mx-auto mb-2 md:mb-4">
          <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
          <AvatarFallback>{DATA.initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-2 md:space-y-4">
          <div className="min-h-[36px] md:min-h-[48px] lg:min-h-[60px] flex items-center justify-center">
            <BlurFadeText
              delay={BLUR_FADE_DELAY}
              className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter"
              yOffset={8}
              text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
            />
          </div>
          <div className="min-h-[48px] md:min-h-[60px] lg:min-h-[72px] flex items-center justify-center">
            <BlurFadeText
              className="text-xs md:text-sm lg:text-base"
              delay={BLUR_FADE_DELAY}
              text={DATA.description}
            />
          </div>
        </div>
        <div className="hidden md:block">
          <Dock className="mx-auto w-max p-2 flex items-center bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] rounded-full">
            {Object.entries(DATA.contact.social)
              .filter(([_, social]) => social.navbar)
              .map(([name, social]) => (
                <DockIcon key={name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={social.url}
                        className={cn(
                          buttonVariants({variant: "ghost", size: "icon"}),
                          "size-8 md:size-10"
                        )}
                      >
                        <social.icon className="size-4 md:size-5"/>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{name}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              ))}
          </Dock>
        </div>
        <div className="flex justify-center mt-4 md:mt-6">
          <ShimmerButton
            onClick={() => window.open(
                'https://drive.google.com/file/d/1n-ZABGe0sQ0L4UAOWQzqVtOW3QUDTRFL/view?usp=sharing'
                , '_blank')}
            className="text-sm md:text-base"
          >
            <span className="text-white font-semibold">My Resume!</span>
          </ShimmerButton>
        </div>
      </div>
    </section>
  );
}