# CLAUDE.md

Portfolio site for Yaw Nana Gyamfi Prempeh (NGP-Dev), DevSecOps engineer, Accra.
Spec: `PRD.md`. Numbers policy: `METRICS.md`. Read both before any task. If this file and the PRD disagree, the PRD wins; tell me.

## How to work with me
- I'm dyslexic. Keep chat replies short. Bullets, not walls of text. Say what you did and what's next.
- Be blunt. If my idea is weak, say why and give a better one.
- Ask before: adding a dependency, adding a paid service, changing the content schema, or publishing anything about a client.
- British English in all site copy.

## Stack
- Next.js 16 (App Router), TypeScript `strict`, Tailwind CSS, MDX, Zod.
- Hosting: Vercel Hobby. CI: GitHub Actions. Package manager: pnpm.
- Before installing, check current versions (`npm view next version`). Use the latest patched 16.x.
- Free tier only. Nothing that needs a credit card.

## Commands
```bash
pnpm dev           # local server
pnpm lint          # eslint
pnpm typecheck     # tsc --noEmit
pnpm test          # vitest
pnpm validate      # zod-check everything in /content
pnpm build         # production build (runs validate first)
```
Run `lint`, `typecheck`, `validate` and `build` before you say a task is done.

## Structure
```
app/                 routes (see PRD §6)
components/          UI, one component per file
content/             experience.ts, projects/*.mdx, articles.ts, mentoring.ts, schema.ts
lib/                 medium.ts (RSS), github.ts (stars), seo.ts
public/cv/           YNGP_CV_public.pdf (no address/phone/referees)
.github/workflows/   ci.yml
.claude/skills/      portfolio-content/SKILL.md
```

## Hard rules
1. **No invented facts.** Never write a date, number, title, client name or outcome that isn't in `/content` or given by me in chat. If something is missing, leave a `TODO(owner):` and tell me.
2. **Every number needs proof** (rules in `METRICS.md`). A claim containing a digit needs `evidence` or `internal: true`. The schema enforces this. Don't weaken the schema to pass a build.
3. **`verified: false` never ships.** Production build hides it.
4. **Clients stay anonymous by default** (`canNameClient: false`).
5. **No personal data in the repo:** no address, phone, referee emails, API keys. Only email shown: yawnanagyamfiprempeh@proton.me. gitleaks runs in CI.
6. **Copy style:** run every piece of site copy through the `ngp-humanizer` skill. No buzzwords ("results-driven", "leverage", "seamless", "cutting-edge"). Short sentences. Active voice. Plain words.
7. **Design:** load the UI/UX plugin and the `frontend-design` skill before building any page. Check `/plugin` for the exact name.
8. **Accessibility is not optional:** WCAG 2.2 AA, 18px body text min, line height 1.6, max 70ch, no justified text. Test keyboard nav on every page.
9. **Performance budget:** Home page JS < 100 KB gzipped. Server components by default; `"use client"` only when needed. Images through `next/image`.
10. **Third-party embeds** (TikTok) use a click-to-load facade.

## Owner reminders (do not skip)
- **Bank repo check.** Before you start M3 (building pages), and again before you write the Abokobi Rural Bank project page, stop and tell me: "Check with Bismark that `ysamuel73-cloud/aacb-issue-portal` is now private." Wait for my answer. If it's still public, build the page but don't merge it.
- **Launch gate (M6):** don't deploy to production until I confirm that repo is private.

## Data sources
- Medium RSS: `https://medium.com/feed/@yawgyamfiprempeh27`, revalidate 86400. Merge with `content/articles.ts`. Never fail the build on fetch error.
- GitHub: `https://api.github.com/repos/NanaGyamfiPrempeh30/{repo}`, cached 24 h. Optional `GITHUB_TOKEN` env var.

## Git
- Conventional commits (`feat:`, `fix:`, `content:`, `chore:`).
- One feature per branch. PR to `main`. CI must be green.

## Adding or editing content
Use the `portfolio-content` skill in `.claude/skills/`. It has the fact-check steps.
