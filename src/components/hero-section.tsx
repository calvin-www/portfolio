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
              "flex flex-col justify-center md:justify-start md:sticky md:top-0 md:left-0 md:h-screen md:w-1/3 lg:w-1/4 md:pl-20 lg:pl-4",
              className
          )}
      >
        <div className="w-full max-w-md space-y-6 md:space-y-8 text-center px-2 md:px-4 lg:px-6 py-8 md:py-12">
          <Avatar className="size-28 md:size-40 border mx-auto mb-4 md:mb-8">
            <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
            <AvatarFallback>{DATA.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <div className="min-h-[48px] md:min-h-[60px] sm:min-h-[72px] xl:min-h-[84px] flex items-center justify-center">
              <BlurFadeText
                  delay={BLUR_FADE_DELAY}
                  className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none"
                  yOffset={8}
                  text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
              />
            </div>
            <div className="min-h-[48px] md:min-h-[60px] sm:min-h-[72px] flex items-center justify-center">
              <BlurFadeText
                  className="text-xs md:text-sm sm:text-base md:text-lg"
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
                                      "size-10 md:size-12"
                                  )}
                              >
                                <social.icon className="size-5 md:size-6"/>
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
          <div className="flex justify-center">
            <ShimmerButton
                onClick={() => window.open('https://drive.google.com/file/d/1JWsQ4JVLJ_B12-KaUiMDFXoooJqIlq9f/view?usp=sharing', '_blank')}
            >
              <span className="text-white font-semibold">My Resume!</span>
            </ShimmerButton>
          </div>
        </div>
      </section>
  );
}