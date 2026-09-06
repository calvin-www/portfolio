import { Suspense } from "react";
import { Hero } from "@/components/v3/Hero";
import { ScrollStatement } from "@/components/v3/ScrollStatement";
import { SiteNav } from "@/components/v3/SiteNav";
import { SharkPass } from "@/components/v3/SharkPass";
import { EntryList } from "@/components/v3/EntryList";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollStatement />
      <SiteNav />
      <SharkPass />
      <Suspense fallback={null}>
        <EntryList />
      </Suspense>
    </>
  );
}
