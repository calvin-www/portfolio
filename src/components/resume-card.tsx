"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle: string;
  href: string;
  badges: readonly string[]; // Change this line
  period: string;
  description: string;
  className?: string;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  className,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Link
      href={href || "#"}
      className="block cursor-pointer"
      onClick={handleClick}
    >
      <Card className={cn("flex overflow-hidden pl-6 rounded-l-full relative group/card", className)}>
        {/* Seaweed Accent - Decorative organic element */}
        <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-gradient-to-b from-[var(--ocean-seafoam)] via-[var(--ocean-shallow)] to-transparent opacity-60 rounded-r-full blur-[1px] group-hover/card:opacity-100 transition-opacity duration-500" />
        
        <div className="flex-none -ml-6 z-10">
          <Avatar className="border-2 border-[var(--ocean-shallow)]/20 size-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain rounded-full"
            />
            <AvatarFallback className="rounded-full">{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow ml-2 items-center flex-col group">
          <CardHeader>
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                {title}
                {badges && (
                  <span className="inline-flex gap-x-1">
                    {badges.map((badge, index) => (
                <Badge
                        variant="secondary"
                        className="align-middle text-xs bg-[var(--ocean-surface)] text-[var(--ocean-deep)] hover:bg-[var(--ocean-shallow)] hover:text-white transition-colors border border-[var(--ocean-shallow)]/20"
                        key={index}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </span>
                )}
                <ChevronRightIcon
                  className={cn(
                    "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 text-[var(--ocean-coral)]",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                />
              </h3>
              <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right pr-2 pt-1">
                {period}
              </div>
            </div>
            {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
          </CardHeader>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                height: isExpanded ? "auto" : 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-2 text-xs sm:text-sm"
            >
              {description}
            </motion.div>
          )}
        </div>
      </Card>
    </Link>
  );
};