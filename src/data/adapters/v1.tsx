import { Icons } from "@/components/shared/icons";
import { HomeIcon } from "lucide-react";
import AnimatedShinyText from "@/components/shared/magicui/animated-shiny-text";
import { DATA } from "@/data";

const iconMap: Record<string, any> = {
  github: Icons.github, linkedin: Icons.linkedin, x: Icons.x,
  youtube: Icons.youtube, email: Icons.email, globe: Icons.globe, home: HomeIcon,
};

const contact = {
  ...DATA.contact,
  social: Object.fromEntries(
    Object.entries(DATA.contact.social).map(([key, value]) => [
      key, { ...value, icon: iconMap[value.icon as string] },
    ])
  ),
};

const navbar = DATA.navbar.map((item) => ({
  ...item, icon: iconMap[item.icon as string],
}));

const skills = DATA.skills.map((skill) => skill.name);

const projects = DATA.projects.map((project) => ({
  ...project,
  links: project.links.map((link) => {
    const iconName = link.icon as string;
    const IconComponent = iconMap[iconName];
    return { ...link, icon: <IconComponent className="size-3" /> };
  }),
}));

const hackathons = DATA.hackathons.map((hackathon) => {
  const lines = hackathon.description.split("\n");
  const hasAward = lines[0].startsWith("Won");
  const links = hackathon.links.map((link) => {
    const iconName = link.icon as string;
    const IconComponent = iconMap[iconName];
    return {
      title: link.type, href: link.href,
      icon: IconComponent ? <IconComponent className="size-3" /> : null,
    };
  });
  if (!hasAward) return { ...hackathon, links };
  return {
    ...hackathon, links,
    description: (<><AnimatedShinyText>{lines[0]}</AnimatedShinyText>{lines.slice(1).join("\n")}</>),
  };
});

export const V1_DATA = { ...DATA, contact, navbar, skills, projects, hackathons } as const;
