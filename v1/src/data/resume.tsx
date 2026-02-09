import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import resumeData from "../../../src/data/resume.json";

const iconMap: Record<string, any> = {
  github: Icons.github,
  linkedin: Icons.linkedin,
  x: Icons.x,
  youtube: Icons.youtube,
  email: Icons.email,
  globe: Icons.globe,
  home: HomeIcon,
};

const contact = {
  ...resumeData.contact,
  social: Object.fromEntries(
    Object.entries(resumeData.contact.social).map(([key, value]) => [
      key,
      { ...value, icon: iconMap[value.icon as string] },
    ])
  ),
};

const navbar = resumeData.navbar.map((item) => ({
  ...item,
  icon: iconMap[item.icon as string],
}));

const projects = resumeData.projects.map((project) => ({
  ...project,
  links: project.links.map((link) => {
    const iconName = link.icon as string;
    const IconComponent = iconMap[iconName];
    return {
      ...link,
      icon: <IconComponent className="size-3" />,
    };
  }),
}));

const hackathons = resumeData.hackathons.map((hackathon) => {
  const lines = hackathon.description.split("\n");
  const hasAward = lines[0].startsWith("Won");

  if (!hasAward) {
    return hackathon;
  }

  return {
    ...hackathon,
    description: (
      <>
        <AnimatedShinyText>{lines[0]}</AnimatedShinyText>
        {lines.slice(1).join("\n")}
      </>
    ),
  };
});

export const DATA = {
  ...resumeData,
  contact,
  navbar,
  projects,
  hackathons,
} as const;
