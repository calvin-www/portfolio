import type { Metadata } from "next";
import { AboutContent } from "@/components/v3/AboutContent";

export const metadata: Metadata = { title: "about" };

export default function AboutPage() {
  return <AboutContent />;
}
