import { designWorks } from "@/content/design";
import sizes from "@/content/design-sizes.json";
import { showUnverified } from "./visibility";

type Rules = { kind: "own" | "client"; consent?: boolean; verified: boolean };

// Client work needs the client's consent. Without it the piece shows nowhere, previews included.
export function publishable(work: Rules): boolean {
  return work.kind === "own" || work.consent === true;
}

// Production shows verified work only. Previews add the publishable drafts.
export function visibleDesign<T extends Rules>(works: T[], showDrafts: boolean): T[] {
  return works.filter((work) => publishable(work) && (showDrafts || work.verified));
}

// Caption under each piece. Named clients: "Logo for <name>", or "Save-the-date card for <name>".
export function clientLine(work: {
  kind: "own" | "client";
  title?: string;
  clientName?: string;
  canNameClient?: boolean;
}): string {
  if (work.kind === "own") return "Own work";
  if (!work.canNameClient || !work.clientName) return "Client work";
  const what = work.title?.startsWith("Save-the-date") ? "Save-the-date card" : "Logo";
  return `${what} for ${work.clientName}`;
}

export type Size = { width: number; height: number };
export const designSizes: Record<string, Size> = sizes;

// A piece with no converted image is skipped, so a missing file never breaks the page.
export function getDesignWorks() {
  return visibleDesign(designWorks, showUnverified)
    .filter((work) => designSizes[work.id])
    .sort((a, b) => a.order - b.order)
    .map((work) => ({ ...work, ...designSizes[work.id], file: `/design/${work.id}.webp` }));
}
