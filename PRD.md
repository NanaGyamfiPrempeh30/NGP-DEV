# PRD: Yaw Nana Gyamfi Prempeh Portfolio (Online CV)

Version 1.4 · 5 Oct 2026 · Owner: Yaw Nana Gyamfi Prempeh (NGP-Dev)
Build tool: Claude Code. Read `CLAUDE.md` first, then this file.

---

## 1. Problem

Recruiters see three versions of me: a base CV, an Azure-tailored CV and a LinkedIn profile. They disagree on dates, titles, schools and tools. My real proof (repos, Medium posts, published MCP servers) is scattered across six platforms. Nobody connects them.

## 2. Goal

One public site that is the single source of truth for my career. Every claim on it links to proof.

### Success criteria (measurable)

| # | Metric | Target |
|---|--------|--------|
| S1 | Every project and job bullet with a number has an evidence link | 100% (build fails otherwise) |
| S2 | Lighthouse (mobile): Performance, Accessibility, Best Practices, SEO | All ≥ 95 |
| S3 | Time for a recruiter to reach a repo or article from the home page | ≤ 2 clicks |
| S4 | Dates, titles and schools match the downloadable CV exactly | 0 mismatches |
| S5 | Monthly running cost | $0 (custom domain optional, paid separately) |

## 3. Audience

1. **Recruiters / hiring managers** (DevOps, DevSecOps, Platform). Skim 30 seconds. Need role, years, stack, proof.
2. **Engineers doing a technical screen.** Open repos and articles. Check depth.
3. **Freelance clients** (small business, Ghana). Need trust: real clients, real outcomes.

## 4. Scope

### In scope (v1)
- Home, Experience, Projects (list + detail), Writing, Mentoring, Beyond Code (drones, design), CV page with PDF download, Contact.
- Content stored as typed files in the repo. No CMS, no database.
- Medium articles pulled automatically from RSS.
- GitHub stars/forks pulled at build time.
- CI pipeline in GitHub Actions (this is part of the portfolio: it shows how I ship).

### Out of scope (v1)
- Blog engine on the site (Medium stays the blog).
- Login, admin panel, comments, database.
- Contact form backend (use mailto + LinkedIn in v1).
- Dark-pattern tracking. Only Vercel Web Analytics (cookieless).

## 5. Tech stack (checked 3 Oct 2026)

| Layer | Choice | Note |
|-------|--------|------|
| Framework | Next.js 16 (App Router), TypeScript strict | 16 is the current LTS line. Install the latest 16.x patch; there was a security release on 22 Sep 2026. Run `npx next --version` and check nextjs.org/blog before starting. |
| Styling | Tailwind CSS (latest stable) | Use design tokens in CSS variables. |
| Content | MDX + JSON/TS files in `/content`, validated with Zod | Schema in section 9. |
| Hosting | Vercel Hobby (free) | Allowed: Hobby is for personal, non-commercial use. A personal portfolio fits. Limits: 100 GB transfer, 1M function invocations, 100 deploys/day. |
| Source | GitHub repo `NanaGyamfiPrempeh30/portfolio` (public) | The repo itself is a portfolio piece. |
| CI | GitHub Actions (free for public repos) | Lint, typecheck, test, build, Lighthouse CI, link check, secret scan. |
| Analytics | Vercel Web Analytics (Hobby: 50k events/month) | Cookieless. |
| Design | UI/UX plugin installed in Claude Code + `frontend-design` skill | Confirm the plugin name with `/plugin` before use. |
| Fonts | Self-hosted via `next/font` | No Google Fonts network call at runtime. |

## 6. Information architecture

```
/                   Home
/experience         Work timeline
/projects           Filterable grid
/projects/[slug]    Case study
/writing            Medium articles (auto)
/mentoring          Mentoring (giving and receiving)
/beyond             UAV pilot + graphic design
/cv                 Printable CV + PDF download
```
Contact lives in the footer and on Home. No separate page.

## 7. Page requirements

### 7.1 Home
- Name, role line ("DevSecOps Engineer · Kubernetes · Terraform · AWS"), location (Accra, Ghana · remote).
- **Proof strip:** 4 live numbers pulled from data, each a link. Example: "53★ on k8s-devsecops", "11 Medium articles", "3 published MCP servers", "453 tests on k8s-troubleshoot-mcp". Only numbers that are verified (see section 11).
- 3 featured projects (flag `featured: true`).
- Latest 2 Medium articles.
- CTA buttons: Download CV, Email me, GitHub.

### 7.2 Experience
- Vertical timeline, newest first. One entry per job in `content/experience.ts`.
- Each entry: company, country, mode (remote/hybrid/onsite), title, dates, 3 to 5 bullets, stack tags.
- Bullets with a number must have `evidence` or be marked `internal: true` (shown without a link, max 1 per job).
- Overlapping jobs must show a label: "Part-time" or "Contract". The build warns on any overlap without a label.

### 7.3 Projects
- Grid with filters: All, Work, Client, Open Source.
- Card: title, one-line outcome, stack tags (max 5), links (repo, article, live, registry).
- Detail page sections, in this order: **Context · Problem · What I built · How it works (diagram) · What broke and how I fixed it · Result · Links**.
- "What broke" is required. My Medium posts are strong because they show debugging. Keep that voice.
- Client projects under NDA: `canNameClient: false` shows "Rural bank, Ghana" instead of the name.

### 7.4 Writing
- Fetch `https://medium.com/feed/@yawgyamfiprempeh27` at build. Revalidate every 24 h (ISR).
- RSS only returns the latest ~10 posts. Keep a static fallback list in `content/articles.ts` for older posts, merged and de-duplicated by URL.
- Show title, date, tags, read link. No full article copy on the site (Medium owns that page).

### 7.5 Mentoring
- **Mentee:** a Ghanaian engineer teaching himself DevOps in the UK. Pro bono, run in public on X (@y_nagprem) as a content series.
  - Format: weekly 3-question check-in. Rule: "attempt first, AI second".
  - Progress over 5 weeks: from relying on Windows and Copilot to writing bash scripts, killing live processes by PID, and understanding Linux networking basics.
  - Status: paused by the mentee after week 5. Say so on the page. Don't imply a finished programme or a job outcome.
  - Name: "Clinton" (he agreed, 5 Oct 2026). First name only.
  - Links (all @y_nagprem, dates read from the post IDs; post text not machine-checked because X blocks automated reads, owner confirmed these are the series):
    - 18 Apr 2026: https://x.com/y_nagprem/status/2045436170570432739
    - 4 May 2026: https://x.com/y_nagprem/status/2051279257792360820
    - 11 May 2026: https://x.com/y_nagprem/status/2053840281397539063
    - 21 May 2026: https://x.com/y_nagprem/status/2057496838278717601
    - 28 May 2026: https://x.com/y_nagprem/status/2060043859908796774
    - 18 Jun 2026: https://x.com/y_nagprem/status/2067647333651632526
  - Show the series as a dated timeline, each entry linking to its post. Use the click-to-load facade for any embed.
- **Being mentored:** Wilson Mar (Ambient Weather MCP). Link his site, with his consent.

### 7.6 Beyond Code
- UAV pilot: "1,000+ flights". TikTok @ngp_dronelens. Use a click-to-load facade (thumbnail first, TikTok script only after click). This keeps Lighthouse scores high and avoids loading TikTok trackers on page load.
- Graphic design: gallery of 6 to 12 of my own works. `next/image`, WebP/AVIF, alt text on every image.
- Add drone licence/registration if I hold one (Ghana Civil Aviation Authority). Without it, say "hobbyist pilot".

### 7.7 CV
- Same data as Experience, laid out for print (`@media print`, A4).
- "Download PDF" serves `/public/cv/YNGP_CV_public.pdf`: the CV without address, phone or referees (§11.2 item 4).
- Show "Last updated" date.

### 7.8 Contact (footer)
- All links in §10.6. Email is proton.me only.
- **No** home address, **no** phone number, **no** referee emails. Referees "available on request".

## 8. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Accessibility | WCAG 2.2 AA. Keyboard nav, visible focus, contrast ≥ 4.5:1, `prefers-reduced-motion` respected. |
| Readability (owner is dyslexic, many readers skim) | Body text 18px min, line height 1.6, line length ≤ 70ch, left-aligned, no justified text, no italics for long text, sans-serif. Short paragraphs. Offer a "Comfort mode" toggle (larger spacing, Atkinson Hyperlegible font). |
| Performance | Static by default. No client JS on pages that don't need it. LCP < 2.0 s on 4G. Total JS < 100 KB gzipped on Home. |
| SEO | Per-page metadata, Open Graph images (generated with `next/og`), `sitemap.xml`, `robots.txt`, JSON-LD `Person` on Home. |
| Security | Security headers in `next.config` (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). No secrets in repo; gitleaks in CI. Dependabot on. |
| Theming | Light + dark, follows system, manual toggle. |
| Mobile | Works at 360px width. No horizontal scroll. |

## 9. Content model (Zod)

```ts
// content/schema.ts
const Evidence = z.object({
  label: z.string(),            // "Repo", "Article", "Docker Hub"
  url: z.string().url(),
});

const Claim = z.object({
  text: z.string(),
  evidence: Evidence.optional(),
  internal: z.boolean().default(false), // true = real but private, no link
}).refine(
  c => !/\d/.test(c.text) || c.evidence || c.internal,
  { message: "A claim with a number needs evidence or internal:true" }
);

const Project = z.object({
  slug: z.string(),
  title: z.string(),
  kind: z.enum(["work", "client", "open-source"]),
  featured: z.boolean().default(false),
  hidden: z.boolean().default(false),   // never rendered while true; owner lifts it
  canNameClient: z.boolean().default(false), // set true only after client agrees
  clientLabel: z.string().optional(),   // shown when canNameClient=false
  role: z.string(),
  start: z.string(),                    // "2026-05"
  end: z.string().optional(),           // omit = ongoing
  startSource: z.enum(["owner", "first-commit", "article"]), // "article" shows as "Published <Mon YYYY>"
  stack: z.array(z.string()).max(8),
  outcome: z.string().max(120),
  claims: z.array(Claim),
  links: z.array(Evidence),
  verified: z.boolean(),                // owner confirmed every fact
});

const Job = z.object({
  company: z.string(),
  country: z.string(),
  mode: z.enum(["remote", "hybrid", "onsite"]),
  type: z.enum(["full-time", "part-time", "contract"]).optional(), // omit until owner confirms
  title: z.string(),
  start: z.string(),
  end: z.string().optional(),
  claims: z.array(Claim).min(2).max(5),
  stack: z.array(z.string()),
  verified: z.boolean(),
});

const Cert = z.object({
  name: z.string(),
  type: z.enum(["certification", "course"]),
  issued: z.string(),          // "2024-11-08"
  expires: z.string().optional(),
  validationNo: z.string().optional(),
  verifyUrl: z.string().url().optional(),
});
```
**Build rule:** certs past `expires` are hidden.
**Build rule:** in production builds, any item with `verified: false` is hidden and logged. It never ships by accident.

## 10. Content inventory (updated 5 Oct 2026)

Source of truth for jobs, dates, titles and education: `YNGP_CV.pdf` (5 Oct 2026). LinkedIn is not a source.
Status key: ✅ verified · ❓ need owner input

### 10.1 Experience

| Company | Title | Type | Dates | Status |
|---------|-------|------|-------|--------|
| Bosonit (Spain), end client ECDC | DevSecOps Engineer | Contract, hybrid / remote from Ghana | Nov 2025 to Jan 2026 | ✅ |
| Algo AI (Canada) | Lead DevOps Engineer | Part-time, remote | Aug 2025 to Oct 2025 | ✅ |
| Technology Excellence Services (USA) | DevOps Engineer | Full-time, remote | May 2022 to Mar 2026 | ✅ |
| Blue Turtle Technologies (South Africa) | Platform Infrastructure Engineer | Remote | May 2020 to Apr 2022 | ✅ |
| Millicom Tigo Ghana | Linux System Engineer | Onsite | Feb 2019 to Mar 2020 | ✅ |

- Headline: **"6+ years in DevOps (since 2020). Linux engineering since 2019."**
- Not on the CV, so not on Experience: Vodafone, Echohouse, Aviation Port Services.
- Separate "Freelance & side projects" block on Experience page (these overlap full-time jobs, so the label matters):
  - **Ten Forward International Group** · Freelance IT administrator · 2020 to present. GoDaddy domains, email accounts, Microsoft 365, company website. ✅ dates · ✅ named
  - **afarmforme** · Tech engineer (side project) · May 2021 to Feb 2022. Platform where clients invest in a crop; the team farms it and the client takes the harvest. Ended when investment stopped. Built the frontend with Bootstrap, JavaScript and HTML. ✅ dates · ✅ stack · ✅ named
- Education: BSc Information Technology, Ghana Communication Technology College, Tesano, Accra, 2012 to 2015 ✅

**Approved job claims.** Use these, not the old CV bullets. Every unsourced percentage is removed (see `METRICS.md`).

Bosonit (client named: ECDC)
- Built ECDC's compliance platform cluster on IONOS Cloud from scratch with Terraform and Ansible. Sole DevSecOps engineer. → evidence: IONOS article
- Locked access down: 3 nodes, no public IPs, one bastion running OpenVPN as the only way in. → IONOS article
- Traefik ingress behind MetalLB. HAProxy in TCP mode on the bastion as reverse proxy to the nodes. → IONOS article
- cert-manager with a self-signed CA for cluster services; Let's Encrypt HTTP-01 tested on a dummy domain (`hello.ecdc.es`). → IONOS article
- 7-stage Azure DevOps pipeline: provision, bootstrap, deploy. → `internal: true`
- Vault on NFS with External Secrets Operator, ArgoCD, KEDA, Prometheus and Grafana. → IONOS article
- Eclipse Tractus-X EDC with custom Helm values and Vault integration. → `internal: true`
- Gaia-X GXDCH Loire services deployed locally; 9 of 12 compliance tests passing. → `internal: true`
- 80+ pages of docs: setup guides, architecture, runbooks. → `internal: true`

Algo AI
- Deployed and ran 6 full-stack apps (Vue, TypeScript, Node, Python/FastAPI) on Heroku. → `internal: true`
- Built the GitHub Actions CI/CD for those apps. Optional: add "deploys went from X to Y min" only if owner later supplies X and Y.

Technology Excellence Services · Blue Turtle · Tigo
- Keep the descriptive bullets from the CV. Drop every percentage until owner supplies a baseline (see `METRICS.md`).

### 10.2 Projects

| Project | Kind | Proof | Status |
|---------|------|-------|--------|
| k8s-devsecops (kubeadm, Calico, MetalLB, Traefik, Vault, ESO, ArgoCD, Prometheus/Grafana on AWS) | open-source | Repo 53★ 19 forks · Medium 16 Jan 2026 | ✅ **feature** |
| k8s-troubleshoot-mcp (16 read-only tools, RBAC boundary, prompt-injection escaping, **453 passing tests**, 6 bugs found on a live cluster) | open-source | Repo (MIT) · Medium 28 Aug 2026 · Glama | ✅ **feature** |
| ECDC Kubernetes on IONOS | work | Medium 9 Jun 2026 | ✅ **feature** |
| TKA Auto's & Logistics: marketing site, customer tracking portal, admin dashboard for a US auction car import business (Copart, IAAI, Manheim to Ghana). Next.js, TypeScript, Supabase, Stripe + Paystack, Vercel | client | Live site tka-auto-logistics.vercel.app · Repo | ✅ role: software engineer and graphic designer · ✅ named |
| ambient-weather-mcp (FastMCP, 60 s cache, Docker Hub, mcp.so, GHCR) | open-source | Repo · Docker Hub · mcp.so · Medium 25 May 2026 | ✅ |
| eks-karpenter-gitops-bench (EKS, Karpenter, ArgoCD, Tenki CI, 86 Terraform resources) | open-source | Repo 3★ 5 forks · Medium 22 Jan 2026 | ✅ |
| AuditTrack (FastAPI/React, ECS Fargate, SQS, Lambda, DynamoDB, S3, Terraform; Azure to AWS migration) | open-source | Repo | ✅ |
| Sika Track (Telegram bookkeeping bot for Ghanaian informal businesses, Flask, Supabase, Render, encrypted backups) | open-source | Repo | ✅ |
| nextcloud-installer (9-stage idempotent installer) | open-source | Repo 1★ | ✅ |
| GXDCH Loire (9 of 12 tests) and Tractus-X EDC | work | Internal, inside Bosonit entry | ✅ no separate page |
| py-guardian-ops (FastAPI → Azure Container Apps, Trivy) | open-source | Repo · Medium 19 Oct 2025 | ✅ |
| Serverless Flask on AWS with Pulumi | open-source | Repo: https://github.com/NanaGyamfiPrempeh30/devops-labs/tree/Pulumi/aws-python-app · Medium 12 Jul 2025 | ✅ (link live once rename is done) |
| Blue/green on ECS with CodePipeline | open-source | GitLab `Devops` · Medium 13 Mar 2025 | ✅ |
| AWS automation with Python, Terraform and Boto3 | open-source | GitLab `Devops` · Medium 4 Jun 2024 | ✅ |
| On-premise to multi-cloud migration | open-source | GitLab `Devops` · Medium 7 Jun 2024 | ✅ |
| DevSecOps three-tier app on EKS (Terraform, Jenkins, GitLab) | open-source | GitLab `DevSecop` + `eks-terraform-gitlab` · Medium 27 Sep 2024 | ✅ |
| k8s-platform-kiro (k8s-devsecops v2, spec-driven with Kiro, 9 commits) | open-source | Repo | Mention inside k8s-devsecops page, no own card |
| Rural bank staff portal (Abokobi Rural Bank): issue logging, approvals with signatures, inventory module. Node/Express, SQLite, Docker Compose, Caddy, self-hosted on the bank's server | client | Internal only. Do **not** link the repo | ✅ facts · ✅ named · see §10.5 |
| Loan bot | personal | Planning stage | Don't publish |

GitHub check (via connected account, 5 Oct): 11 owned public repos + 1 collaborator repo. All accounted for above.

### 10.3 Writing (Medium, 11 posts)
Unchanged. Pull from RSS. EKS title fixed by owner.

### 10.4 Mentoring, hobbies
- Teaching cohort: dropped from the site (owner decision, 5 Oct).
- Mentee: see §7.5.
- Mentored by Wilson Mar ✅
- UAV pilot, 1,000+ flights, TikTok @ngp_dronelens ✅ owner stated. Licence ❓
- Graphic design ❓ samples.

### 10.5 Case study notes: rural bank portal

Use for the project page. Context: staff log issues, route approvals with signatures, and track inventory. Bank IT manager owns the system; I work on it.

What broke and how I fixed it:
- Logout crashed (`TypeError: cb is not a function`). The session was destroyed with no callback. Fixed the route and guarded all four methods in the SQLite session store.
- Signature uploads failed. A global JSON parser with the 100 KB default ran before the route's 2 MB parser. Moved a dedicated parser above it and return a clean 413 JSON error.
- Scans were too heavy. Added client-side downscaling (600 px wide, JPEG quality 0.85): about 465 KB down to about 50 KB per upload. → `internal: true`

Judgement call (lead with this one): a move to Vercel + Supabase was proposed. I turned it down. It meant SQLite to Postgres, no persistent disk for uploads, and bank data hosted abroad, all to fix a clock-skew problem that had already gone once 2FA was rolled back and the host clock set to UTC.

Current work: moving to a custom domain alongside the existing private access, without a hard cutover.

Client name: Abokobi Rural Bank (owner approved, 5 Oct). **Never publish:** the IP address, hostnames, domain, Tailscale details, staff names, file paths or the repo link.

### 10.6 Profiles and contact
Link every profile directly. No verification needed; they are the owner's own URLs.

| Label | URL |
|-------|-----|
| Email (only address on the site) | mailto:yawnanagyamfiprempeh@proton.me |
| GitHub | https://github.com/NanaGyamfiPrempeh30 |
| GitLab | https://gitlab.com/NanaGyamfiPrempeh30 |
| LinkedIn | https://www.linkedin.com/in/yaw-gyamfi-prempeh-4042a0129 |
| Medium | https://medium.com/@yawgyamfiprempeh27 |
| X | https://x.com/y_nagprem |
| TikTok | https://www.tiktok.com/@ngp_dronelens |
| Docker Hub | https://hub.docker.com/u/yawgyamfiprem32 |
| mcp.so | https://mcp.so/server/ambient-weather-mcp/NanaGyamfiPrempeh30 |
| Glama | https://glama.ai/mcp/servers/NanaGyamfiPrempeh30/k8s-troubleshoot-mcp |

### 10.7 Certifications (from certificate PDFs)

| Name | Type | Issued | Expires | Validation no. |
|------|------|--------|---------|----------------|
| AWS Certified Solutions Architect – Associate | Certification | 8 Nov 2024 | 8 Nov 2027 | 96cc4454003848bfa20168bac6682ef9 |
| AWS Certified Cloud Practitioner | Certification | 3 Jan 2024 | **3 Jan 2027** | R7E071SDYNEQQ9GE |
| AWS Technical Essentials | **Course**, not a certification | 10 Jul 2024 | n/a | n/a |

- Each cert card links to https://aws.amazon.com/verification with the validation number shown for copy.
- Add `expires` to the schema. The build hides an expired cert automatically.
- Label Technical Essentials as "Course". Calling it a certification is the kind of thing a reviewer checks.

## 11. Decisions and open items

### 11.1 Decided (5 Oct 2026)
- CV is the only source for dates. Overlaps are labelled (Algo part-time, Bosonit contract).
- Years: 6+ in DevOps from Blue Turtle (May 2020).
- Bosonit: Traefik is the ingress controller. HAProxy is a reverse proxy on the bastion. Client is ECDC; `hello.ecdc.es` was a test domain.
- MCP server: 453 passing tests.
- GXDCH: "9 of 12 tests passing". Not 80%. Rounding 75 up to 80 is the same problem as the old 90%+.
- Email: proton.me only.
- Unsourced percentages: removed. Method in `METRICS.md`.
- Azure CV: retired.
- Public CV built: `public/cv/YNGP_CV_public.pdf` (no address, phone or referees; 453 tests; 9 of 12; Traefik ingress).
- Teaching cohort: off the site.
- Mentee, TKA role, afarmforme and Ten Forward dates, bank portal: supplied by owner.
- Clients named (owner approved): TKA Auto's & Logistics, Ten Forward International Group, Abokobi Rural Bank. Set `canNameClient: true` for these three only.
- afarmforme stack: Bootstrap, JavaScript, HTML (frontend).
- Mentoring series: 6 X posts, 18 Apr to 18 Jun 2026 (§7.5). Mentee agreed to be named (Clinton).
- Bank repo: owner has asked the bank's IT manager to make it private. Reminder built into CLAUDE.md and milestones M3/M6.
- Public CV rebuilt without unsourced percentages, fact-checked against repos and articles before the edit. Site and CV now agree.

### 11.2 Still open (launch blockers)
1. **Bank repo private?** Owner checks with the IT manager. Claude Code reminds at M3 and blocks launch at M6.
2. **`NGP-DEV` → `devops-labs`** (owner decision, 5 Oct; owner renames it). Order: (1) rename on GitHub, (2) change the link in the Pulumi Medium article to `https://github.com/NanaGyamfiPrempeh30/devops-labs/tree/Pulumi/aws-python-app`, (3) only then create the new `NGP-DEV`. Reusing the old name kills GitHub's redirect. Claude Code: check the devops-labs URL resolves before linking it.

## 12. Milestones

| # | Deliverable | Done when |
|---|-------------|-----------|
| M0 | Owner resolves §11.2 | Every item answered |
| M1 | Repo, Next.js scaffold, CI green, deployed to Vercel | Preview URL loads |
| M2 | Content schema + all verified content in `/content` | `npm run validate` passes |
| M3 | All pages built, responsive, light/dark | Manual check at 360px and 1440px. **Before starting:** remind owner to confirm the bank repo is private (CLAUDE.md) |
| M4 | Medium + GitHub data fetch | Writing page lists 11 posts |
| M5 | Accessibility, SEO, security headers | Lighthouse ≥ 95 ×4, securityheaders.com grade A |
| M6 | Launch | Custom domain (optional), LinkedIn + CV link to site. **Gate:** bank repo confirmed private |

## 13. Risks

| Risk | Mitigation |
|------|-----------|
| Inconsistent claims hurt credibility | Section 11 is a launch blocker. `verified` flag hides unchecked items. |
| Medium RSS changes or rate-limits | Static fallback list; build never fails on RSS error. |
| GitHub API limit (60 req/h unauthenticated) | Fetch once per build, cache 24 h, optional `GITHUB_TOKEN` in Vercel env. |
| TikTok embed hurts performance/privacy | Click-to-load facade. |
| Naming clients without permission | `canNameClient` defaults to false for client work until owner confirms. |
