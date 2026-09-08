/**
 * v3 adapter
 *
 * Merges work, projects and hackathons from resume.json into one sorted,
 * filterable list of Entry objects for the v3 single-page portfolio.
 * Pure functions only; ENTRIES at the bottom is the one bound to real data.
 */
import { DATA } from "@/data";
import type { ResumeData, TimelineFields } from "@/data/types";

export const ENTRY_TYPES = ["work", "projects", "hackathons"] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export const FILTERS = ["all", ...ENTRY_TYPES] as const;
export type Filter = (typeof FILTERS)[number];

export function isFilter(v: string | null | undefined): v is Filter {
  return typeof v === "string" && (FILTERS as readonly string[]).includes(v);
}

export interface EntryLink {
  type: string;
  href: string;
}

export interface Entry extends TimelineFields {
  type: EntryType;
  title: string;
  /** e.g. "feb 2025 – aug 2025", "sep 2024", "jan 2025 – now" */
  dateLabel: string;
  /** Description split into paragraphs. */
  description: string[];
  /** Role + badges for work, technologies for projects, empty for hackathons. */
  tags: string[];
  links: EntryLink[];
  image: string | null;
  video: string | null;
  logo: string | null;
  location: string | null;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export function formatMonth(iso: string): string {
  const [year, month] = iso.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : year;
}

export function formatDateRange(start: string, end: string | null): string {
  const from = formatMonth(start);
  if (end === null) return `${from} – now`;
  const to = formatMonth(end);
  return from === to ? from : `${from} – ${to}`;
}

function paragraphs(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function orNull(s: string | undefined): string | null {
  return s ? s : null;
}

function timeline(t: TimelineFields): TimelineFields {
  return { slug: t.slug, tagline: t.tagline, emoji: t.emoji, startDate: t.startDate, endDate: t.endDate };
}

export function buildEntries(data: ResumeData): Entry[] {
  const work = data.work.map<Entry>((w) => ({
    ...timeline(w),
    type: "work",
    title: w.company,
    dateLabel: formatDateRange(w.startDate, w.endDate),
    description: paragraphs(w.description),
    tags: [w.title, ...w.badges],
    links: w.href ? [{ type: "website", href: w.href }] : [],
    image: null,
    video: null,
    logo: orNull(w.logoUrl),
    location: orNull(w.location),
  }));

  const projects = data.projects.map<Entry>((p) => ({
    ...timeline(p),
    type: "projects",
    title: p.title,
    dateLabel: formatDateRange(p.startDate, p.endDate),
    description: paragraphs(p.description),
    tags: p.technologies,
    links: p.links.filter((l) => l.href).map((l) => ({ type: l.type, href: l.href })),
    image: orNull(p.image),
    video: orNull(p.video),
    logo: orNull(p.logoUrl),
    location: null,
  }));

  const hackathons = data.hackathons.map<Entry>((h) => ({
    ...timeline(h),
    type: "hackathons",
    title: h.title,
    dateLabel: formatDateRange(h.startDate, h.endDate),
    description: paragraphs(h.description),
    tags: [],
    links: h.links.filter((l) => l.href).map((l) => ({ type: l.type, href: l.href })),
    image: orNull(h.image),
    video: null,
    logo: null,
    location: orNull(h.location),
  }));

  return sortEntries([...work, ...projects, ...hackathons]);
}

/** Ongoing first, then newest start date, then title. Returns a new array. */
export function sortEntries(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    const aOngoing = a.endDate === null;
    const bOngoing = b.endDate === null;
    if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;
    if (a.startDate !== b.startDate) return a.startDate < b.startDate ? 1 : -1;
    return a.title.localeCompare(b.title);
  });
}

export function filterEntries(entries: Entry[], filter: Filter): Entry[] {
  return filter === "all" ? entries : entries.filter((e) => e.type === filter);
}

export function findEntry(entries: Entry[], slug: string | null): Entry | null {
  if (!slug) return null;
  return entries.find((e) => e.slug === slug) ?? null;
}

export const ENTRIES: Entry[] = buildEntries(DATA);
