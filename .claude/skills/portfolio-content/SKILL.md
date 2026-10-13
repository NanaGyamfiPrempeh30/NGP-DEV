---
name: portfolio-content
description: Add, edit or fact-check a job, project, article, mentoring or hobby entry on NGP-Dev's portfolio site. Use whenever content in /content changes or the owner says "add this project", "update my experience", "check my CV".
---

# Portfolio content

Turns raw info from the owner into a verified, schema-valid entry in `/content`. The site is an online CV, so a wrong fact costs an interview. Accuracy beats speed.

## Steps

1. **Collect.** Get from the owner: what, when (month + year), role, stack, outcome, links. If any is missing, ask. Max 3 questions per message. Short.

2. **Cross-check.** Compare against:
   - `content/experience.ts` and existing projects (dates, titles must match)
   - `public/cv/YNGP_CV_public.pdf` (CV is the only source for job dates; LinkedIn is not)
   - The linked repo README and Medium article (fetch them)
   If two sources disagree, stop and show the owner both versions in a 2-row table. Don't pick one yourself.

3. **Check every claim.**
   - Has a number? Apply the 4-question test in `METRICS.md` (before, after, how measured, proof). Fail = replace with something countable or drop it. Pass = `evidence` link or `internal: true`.
   - Stack tags: only tools that appear in the repo or article, or the owner confirms.
   - Overlapping dates with another job? Set `type` to part-time or contract.
   - Client named? Only if owner says the client agreed. Else `canNameClient: false` and a generic `clientLabel` ("Rural bank, Ghana").

4. **Write.** Projects go in `content/projects/<slug>.mdx` with frontmatter matching `Project` in `content/schema.ts`. The YAML block sits inside an MDX comment: the file starts with `{/*` and the block ends with `*/}` (not `---`), so the MDX compiler skips it. Body sections, in order:
   - Context
   - Problem
   - What I built
   - How it works (diagram if useful)
   - What broke and how I fixed it (required)
   - Result
   - Links
   Keep each section under 120 words. British English.

5. **Humanize.** Run the copy through the `ngp-humanizer` skill. Remove buzzwords, filler and inflated claims. Keep facts unchanged.

6. **Mark status.** Set `verified: true` only after the owner confirms every fact in this entry. Otherwise `verified: false` (hidden in production).

7. **Validate.** Run `pnpm validate && pnpm build`. Fix errors in the content, never in the schema.

8. **Report.** Tell the owner in 3 bullets max: what was added, what's still `TODO(owner)`, any conflict found.

## Never
- Invent dates, metrics, client names or outcomes.
- Copy text from Medium articles onto the site. Summarise in new words and link the article.
- Publish address, phone, referee contacts or anything marked confidential.
- Round numbers up ("9 of 12" is not "90%+").

## Example frontmatter
```yaml
slug: k8s-troubleshoot-mcp
title: Kubernetes Troubleshooting MCP Server
kind: open-source
featured: true
role: Sole developer
start: "2026-06"
end: "2026-08"
stack: [Python, MCP, Kubernetes, RBAC, Hypothesis, Docker]
outcome: Lets AI assistants read cluster state safely, with RBAC as the hard boundary.
claims:
  - text: "16 read-only diagnostic tools, zero write verbs in the ServiceAccount"
    evidence: { label: Repo, url: "https://github.com/NanaGyamfiPrempeh30/k8s-troubleshoot-mcp" }
  - text: "453 tests, then 6 real bugs found against a live cluster"
    evidence: { label: Article, url: "https://medium.com/@yawgyamfiprempeh27/i-built-a-kubernetes-mcp-server-with-453-passing-tests-then-i-pointed-it-at-a-real-cluster-e0b17bbc783b" }
links:
  - { label: Repo, url: "https://github.com/NanaGyamfiPrempeh30/k8s-troubleshoot-mcp" }
verified: false   # owner to confirm start date
```
