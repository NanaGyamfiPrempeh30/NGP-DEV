export type MentoringPost = {
  date: string; // ISO date
  url: string;
};

export type MentoringSeries = {
  menteeName: string;
  status: "active" | "paused";
  format: string;
  rule: string;
  progress: string;
  posts: MentoringPost[];
};

export type Mentor = {
  name: string;
  url?: string; // only when the owner has approved a link
  // The words that follow the name on the page, exactly as the owner approved them.
  words: string;
};

// PRD §7.5. Paused by the mentee: say so, and don't imply a finished programme.
// The page counts the posts and takes the date range from them (owner, 30 Oct 2026).
export const mentoring: MentoringSeries | null = {
  menteeName: "Clinton",
  status: "paused",
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
    // Owner, 14 Oct 2026: exact wording. Name and words only: no link, employer, role, phone, email or dates.
    name: "Dr Fredrick Ayivor",
    words:
      " mentored me early in my DevOps career. He made sure I understood the principles behind DevOps and cloud engineering, not just the tools. I'm grateful for the work he put in.",
  },
  {
    // Owner, 5 Oct 2026.
    name: "Wilson Mar",
    url: "https://wilsonmar.github.io/",
    words: ", senior DevSecOps and AI leader, mentored me while I built the Ambient Weather MCP server.",
  },
];
