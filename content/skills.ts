// The owner's own skill lists, word for word from the CV the owner wrote (PDF of 13 Oct 2026).
// Keep them as written; the owner decides what is on them.
export const skills: { group: string; items: string }[] = [
  { group: "Container Orchestration", items: "Kubernetes (kubeadm, kubectl, Helm), Docker, Calico CNI, MetalLB, KEDA" },
  { group: "Infrastructure as Code", items: "Terraform, Ansible, CloudFormation, Azure Resource Manager" },
  { group: "CI/CD & GitOps", items: "GitHub Actions, Jenkins, GitLab CI/CD, Azure DevOps Pipelines, ArgoCD" },
  { group: "Cloud Platforms", items: "AWS (EC2, S3, IAM, Lambda, EKS), IONOS Cloud, Google Cloud, Heroku, Azure" },
  { group: "Monitoring & Observability", items: "Prometheus, Grafana, AlertManager, Loki, Promtail, ELK Stack" },
  {
    group: "Security & Secrets Management",
    items: "HashiCorp Vault, External Secrets Operator, cert-manager, RBAC, Network Policies",
  },
  { group: "Ingress & Networking", items: "Traefik, HAProxy, Nginx, Apache, Let's Encrypt, TLS/SSL" },
  { group: "Programming & Scripting", items: "Python, Bash, JavaScript/TypeScript, Node.js" },
  { group: "Databases", items: "PostgreSQL, MySQL, MongoDB, Redis" },
  { group: "Operating Systems", items: "Linux (Ubuntu, CentOS, RHEL), Windows Server" },
];

export const languages = ["English: Fluent"];
