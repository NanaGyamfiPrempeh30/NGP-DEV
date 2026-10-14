export const roleLine = "DevSecOps Engineer · Kubernetes · Terraform · AWS";
export const location = "Accra, Ghana · remote";
export const cvPdf = "/cv/YNGP_CV_public.pdf";
export const cvUpdated = "2026-10-05";

export type ProofItem = {
  figure: string;
  what: string;
  source: string; // names where the figure can be checked
  url: string;
  project: string; // shown only while this project is visible
};

// Figures come from METRICS.md only. Each links to where a visitor can check it.
// GitHub stars and a live article count join at M4, when they update from their feeds.
export const proofStrip: ProofItem[] = [
  {
    figure: "453",
    what: "passing tests on k8s-troubleshoot-mcp",
    source: "Proof: Medium article",
    url: "https://medium.com/@yawgyamfiprempeh27/i-built-a-kubernetes-mcp-server-with-453-passing-tests-then-i-pointed-it-at-a-real-cluster-e0b17bbc783b",
    project: "k8s-troubleshoot-mcp",
  },
  {
    figure: "86",
    what: "AWS resources from one terraform apply",
    source: "Proof: Medium article",
    url: "https://medium.com/p/8bd81d4d657b",
    project: "eks-karpenter-gitops-bench",
  },
  {
    figure: "0",
    what: "public IPs on the 3 nodes of the ECDC cluster",
    source: "Proof: Medium article",
    url: "https://medium.com/@yawgyamfiprempeh27/i-deployed-a-production-kubernetes-cluster-on-a-european-bare-metal-cloud-85555b1fe4a8",
    project: "ecdc-kubernetes-ionos",
  },
  {
    figure: "9 of 12",
    what: "GXDCH compliance tests passing",
    // Internal claim (METRICS.md): no public link exists, so this goes to the case study that says so.
    source: "Private work: see the case study",
    url: "/projects/ecdc-kubernetes-ionos",
    project: "ecdc-kubernetes-ionos",
  },
];
