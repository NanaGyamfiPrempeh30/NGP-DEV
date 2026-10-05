# METRICS.md: how numbers work on this site

Claude Code: apply these rules to every claim. Owner: use the talking points in interviews.

## The problem

The old CV had "99.9% uptime" four times and a 20 to 70% improvement on nearly every bullet. None had a baseline, a time window or a source. A senior interviewer asks one question ("how did you measure that?") and the whole CV loses trust.

## The rule

A number stays only if I can answer all four:

1. **Before:** what was it?
2. **After:** what is it now?
3. **How measured:** which tool, over what period?
4. **Proof:** a link, or I can explain it live in 30 seconds.

Missing any one? Swap the number for something countable (nodes, stages, tests, tools, apps) or describe what I built.

## Old CV numbers: verdict

| Claim | Verdict | Replace with |
|-------|---------|--------------|
| 99.9% uptime (Bosonit, Algo, TES, Tigo) | Drop | What I built to keep it up: monitoring, alerting, how access was locked down |
| Deploy time −60% / −40% / −45% | Drop unless I give minutes before and after | "7-stage pipeline: one run takes an empty IONOS project to a running cluster" |
| Attack surface −70% / −30% | Drop. You can't measure attack surface as a percentage | "Nodes have no public IPs. One way in: OpenVPN on the bastion" |
| Hosting cost −20% (Algo, Blue Turtle) | Keep only with invoice before/after | Use the EKS cost maths instead (sourced) |
| Build failures −30%, debugging −25%, env issues −35% | Drop | Name the fix ("moved builds into Docker so dev and prod match") |
| Incident resolution −30% (Tigo) | Drop | Describe the stack I ran (Apache, Nginx, MySQL on Ubuntu/CentOS/RHEL) |
| GXDCH 90%+ coverage | Replace | "9 of 12 compliance tests passing" |
| 18 property-based tests | Replace | "453 passing tests" |
| 80+ pages of docs, 6 apps, 7 stages, 16 tools | Keep | Countable and true |

## Numbers I can prove (from my own Medium posts)

These go on the site with a link. Use them in interviews when someone asks "give me a number".

| Number | Project | Source |
|--------|---------|--------|
| 453 passing tests, then 6 real bugs on a live cluster | k8s-troubleshoot-mcp | Medium, 28 Aug 2026 |
| 2 independent security layers (RBAC + namespace allowlist), shown failing closed | k8s-troubleshoot-mcp | Same |
| 86 AWS resources from one `terraform apply`, 15 to 20 min | eks-karpenter-gitops-bench | Medium, 22 Jan 2026 |
| CI 25% cheaper per minute ($0.008 vs $0.006) with double the CPU | eks-karpenter-gitops-bench | Same |
| HPA scaled 2 → 3 pods when CPU hit 76% against a 70% target | eks-karpenter-gitops-bench | Same |
| 12 platform components working together in 48 hours | k8s-devsecops | Medium, 16 Jan 2026 · 53★ repo |
| 3 nodes + 1 bastion, 0 public node IPs, MTU 1450 fix | ECDC / IONOS | Medium, 9 Jun 2026 |
| 6 debugging rounds from "works locally" to Docker Hub + mcp.so | ambient-weather-mcp | Medium, 25 May 2026 |
| 9 of 12 GXDCH compliance tests | Bosonit | Internal, explain live |

## Interview talking points

Short, in my words. Say them, don't read them.

**"You say 453 tests. Were they any good?"**
They passed, and they still missed six bugs. Every mock returned what I expected the Kubernetes client to return, not what it actually returns. Logs came back as raw bytes. A missing field came back as None, not False. Events crashed the client because real clusters send `eventTime: null`. I only found these by pointing the server at a real cluster. Now the test fixtures return real bytes, so if someone reverts the fix, ten tests fail.

**"How do you know your platform was secure?"**
I don't quote a percentage. I can tell you what was exposed. On IONOS, the nodes had no public IPs. The only way in was OpenVPN on the bastion. Traefik handled ingress inside the cluster, and HAProxy on the bastion passed TCP straight through. On the MCP server, RBAC blocks the call, and if RBAC is ever misconfigured, the namespace allowlist blocks it again. I have screenshots of both firing.

**"Did you save money anywhere?"**
On the EKS project I moved CI from GitHub-hosted runners to Tenki. Per minute it was $0.008 vs $0.006, so 25% cheaper, with 4 vCPUs instead of 2. Builds were slower because I was building for both amd64 and arm64. I'd rather show you that trade-off than a round number.

**"What about uptime?"**
I won't give you 99.9% because I didn't run a formal SLO with an error budget. What I did: Prometheus and Grafana from day one, alerts on the things that actually broke (Vault sealing, cert-manager stuck on an Order). The IONOS cluster was still running when I wrote it up.

**"Tell me about a failure."**
I locked myself out of every node on IONOS with one iptables rule on the bastion. Got back in through the IONOS remote console. Then I moved HTTPS routing to HAProxy in TCP mode, so SSH could never be affected again. Since then I keep a timestamped change log while I work. That log is how I found what broke.

## Why this is stronger

Fewer numbers, but each one survives a follow-up question. A recruiter skims "453 tests" and "86 resources". An engineer clicks the link and sees the work. Both come away trusting the rest of the page.
