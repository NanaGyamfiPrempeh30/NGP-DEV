export type Profile = {
  label: string;
  url: string;
};

// PRD §10.6. The proton.me address is the only email shown on the site.
export const email = "yawnanagyamfiprempeh@proton.me";

export const profiles: Profile[] = [
  { label: "Email", url: `mailto:${email}` },
  { label: "GitHub", url: "https://github.com/NanaGyamfiPrempeh30" },
  { label: "GitLab", url: "https://gitlab.com/NanaGyamfiPrempeh30" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/yaw-gyamfi-prempeh-4042a0129" },
  { label: "Medium", url: "https://medium.com/@yawgyamfiprempeh27" },
  { label: "X", url: "https://x.com/y_nagprem" },
  { label: "TikTok", url: "https://www.tiktok.com/@ngp_dronelens" },
  { label: "Docker Hub", url: "https://hub.docker.com/u/yawgyamfiprem32" },
  { label: "mcp.so", url: "https://mcp.so/server/ambient-weather-mcp/NanaGyamfiPrempeh30" },
  { label: "Glama", url: "https://glama.ai/mcp/servers/NanaGyamfiPrempeh30/k8s-troubleshoot-mcp" },
];
