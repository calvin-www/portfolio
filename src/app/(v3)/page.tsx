import { Suspense } from "react";
import { Intro } from "@/components/v3/Intro";
import { SkillsGlobe } from "@/components/v3/SkillsGlobe";
import { EntryList } from "@/components/v3/EntryList";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Intro />
      <SkillsGlobe />
      <Suspense fallback={null}>
        <EntryList />
      </Suspense>
    </>
  );
}
