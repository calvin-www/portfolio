import { describe, expect, test } from "bun:test";
import type { ResumeData } from "@/data/types";
import {
  buildEntries,
  ENTRIES,
  filterEntries,
  findEntry,
  formatDateRange,
  formatMonth,
  isFilter,
  sortEntries,
} from "./v3";

const fixture = {
  work: [
    {
      company: "Acme", href: "https://acme.test", badges: ["contract"], location: "Remote",
      title: "Engineer", logoUrl: "/acme.png", start: "Jan 2024", end: "Mar 2024",
      description: "Did things.",
      slug: "acme", tagline: "engineer", emoji: "🏢", startDate: "2024-01", endDate: "2024-03",
    },
    {
      company: "Ongoing Co", href: "", badges: [], location: "", title: "Lead", logoUrl: "",
      start: "Feb 2023", end: "Present", description: "Still here.",
      slug: "ongoing", tagline: "lead", emoji: "♾️", startDate: "2023-02", endDate: null,
    },
  ],
  projects: [
    {
      title: "Widget", href: "", active: true, description: "A widget.",
      technologies: ["TS", "React"],
      links: [{ type: "Source", href: "https://gh.test/w", icon: "github" }, { type: "Demo", href: "", icon: "globe" }],
      image: "/widget.png", video: "", logoUrl: "/sponsor.svg",
      slug: "widget", tagline: "a widget", emoji: "🔧", startDate: "2024-06", endDate: "2024-06",
    },
  ],
  hackathons: [
    {
      title: "Hack 1", dates: "Sep 1st - 2nd, 2024", location: "Houston",
      description: "Won first\nBuilt a thing", image: "/h.jpg", mlh: "", links: [],
      slug: "hack-1", tagline: "won first", emoji: "🏆", startDate: "2024-09-01", endDate: "2024-09-02",
    },
  ],
} as unknown as ResumeData;

describe("formatMonth / formatDateRange", () => {
  test("formats YYYY-MM as lowercase short month", () => {
    expect(formatMonth("2025-02")).toBe("feb 2025");
  });
  test("ignores the day part", () => {
    expect(formatMonth("2024-09-20")).toBe("sep 2024");
  });
  test("collapses same-month ranges", () => {
    expect(formatDateRange("2024-09-20", "2024-09-23")).toBe("sep 2024");
  });
  test("renders spans with an en dash", () => {
    expect(formatDateRange("2025-02", "2025-08")).toBe("feb 2025 – aug 2025");
  });
  test("renders ongoing as now", () => {
    expect(formatDateRange("2025-02", null)).toBe("feb 2025 – now");
  });
});

describe("buildEntries", () => {
  const entries = buildEntries(fixture);

  test("merges all three arrays", () => {
    expect(entries.map((e) => e.slug).sort()).toEqual(["acme", "hack-1", "ongoing", "widget"]);
  });
  test("pins ongoing first, then newest start date", () => {
    expect(entries.map((e) => e.slug)).toEqual(["ongoing", "hack-1", "widget", "acme"]);
  });
  test("work entries use company as title and role plus badges as tags", () => {
    const acme = findEntry(entries, "acme")!;
    expect(acme.type).toBe("work");
    expect(acme.title).toBe("Acme");
    expect(acme.tags).toEqual(["Engineer", "contract"]);
    expect(acme.logo).toBe("/acme.png");
    expect(acme.links).toEqual([{ type: "website", href: "https://acme.test" }]);
    expect(acme.location).toBe("Remote");
  });
  test("empty strings become null", () => {
    const ongoing = findEntry(entries, "ongoing")!;
    expect(ongoing.logo).toBeNull();
    expect(ongoing.location).toBeNull();
    expect(ongoing.links).toEqual([]);
  });
  test("projects use technologies as tags and drop empty links", () => {
    const widget = findEntry(entries, "widget")!;
    expect(widget.type).toBe("projects");
    expect(widget.tags).toEqual(["TS", "React"]);
    expect(widget.links).toEqual([{ type: "Source", href: "https://gh.test/w" }]);
    expect(widget.image).toBe("/widget.png");
    expect(widget.video).toBeNull();
    expect(widget.logo).toBe("/sponsor.svg");
  });
  test("projects without a logoUrl get a null logo", () => {
    const noLogo = buildEntries({ ...fixture, projects: [{ ...fixture.projects[0], logoUrl: undefined }] } as ResumeData);
    expect(findEntry(noLogo, "widget")!.logo).toBeNull();
  });
  test("hackathon descriptions split on newlines", () => {
    const hack = findEntry(entries, "hack-1")!;
    expect(hack.type).toBe("hackathons");
    expect(hack.description).toEqual(["Won first", "Built a thing"]);
    expect(hack.dateLabel).toBe("sep 2024");
  });
});

describe("sortEntries / filterEntries / findEntry", () => {
  const entries = buildEntries(fixture);
  test("sortEntries does not mutate", () => {
    const copy = [...entries].reverse();
    const sorted = sortEntries(copy);
    expect(copy[0].slug).toBe("acme");
    expect(sorted[0].slug).toBe("ongoing");
  });
  test("filterEntries all returns everything", () => {
    expect(filterEntries(entries, "all")).toHaveLength(4);
  });
  test("filterEntries by type", () => {
    expect(filterEntries(entries, "work").map((e) => e.slug)).toEqual(["ongoing", "acme"]);
  });
  test("findEntry returns null for unknown or null slug", () => {
    expect(findEntry(entries, "nope")).toBeNull();
    expect(findEntry(entries, null)).toBeNull();
  });
});

describe("isFilter", () => {
  test("accepts known filters", () => {
    expect(isFilter("all")).toBe(true);
    expect(isFilter("hackathons")).toBe(true);
  });
  test("rejects unknown, null, undefined", () => {
    expect(isFilter("nope")).toBe(false);
    expect(isFilter(null)).toBe(false);
    expect(isFilter(undefined)).toBe(false);
  });
});

describe("ENTRIES from resume.json", () => {
  test("has 17 entries with unique slugs", () => {
    expect(ENTRIES).toHaveLength(17);
    expect(new Set(ENTRIES.map((e) => e.slug)).size).toBe(17);
  });
  test("every entry has a non-empty tagline, emoji and dateLabel", () => {
    for (const e of ENTRIES) {
      expect(e.tagline.length).toBeGreaterThan(0);
      expect(e.emoji.length).toBeGreaterThan(0);
      expect(e.dateLabel.length).toBeGreaterThan(0);
    }
  });
});
