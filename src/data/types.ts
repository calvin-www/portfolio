/**
 * TypeScript type definitions for resume data
 * Provides full type safety for all portfolio sections
 */

/**
 * Skill category
 */
export type SkillCategory = "language" | "framework" | "tool" | "design" | "ai";

/**
 * Individual skill with category for visualization
 */
export interface Skill {
  name: string;
  category: SkillCategory;
}

/** ISO date, "YYYY-MM" or "YYYY-MM-DD". Compared as strings, so keep zero-padded. */
export type IsoDate = string;

/**
 * Fields every timeline entry (work, project, hackathon) needs for the v3 merged list.
 */
export interface TimelineFields {
  /** URL-safe id, unique across work, projects and hackathons. Used in ?item=. */
  slug: string;
  /** One line shown under the title in the list. Lowercase except proper nouns. */
  tagline: string;
  /** Single emoji shown beside the title. */
  emoji: string;
  startDate: IsoDate;
  /** null means ongoing. */
  endDate: IsoDate | null;
}

/**
 * Social media link configuration
 */
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  navbar: boolean;
}

/**
 * Contact information including email, phone, and social links
 */
export interface Contact {
  email: string;
  tel: string;
  social: Record<string, SocialLink>;
}

/**
 * Navigation bar item
 */
export interface NavbarItem {
  href: string;
  icon: string;
  label: string;
}

/**
 * Work experience entry
 */
export interface WorkExperience extends TimelineFields {
  company: string;
  href: string;
  badges: string[];
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description: string;
}

/**
 * Education entry
 */
export interface Education {
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
}

/**
 * Project link (GitHub, Demo, etc.)
 */
export interface ProjectLink {
  type: string;
  href: string;
  icon: string;
}

/**
 * Project entry
 */
export interface Project extends TimelineFields {
  title: string;
  href: string;
  active: boolean;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  image: string;
  video: string;
}

/**
 * Hackathon entry
 */
export interface Hackathon extends TimelineFields {
  title: string;
  dates: string;
  location: string;
  description: string;
  image: string;
  mlh: string;
  links: ProjectLink[];
}

/**
 * Root resume data structure
 * Contains all portfolio information
 */
export interface ResumeData {
  resumeUrl: string;
  name: string;
  initials: string;
  url: string;
  location: string;
  locationLink: string;
  description: string;
  summary: string;
  avatarUrl: string;
  skills: Skill[];
  navbar: NavbarItem[];
  contact: Contact;
  work: WorkExperience[];
  education: Education[];
  projects: Project[];
  hackathons: Hackathon[];
}
