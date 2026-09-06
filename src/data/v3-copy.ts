/**
 * All v3 prose in one place. Lowercase by convention except proper nouns.
 * Edit freely; nothing here is referenced by tests except `headline`.
 */
export const COPY = {
  headline: "i like 2 build stuff :D",

  intro: [
    "cs @ Rice University, based in Houston, TX. i've been making things since before i knew what a compiler was, and the design, test, fail, fix loop is still the fun part.",
    "somewhere along the way i took a sidequest into classics and won a national championship. then i came back to software, which has been way more fun than it has any right to be.",
    "always circling for the next thing to build.",
  ],

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
    skillsHeading: "stuff i've played with",
    shark: "why the shark? sharks have to keep moving to breathe. so do side projects. 🦈",
  },
} as const;
