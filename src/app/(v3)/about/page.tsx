import type { Metadata } from "next";
import { SiteNav } from "@/components/v3/SiteNav";
import { AboutContent } from "@/components/v3/AboutContent";

export const metadata: Metadata = { title: "about" };

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <AboutContent />
    </>
  );
}
