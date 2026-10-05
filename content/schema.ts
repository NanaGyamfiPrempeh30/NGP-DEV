import { z } from "zod";

export const Evidence = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const Claim = z
  .object({
    text: z.string(),
    evidence: Evidence.optional(),
    internal: z.boolean().default(false),
  })
  .refine((c) => !/\d/.test(c.text) || c.evidence || c.internal, {
    message: "A claim with a number needs evidence or internal:true",
  });

export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  kind: z.enum(["work", "client", "open-source"]),
  featured: z.boolean().default(false),
  canNameClient: z.boolean().default(false),
  clientLabel: z.string().optional(),
  role: z.string(),
  start: z.string(),
  end: z.string().optional(),
  stack: z.array(z.string()).max(8),
  outcome: z.string().max(120),
  claims: z.array(Claim),
  links: z.array(Evidence),
  verified: z.boolean(),
});

export const Job = z.object({
  company: z.string(),
  country: z.string(),
  mode: z.enum(["remote", "hybrid", "onsite"]),
  type: z.enum(["full-time", "part-time", "contract"]),
  title: z.string(),
  start: z.string(),
  end: z.string().optional(),
  claims: z.array(Claim).min(2).max(5),
  stack: z.array(z.string()),
  verified: z.boolean(),
});

export const Cert = z.object({
  name: z.string(),
  type: z.enum(["certification", "course"]),
  issued: z.string(),
  expires: z.string().optional(),
  validationNo: z.string().optional(),
  verifyUrl: z.string().url().optional(),
});

export type Evidence = z.infer<typeof Evidence>;
export type Claim = z.infer<typeof Claim>;
export type Project = z.infer<typeof Project>;
export type Job = z.infer<typeof Job>;
export type Cert = z.infer<typeof Cert>;
