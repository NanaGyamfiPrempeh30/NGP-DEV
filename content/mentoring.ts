export type MentoringPost = {
  date: string; // ISO date
  url: string;
};

export type MentoringSeries = {
  menteeName: string;
  status: "active" | "paused";
  weeks: number;
  format: string;
  rule: string;
  progress: string;
  posts: MentoringPost[];
};

export type Mentor = {
  name: string;
  description: string;
  // What he mentored me on. The page prints: "<name>, <description>, mentored me <when>."
  when: string;
  url: string;
};

// PRD §7.5. Paused by the mentee after week 5: say so, and don't imply a finished programme.
export const mentoring: MentoringSeries | null = {
  menteeName: "Clinton",
  status: "paused",
  weeks: 5,
  format: "Weekly 3-question check-in, run in public on X.",
  rule: "Attempt first, AI second.",
  progress:
    "From relying on Windows and Copilot to writing bash scripts, killing live processes by PID and understanding Linux networking basics.",
  posts: [
    { date: "2026-04-18", url: "https://x.com/y_nagprem/status/2045436170570432739" },
    { date: "2026-05-04", url: "https://x.com/y_nagprem/status/2051279257792360820" },
    { date: "2026-05-11", url: "https://x.com/y_nagprem/status/2053840281397539063" },
    { date: "2026-05-21", url: "https://x.com/y_nagprem/status/2057496838278717601" },
    { date: "2026-05-28", url: "https://x.com/y_nagprem/status/2060043859908796774" },
    { date: "2026-06-18", url: "https://x.com/y_nagprem/status/2067647333651632526" },
  ],
};

// Use only the owner's words for each person. Order is the order on the page.
export const mentors: Mentor[] = [
  {
    // Owner, 13 Oct 2026. No phone, email, employer or dates.
    name: "Dr. Fredrick Ayivor, Ph.D.",
    description: "senior DevOps and AI engineer",
    when: "at the beginning and in the early years of my DevOps career",
    url: "https://www.linkedin.com/in/dr-fredrick-ayivor-ph-d-4347a491",
  },
  {
    // Owner, 5 Oct 2026.
    name: "Wilson Mar",
    description: "senior DevSecOps and AI leader",
    when: "while I built the Ambient Weather MCP server",
    url: "https://wilsonmar.github.io/",
  },
];
