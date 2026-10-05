export type MentoringPost = {
  date: string; // ISO date
  url: string;
};

export type MentoringSeries = {
  menteeName: string;
  status: "active" | "paused";
  posts: MentoringPost[];
};

// Filled in M2 per PRD §7.5 and §10.4.
export const mentoring: MentoringSeries | null = null;
