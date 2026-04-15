import { Layout } from "@/components/v2/layout/Layout";
import { HeroSection } from "@/components/v2/sections/HeroSection";
import { AboutSection } from "@/components/v2/sections/AboutSection";
import { WorkSection } from "@/components/v2/sections/WorkSection";
import { ProjectsSection } from "@/components/v2/sections/ProjectsSection";
import { SkillsSection } from "@/components/v2/sections/SkillsSection";
import { ContactSection } from "@/components/v2/sections/ContactSection";

export default function V2Page() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </Layout>
  );
}
