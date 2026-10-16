import { z } from "zod";

// PRD §7.6: graphic design gallery. Originals live in /design-src (not in git).
// `pnpm design:images` writes public/design/<id>.webp for every entry that may ship.
export const DesignWork = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    alt: z.string().min(20).max(140),
    year: z.number().int().optional(),
    kind: z.enum(["own", "client"]),
    clientName: z.string().optional(),
    canNameClient: z.boolean().default(false), // set true only after the client agrees
    consent: z.boolean().default(false), // client work only; false = hidden everywhere
    verified: z.boolean(), // owner confirmed the entry
    order: z.number().int(),
    src: z.string().min(1), // file name in /design-src
  })
  .refine((work) => !work.canNameClient || Boolean(work.clientName), {
    message: "canNameClient is true but clientName is missing",
  })
  .refine((work) => work.kind === "client" || !work.clientName, {
    message: "Own work cannot have a clientName",
  });

export type DesignWork = z.infer<typeof DesignWork>;
export type DesignWorkInput = z.input<typeof DesignWork>;

// TODO(owner): Ebenezer. No file in /design-src yet. Fix the typo "GENIUE" in the source first.
export const designWorks: DesignWorkInput[] = [
  {
    id: "shapes-sheet",
    title: "Shapes sheet",
    alt: "Four flat-colour shapes on white: a one-eyed teal alien, a green zigzag crown, a dark green hooded figure and a red owl.",
    kind: "own",
    verified: true,
    order: 1,
    src: "Alien Curva-01.jpg",
  },
  {
    id: "orange-penguin",
    title: "Orange penguin",
    alt: "A black and white penguin with a star badge stands on a grey ledge beside blue water, under an orange sky.",
    kind: "own",
    verified: true,
    order: 2,
    src: "Penguin Jigga.jpg",
  },
  {
    id: "fox",
    title: "Sleeping fox",
    alt: "An orange fox curled up asleep on green grass, under red stars in a bright blue sky.",
    kind: "own",
    verified: true,
    order: 3,
    src: "Sleeping Fox-01.jpg",
  },
  {
    id: "parrot",
    title: "Parrot",
    alt: "A parrot built from curved shapes in yellow, orange and two blues, on a red background.",
    kind: "own",
    verified: true,
    order: 4,
    src: "Swam-01.jpg",
  },
  {
    id: "leaf-fan-logo",
    title: "Company logo",
    alt: "Logo: a fan of overlapping coloured leaves around the word Geomat, with Harvest Time Co. Ltd beneath.",
    kind: "client",
    clientName: "Geomat",
    canNameClient: true, // owner, 14 Oct 2026: the client agreed to be named
    consent: true,
    verified: true,
    order: 5,
    src: "Hgeomat-01.jpg",
  },
  {
    id: "circle-fish-logo",
    title: "Fish logo",
    alt: "Round logo in brown on orange: two fish circling each other, with RE above and NAM below.",
    kind: "client",
    clientName: "RE NAM",
    canNameClient: true, // owner, 14 Oct 2026: the client agreed to be named
    consent: true,
    verified: true,
    order: 6,
    src: "RE NAM D3-01.jpg",
  },
  {
    id: "monogram-logo",
    title: "Monogram logo",
    alt: "Logo on pink: the name Jeanzz Wura arched over a handwritten jw monogram, inside a thin black circle.",
    kind: "client",
    clientName: "Jeanzz Wura",
    canNameClient: true, // owner, 14 Oct 2026: the client agreed to be named
    consent: true,
    verified: true,
    order: 7,
    src: "Jeanzz Wura-01.jpg",
  },
  {
    id: "restaurant-logo",
    title: "Restaurant logo",
    alt: "Logo: the word Ahenken in orange script with a yellow outline, above a yellow pill that reads Restaurant.",
    kind: "client",
    clientName: "Ahenken",
    canNameClient: true, // owner, 14 Oct 2026: the client agreed to be named
    consent: true,
    verified: true,
    order: 8,
    src: "Ahenken Logo-01.jpg",
  },
  {
    id: "save-the-date-card",
    title: "Save-the-date card",
    alt: "Two gold line-drawn champagne glasses clinking above the name Aboa Kese in silver script, on dark green.",
    kind: "client",
    clientName: "Aboa Kese",
    canNameClient: true, // owner, 14 Oct 2026: the client agreed to be named
    consent: true,
    verified: true,
    order: 9,
    src: "Aboakese Cheers-02.jpg",
  },
  {
    // Owner, 14 Oct 2026. The file arrived as "Tka autos logo.PNG", not "TKA-logo.jpg".
    id: "tka-logo",
    title: "Sports-car logo",
    alt: "Logo for TKA Auto's & Logistics: a white sports-car outline with speed lines on black.",
    kind: "client",
    clientName: "TKA Auto Logistics",
    canNameClient: true,
    consent: true,
    verified: true,
    order: 10,
    src: "Tka autos logo.PNG",
  },
  {
    // TODO(owner): low-res. Re-export, then set verified: true.
    id: "santas",
    title: "Santas",
    alt: "Two Santas in headphones on pale yellow: one pops a bottle, the other carries wrapped presents.",
    kind: "own",
    verified: false,
    order: 11,
    src: "Giving & Jamming-01.jpg",
  },
];
