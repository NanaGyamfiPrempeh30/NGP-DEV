export const roleLine = "DevSecOps Engineer · Kubernetes · Terraform · AWS";
export const location = "Accra, Ghana · remote";
export const cvPdf = "/cv/YNGP_CV_public.pdf";
// The /cv page and its PDF are rebuilt from the same content, so the date is the build date.
export const cvUpdated = new Date().toISOString().slice(0, 10);

export const tagline = "Each claim links to its source, or says why it can't.";

export type ProofItem = {
  label: string; // the project, shown small above the figure
  count: number; // the figure that counts up; it is printed in the HTML as well
  suffix?: string; // text straight after the figure, e.g. " of 12"
  what: string;
  internal?: boolean; // true = no public proof; the link goes to the case study that says so
  url: string;
  project: string; // shown only while this project is visible
  size: "wide" | "tall" | "small";
};

// Figures come from METRICS.md only. Each tile links to where a visitor can check it.
// No live article count: Medium's feed holds only the latest 10 posts (lib/medium.ts).
export const proofStrip: ProofItem[] = [
  {
    label: "k8s-troubleshoot-mcp",
    count: 453,
    what: "passing tests, then 6 real bugs found on a live cluster",
    url: "https://medium.com/@yawgyamfiprempeh27/i-built-a-kubernetes-mcp-server-with-453-passing-tests-then-i-pointed-it-at-a-real-cluster-e0b17bbc783b",
    project: "k8s-troubleshoot-mcp",
    size: "tall",
  },
  {
    label: "eks-karpenter-gitops-bench",
    count: 86,
    what: "AWS resources from one terraform apply",
    url: "https://medium.com/p/8bd81d4d657b",
    project: "eks-karpenter-gitops-bench",
    size: "wide",
  },
  {
    label: "IONOS cluster",
    count: 3,
    suffix: " nodes",
    what: "with 0 public IPs, and one bastion as the way in",
    url: "https://medium.com/@yawgyamfiprempeh27/i-deployed-a-production-kubernetes-cluster-on-a-european-bare-metal-cloud-85555b1fe4a8",
    project: "eu-health-kubernetes-ionos",
    size: "small",
  },
  {
    // PRD §10.2: 53 stars and 19 forks. Checked again on GitHub on 30 Oct 2026: 53 stars.
    label: "k8s-devsecops",
    count: 53,
    what: "GitHub stars, checked 30 Oct 2026",
    url: "https://github.com/NanaGyamfiPrempeh30/k8s-devsecops",
    project: "k8s-devsecops",
    size: "small",
  },
];
