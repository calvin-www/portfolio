import { Suspense } from "react";
import { Hero } from "@/components/v3/Hero";
import { ScrollStatement } from "@/components/v3/ScrollStatement";
import { SiteNav } from "@/components/v3/SiteNav";
import { EntryList } from "@/components/v3/EntryList";
import { SkillsMarquee } from "@/components/v3/SkillsMarquee";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollStatement />
      <SiteNav />
      <Suspense fallback={null}>
        <EntryList />
      </Suspense>
      <SkillsMarquee />
    </>
  );
}
