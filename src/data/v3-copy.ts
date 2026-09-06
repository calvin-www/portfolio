/**
 * All v3 prose in one place. Lowercase by convention except proper nouns.
 * Edit freely; nothing here is referenced by tests except `headline`.
 */
export const COPY = {
  hero: {
    subtitle: "making stuff @ Google",
    scrollHint: "scroll",
  },

  /** Types out as you scroll inside the ink band. A trailing ":D" is rotated to face the reader. */
  statement: "i like 2 build stuff :D",

  skills: {
    heading: "stuff i've played with",
    hint: "the rows drag, if you're into that.",
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
  },
} as const;
