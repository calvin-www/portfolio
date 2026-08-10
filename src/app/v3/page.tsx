import type { Metadata } from "next";
import { ScrollWorld } from "@/components/v3/ScrollWorld";
import { DATA } from "@/data";

export const metadata: Metadata = {
  title: "Scroll World",
  description: `${DATA.name} — a continuous camera flight through the work.`,
};

export default function V3Page() {
  return <ScrollWorld />;
}
