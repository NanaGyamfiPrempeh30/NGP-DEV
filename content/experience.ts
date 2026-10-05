import type { Job } from "./schema";

// Source: public/cv/YNGP_CV_public.pdf and PRD §10.1. The CV is the only source for dates.
export const headline = "6+ years in DevOps (since 2020). Linux engineering since 2019.";

const ionosArticle = {
  label: "Article",
  url: "https://medium.com/@yawgyamfiprempeh27/i-deployed-a-production-kubernetes-cluster-on-a-european-bare-metal-cloud-85555b1fe4a8",
};

export const jobs: Job[] = [
  {
    company: "Bosonit",
    country: "Spain",
    mode: "hybrid",
    type: "contract",
    title: "DevSecOps Engineer",
    start: "2025-11",
    end: "2026-01",
    // PRD §10.1 approves 9 claims; §7.2 caps a job at 5 with 1 internal.
    // The other 4 (cert-manager, Tractus-X EDC, GXDCH 9 of 12, 80+ pages of docs)
    // go on the ECDC project page (owner approved the split, 5 Oct 2026).
    claims: [
      {
        text: "Built ECDC's compliance platform cluster on IONOS Cloud from scratch with Terraform and Ansible. Sole DevSecOps engineer.",
        evidence: ionosArticle,
        internal: false,
      },
      {
        text: "Locked access down: 3 nodes, no public IPs, one bastion running OpenVPN as the only way in.",
        evidence: ionosArticle,
        internal: false,
      },
      {
        text: "Traefik ingress behind MetalLB. HAProxy in TCP mode on the bastion as reverse proxy to the nodes.",
        evidence: ionosArticle,
        internal: false,
      },
      {
        text: "Vault on NFS with External Secrets Operator, ArgoCD, KEDA, Prometheus and Grafana.",
        evidence: ionosArticle,
        internal: false,
      },
      {
        text: "7-stage Azure DevOps pipeline: provision, bootstrap, deploy.",
        internal: true,
      },
    ],
    stack: [
      "Kubernetes",
      "IONOS Cloud",
      "Terraform",
      "Ansible",
      "Traefik",
      "MetalLB",
      "HAProxy",
      "OpenVPN",
      "Vault",
      "External Secrets Operator",
      "ArgoCD",
      "KEDA",
      "Prometheus",
      "Grafana",
      "Azure DevOps",
    ],
    verified: true,
  },
  {
    company: "Algo AI",
    country: "Canada",
    mode: "remote",
    type: "part-time",
    title: "Lead DevOps Engineer",
    start: "2025-08",
    end: "2025-10",
    claims: [
      {
        text: "Deployed and ran 6 full-stack apps (Vue, TypeScript, Node, Python/FastAPI) on Heroku.",
        internal: true,
      },
      {
        text: "Built the GitHub Actions CI/CD for those apps.",
        internal: false,
      },
    ],
    stack: ["GitHub Actions", "Heroku", "Vue", "TypeScript", "Node.js", "Python", "FastAPI"],
    verified: true,
  },
  {
    company: "Technology Excellence Services",
    country: "USA",
    mode: "remote",
    type: "full-time",
    title: "DevOps Engineer",
    start: "2022-05",
    end: "2026-03",
    claims: [
      {
        text: "Automated build, test and deploy workflows with Jenkins and GitLab CI/CD.",
        internal: false,
      },
      {
        text: "Monitored system performance and resource use with Prometheus and Grafana.",
        internal: false,
      },
      {
        text: "Provisioned infrastructure with Terraform and Ansible, so development, staging and production were built the same way.",
        internal: false,
      },
      {
        text: "Set up access controls, vulnerability management and compliance checks.",
        internal: false,
      },
      {
        text: "Managed version control, branching and deployment history in Git.",
        internal: false,
      },
    ],
    stack: ["Jenkins", "GitLab CI/CD", "Prometheus", "Grafana", "Terraform", "Ansible", "Git"],
    verified: true,
  },
  {
    company: "Blue Turtle Technologies",
    country: "South Africa",
    mode: "remote",
    type: "full-time",
    title: "Platform Infrastructure Engineer",
    start: "2020-05",
    end: "2022-04",
    claims: [
      {
        text: "Designed and maintained cloud infrastructure.",
        internal: false,
      },
      {
        text: "Provisioned and managed resources across AWS and Google Cloud.",
        internal: false,
      },
      {
        text: "Wrote infrastructure as code with Terraform and CloudFormation to replace manual provisioning.",
        internal: false,
      },
      {
        text: "Managed access controls, encryption and threat detection.",
        internal: false,
      },
      {
        text: "Mentored team members.",
        internal: false,
      },
    ],
    stack: ["AWS", "Google Cloud", "Terraform", "CloudFormation"],
    verified: true,
  },
  {
    company: "Millicom Tigo",
    country: "Ghana",
    mode: "onsite",
    // TODO(owner): employment type (full-time or part-time). Left out until confirmed.
    title: "Linux System Engineer",
    start: "2019-02",
    end: "2020-03",
    claims: [
      {
        text: "Ran Linux servers on Ubuntu, CentOS and RHEL.",
        internal: false,
      },
      {
        text: "Installed, configured and fixed Linux services: Apache, Nginx and MySQL.",
        internal: false,
      },
      {
        text: "Set up firewalls and intrusion detection.",
        internal: false,
      },
      {
        text: "Documented system configurations and procedures.",
        internal: false,
      },
    ],
    stack: ["Linux", "Ubuntu", "CentOS", "RHEL", "Apache", "Nginx", "MySQL"],
    verified: true,
  },
];

export type SideWork = {
  name: string;
  role: string;
  label: "Freelance" | "Side project";
  start: string;
  end?: string; // omit = ongoing
  summary: string;
  stack: string[];
};

// Freelance and side work overlaps the full-time jobs, so each entry carries a label (PRD §10.1).
export const sideWork: SideWork[] = [
  {
    name: "Ten Forward International Group",
    role: "Freelance IT administrator",
    label: "Freelance",
    start: "2020",
    summary: "GoDaddy domains, email accounts, Microsoft 365 and the company website.",
    stack: ["GoDaddy", "Microsoft 365"],
  },
  {
    name: "afarmforme",
    role: "Tech engineer",
    label: "Side project",
    start: "2021-05",
    end: "2022-02",
    summary:
      "Platform where clients invest in a crop; the team farms it and the client takes the harvest. Built the frontend. Ended when investment stopped.",
    stack: ["Bootstrap", "JavaScript", "HTML"],
  },
];

export const education = {
  degree: "BSc Information Technology",
  school: "Ghana Communication Technology College",
  location: "Tesano, Accra",
  start: "2012",
  end: "2015",
};
