// verified: false never ships. On Vercel, only the production environment hides drafts,
// so the owner can review them on a protected preview. Anywhere else, a production build hides them.
export const showUnverified = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== "production"
  : process.env.NODE_ENV !== "production";

export function visible<T extends { verified: boolean }>(items: T[]): T[] {
  return showUnverified ? items : items.filter((item) => item.verified);
}
