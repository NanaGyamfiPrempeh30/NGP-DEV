export type ArticleFallback = {
  title: string;
  url: string;
  date: string; // ISO date
  tags: string[];
};

const base = "https://medium.com/@yawgyamfiprempeh27";

// Static copy of the Medium feed (read 5 Oct 2026), merged with RSS and de-duplicated by URL.
// Keeps the Writing page complete when the feed fails or drops older posts (PRD §7.4).
// De-duplicate with mediumPostId, not the full URL: the EKS post is linked by its
// short /p/ URL because its title (and slug) changed.
export const articlesFallback: ArticleFallback[] = [
  {
    title: "I Built a Kubernetes MCP Server With 453 Passing Tests. Then I Pointed It at a Real Cluster.",
    url: `${base}/i-built-a-kubernetes-mcp-server-with-453-passing-tests-then-i-pointed-it-at-a-real-cluster-e0b17bbc783b`,
    date: "2026-08-28",
    tags: ["devops-or-devsecops", "software-testing", "python", "model-context-protocol", "kubernetes"],
  },
  {
    title: "I Deployed a Production Kubernetes Cluster on a European Bare-Metal Cloud.",
    url: `${base}/i-deployed-a-production-kubernetes-cluster-on-a-european-bare-metal-cloud-85555b1fe4a8`,
    date: "2026-06-09",
    tags: ["observability", "baremetal", "kubernetes", "gitops", "networking"],
  },
  {
    title: "I Published My First MCP Server to Docker Hub and mcp.so. Here’s What Actually Happened.",
    url: `${base}/i-published-my-first-mcp-server-to-docker-hub-and-mcp-so-heres-what-actually-happened-1f26665f9ec1`,
    date: "2026-05-25",
    tags: ["mcps", "python", "devops", "docker", "ai"],
  },
  {
    title: "EKS + Karpenter + ArgoCD: From Zero to Production GitOps with 25% Cheaper CI/CD Pipelines—Here’s…",
    url: "https://medium.com/p/8bd81d4d657b",
    date: "2026-01-22",
    tags: [],
  },
  {
    title: "I Built a Production-Grade Kubernetes Platform in 48 Hours.",
    url: `${base}/i-built-a-production-grade-kubernetes-platform-in-48-hours-db5629fba0e3`,
    date: "2026-01-16",
    tags: [],
  },
  {
    title: "Deploy a FastAPI App to Azure Container Apps Using GitHub Actions — Complete CI/CD Guide",
    url: `${base}/deploy-a-fastapi-app-to-azure-container-apps-using-github-actions-complete-ci-cd-guide-5ef253cafbba`,
    date: "2025-10-19",
    tags: [],
  },
  {
    title: "Deploying a Serverless Flask Application on AWS with Pulumi",
    url: `${base}/deploying-a-serverless-flask-application-on-aws-with-pulumi-3e82075f1233`,
    date: "2025-07-12",
    tags: [],
  },
  {
    title: "Deploying Blue/Green Strategies Using AWS CI/CD Workflows on Amazon Elastic Container Service —…",
    url: `${base}/deploying-blue-green-strategies-using-aws-ci-cd-workflows-on-amazon-elastic-container-service-fc186b739566`,
    date: "2025-03-13",
    tags: [],
  },
  {
    title: "Deploying an Advanced Comprehensive End-To-End DevSecOps Kubernetes Three-Tier Project using AWS…",
    url: `${base}/deploying-an-advanced-comprehensive-end-to-end-devsecops-kubernetes-three-tier-project-a18003741d0a`,
    date: "2024-09-27",
    tags: [],
  },
  {
    title: "Step-by-Step Guide to Migrating an On-Premise Web Application to a Multi-Cloud Environment Using…",
    url: `${base}/step-by-step-guide-to-migrating-an-on-premise-web-application-to-a-multi-cloud-environment-using-bd35f73fe86e`,
    date: "2024-06-07",
    tags: [],
  },
  {
    title: "Automating AWS Infrastructure with Python, Terraform, and Boto3: A Step-by-Step Guide",
    url: `${base}/automating-aws-infrastructure-with-python-terraform-and-boto3-a-step-by-step-guide-ee638a277984`,
    date: "2024-06-04",
    tags: [],
  },
];

// Medium post ID: the hex string that ends every post URL, whatever its form.
export function mediumPostId(url: string): string | null {
  const match = new URL(url).pathname.match(/([0-9a-f]{10,12})$/);
  return match?.[1] ?? null;
}
