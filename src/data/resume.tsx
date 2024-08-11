import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";

export const DATA = {
  name: "Calvin Wong",
  initials: "CW",
  url: "https://github.com/calvin-www",
  location: "Houston, TX",
  locationLink: "https://maps.app.goo.gl/ZTUJTxSJoDPaDR5S9",
  description:
    "A college student at Rice University who loves building anything and everything!",
  summary:
  "I've always had a love for creating and improving, whether it be physical electronics or software development, designing, testing, and failing was all apart of the joy of it. After taking on a brief Sidequest into the field of Classics and winning a National Championship, I commited myself to the challenge of software development, which has been so much fun!",
  avatarUrl: "/me.png",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Python",
    "Adobe Suite",
    "firebase",
    "Tailwind CSS",
    "GitHub",
    "Mantine UI",
    "Next UI",
    "Vercel",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],
  contact: {
    email: "calvintwong25@gmail.com",
    tel: "+18329032396",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/calvin-www",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/calvin-wong-aa8874251/",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://dub.sh/dillion-twitter",
        icon: Icons.x,

        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "https://dub.sh/dillion-youtube",
        icon: Icons.youtube,
        navbar: false,
      },
      Email: {
        name: "Send Email",
        url: "mailto:calvinwong25@gmail.com",
        icon: Icons.email,

        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Headstarter",
      href: "https://headstarter.co",
      badges: [],
      location: "Remote",
      title: "Software Engineering Fellow",
      logoUrl: "/headstarter.avif",
      start: "July 2024",
      end: "September 2024",
      description:
      " Developed 5 Full Stack Projects with fully integrated AI Components whilst coached by Amazon, Bloomberg, and CapitalOne engineers on design patterns, user testing, and CI/CD.",
    },
    {
      company: "Owl Certamen",
      badges: [],
      href: "https://shopify.com",
      location: "Remote",
      title: "Lead Organizer",
      logoUrl: "/riceshield.png",
      start: "July 2023",
      end: "January 2024",
      description:
          "Created an HTML and CSS website for a state-wide convention for highschoolers and middleschoolers that I also fully organized and ran.",
    },
    {
      company: "Oculosophy",
      badges: [],
      href: "https://shopify.com",
      location: "Remote",
      title: "Graphic Designer",
      logoUrl: "/oculosophy.jpg",
      start: "June 2020",
      end: "August 2020",
      description:
      "Spent a summer working as a graphic designer and photo/video editor in Hawaii using the Adobe Suite and DSLR Cameras",
    },
  ],
  education: [
    {
      school: "Rice University",
      href: "https://rice.edu",
      degree: "Bachelor's Degree of Computer Science (BSCS) w/ Minor in Classical Civilizations",
      logoUrl: "/rice.png",
      start: "2023",
      end: "2027",
    },
    {
      school: "Klein Collins",
      href: "https://kleincollins.kleinisd.net",
      degree: "Summa Cum Laude | Rank 9/865 | National Merit Scholarship",
      logoUrl: "/kleincollins.png",
      start: "2019",
      end: "2023",
    },
  ],
  projects: [
    {
      title: "MockOwl",
      href: "",
      active: true,
      description:
        "A Full Stack application designed to replicate any external service to ease development costs as well as educate students on backend calls",
      technologies: [
        "Next.js",
          "React",
        "Typescript",
        "TailwindCSS",
        "Mantine UI",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/calvin-www/mockowl",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/ricelong.jpg",
      video:
        "",
    },
    {
      title: "PantryPal",
      href: "https://magicui.design",
      active: true,
      description:
        "A dynamic inventory management application designed to streamline pantry organization. It offers intuitive item tracking with features like voice recognition and image capture for easy input. Users can efficiently search, sort, and view their pantry items in both card and list formats.",
      technologies: [
        "Next.js",
        "Typescript",
        "Vercel",
        "Mantine UI",
        "Gemini AI",
        "Tailwind",
        "FireBase",
      ],
      links: [
        {
          type: "Demo",
          href: "https://www.youtube.com/watch?v=yEj6bygIteI",
          icon: <Icons.youtube className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/calvin-www/pantrypal",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "pantrypaldemo.mp4",
    },
    {
      title: "AI Customer Service Chatbot",
      href: "",
      active: true,
      description:
          "A modern, responsive AI customer support chat application featuring real-time conversation management, user authentication, and a sleek interface. Users can effortlessly create, select, and delete chat conversations, each with a unique interface. The AI leverages RAG to adapt and meet the user's needs effectively. Additionally, the app includes a feedback mechanism that stores user feedback in the database.",
      technologies: [
        "Next.js",
        "Typescript",
        "Next UI",
        "FireBase",
        "Firebase Auth",
        "AWS",
        "Gemini AI",
        "AI RAG",
      ],
      links: [
        {
          type: "Demo",
          href: "https://www.youtube.com/watch?v=jzs-Re7X1Wo",
          icon: <Icons.youtube className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/calvin-www/chatapp",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "/chatappdemo.mp4",
    },
    {
      title: "Money Buddy",
      href: "",
      active: true,
      description:
        "A friendly Discord bot that helps with personal expenses by allowing the user to upload and categorize expenses in addition to the option of uploading a receipt, which is then scanned and the text is extracted and placed into an expense category, the users expenses can then be exported as a CSV file.",
      technologies: [
        "Python",
        "JSON",
        "Pytesseract",
      ],
      links: [
        {
          type: "Devpost",
          href: "https://devpost.com/software/money-buddy-4w82v0",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/calvin-www/Money-Buddy",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "/moneybuddydemo.mp4",
    },
    {
      title: "Calc Hunter",
      href: "",
      active: true,
      description:
          "A fully functional game that uses a playful scenario about treasure hunting to teach students the importance of Calculus.",
      technologies: [
        "HTML",
        "CSS",
        "Typescript",
        "Prisma",
        "Photoshop",
        "Illustrator",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/baidenm22/KleinHacks2023EduGaming",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/calchunter.png",
      video:
          "",
    },
  ],
  hackathons: [
    {
      title: "HackRice 13",
      dates: "September 24th - 26th, 2023",
      location: "Houston, Texas",
      description: (
          <>
            <AnimatedShinyText>Won CapitalOne&apos;s &quot;Best Financial hack&quot;</AnimatedShinyText>
            , Developed a financial chatbot that helps with tracking and recording expenses that can also scan receipts and upload relevant data.
          </>
      ),      image:
        "/hackrice.jpg",
      mlh: "",
      links: [],
    },
    {
      title: "KleinHacks 23",
      dates: "April 4th - 6th, 2023",
      location: "Klein, Texas",
      description: (
          <>
            <AnimatedShinyText>Won First Place Overall</AnimatedShinyText>, Developed a web based
            browser game designed to teach students the basics of Calculus and their real world applications.
          </>
      ),
      image:
        "/kleinhacks.jpg",
      mlh: "",
      links: [],
    },
    {
      title: "KleinHacks 21",
      dates: "March 6th - 7th, 2021",
      location: "San Francisco, California",
      description: (
          <>
            <AnimatedShinyText>Won third place Overall</AnimatedShinyText>,
            Developed a Unity game centered around a frog crossing a river with a plethora of obstacles and challenges.

          </>
),      icon: "public",
      image:
        "/kleinhacks.jpg",
      links: [],
    },
  ],
} as const;
