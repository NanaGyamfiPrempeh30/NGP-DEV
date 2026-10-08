import { articlesFallback } from "./articles";

export const roleLine = "DevSecOps Engineer · Kubernetes · Terraform · AWS";
export const location = "Accra, Ghana · remote";
export const cvPdf = "/cv/YNGP_CV_public.pdf";
export const cvUpdated = "2026-10-05";

export type ProofItem = {
  text: string;
  url: string;
  project?: string; // shown only while this project is visible
};

// Each item repeats a claim that already has evidence in /content. GitHub stars join at M4.
export const proofStrip: ProofItem[] = [
  {
    text: "453 passing tests on k8s-troubleshoot-mcp",
    url: "https://medium.com/@yawgyamfiprempeh27/i-built-a-kubernetes-mcp-server-with-453-passing-tests-then-i-pointed-it-at-a-real-cluster-e0b17bbc783b",
    project: "k8s-troubleshoot-mcp",
  },
  {
    text: "86 AWS resources from one terraform apply",
    url: "https://medium.com/p/8bd81d4d657b",
    project: "eks-karpenter-gitops-bench",
  },
  {
    text: "16 read-only tools in my Kubernetes MCP server",
    url: "https://github.com/NanaGyamfiPrempeh30/k8s-troubleshoot-mcp",
    project: "k8s-troubleshoot-mcp",
  },
  {
    text: `${articlesFallback.length} Medium articles`,
    url: "https://medium.com/@yawgyamfiprempeh27",
  },
];
