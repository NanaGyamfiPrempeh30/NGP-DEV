import type { Claim } from "./schema";

// PRD §7.6. Owner-stated count, so it is marked internal (no public proof link).
export const flights: Claim = { text: "1,000+ flights", internal: true };

// TODO(owner): Ghana Civil Aviation Authority licence or registration. Without it the page says "hobbyist pilot".
export const droneLicence: string | null = null;

export const tiktokHandle = "ngp_dronelens";

export type DesignWork = { src: string; alt: string; width: number; height: number };

// TODO(owner): 6 to 12 of your own design works, with alt text for each.
export const designWorks: DesignWork[] = [];
