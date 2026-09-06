/**
 * All v3 prose in one place. Lowercase by convention except proper nouns.
 * Edit freely; nothing here is referenced by tests except `headline`.
 */
export const COPY = {
  headline: "i like 2 build stuff :D",

  hero: {
    scrollHint: "scroll",
  },

  /** Types out as you scroll. One sentence; it should fit on two lines on a phone. */
  statement: "building things since before i knew what a compiler was.",

  skills: {
    heading: "stuff i've played with",
    hint: "click one to see where it's been used. the rows drag, if you're into that.",
    /** Shown for a skill nothing on this page lists. */
    none: "in the toolbox, but nothing on this page lists it yet.",
    /** Optional hand-written lines by skill id (e.g. "next-js"). These win over the derived line. */
    notes: {} as Record<string, string>,
  },

  list: {
    heading: "stuff i've done",
    hint: "there's a bunch, so feel free to filter ;)",
    empty: "nothing here yet. the shark is still looking. 🦈",
  },

  footer: {
    previous: "previous versions:",
    shark: "no sharks were harmed in the making of this site 🦈",
  },

  about: {
    heading: "about me",
    paragraphs: [
      "hi, i'm Calvin. i'm a computer science student at Rice University (class of 2027) with a minor in classical civilizations, a combination that confuses recruiters and delights me.",
      "i've always liked making things and then making them better. it started with physical electronics, moved into software, and the loop of designing, testing, and failing has been the good part the whole way through.",
      "somewhere in there i took a sidequest into classics and ended up winning a national championship in certamen. then i came back to software, which has been a blast ever since.",
      "most recently i interned at JPMorgan Chase as a software engineer. before that i designed and built for Fermilab's DUNE experiment and went through Headstarter's fellowship.",
    ],
    educationHeading: "school",
    shark: "why the shark? sharks have to keep moving to breathe. so do side projects. 🦈",
  },
} as const;
