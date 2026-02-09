"use client";

import { Layout } from "@/components/layout/Layout";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { DepthGauge } from "@/components/ui/DepthGauge";
import { FlashlightOverlay } from "@/components/ui/FlashlightOverlay";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SharkCompanion } from "@/components/3d/SharkCompanion";
import { ParallaxBubbles } from "@/components/effects/ParallaxBubbles";
import { OrganicBlobs } from "@/components/effects/OrganicBlobs";
import { CausticsOverlay } from "@/components/effects/CausticsOverlay";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {!prefersReducedMotion && (
        <>
          <CustomCursor />
          <SharkCompanion />
          <ParallaxBubbles />
          <OrganicBlobs />
          <CausticsOverlay />
        </>
      )}
      <FlashlightOverlay />
      <DepthGauge />
      <Layout>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </Layout>
    </>
  );
}
