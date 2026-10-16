export const roleLine = "DevSecOps Engineer · Kubernetes · Terraform · AWS";
export const location = "Accra, Ghana · remote";
export const cvPdf = "/cv/YNGP_CV_public.pdf";
export const cvUpdated = "2026-10-05";

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
// GitHub stars and a live article count join at M4, when they update from their feeds.
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
    label: "ECDC on IONOS",
    count: 3,
    suffix: " nodes",
    what: "with 0 public IPs, and one bastion as the way in",
    url: "https://medium.com/@yawgyamfiprempeh27/i-deployed-a-production-kubernetes-cluster-on-a-european-bare-metal-cloud-85555b1fe4a8",
    project: "ecdc-kubernetes-ionos",
    size: "small",
  },
  {
    label: "ECDC, GXDCH",
    count: 9,
    suffix: " of 12",
    what: "compliance tests passing",
    internal: true,
    url: "/projects/ecdc-kubernetes-ionos",
    project: "ecdc-kubernetes-ionos",
    size: "small",
  },
];
