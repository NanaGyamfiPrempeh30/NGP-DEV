import type { Lab } from "./schema";

// Practice labs: I followed another author's project and ran it myself.
// Every card credits the author. No claims beyond what my commits show.
export const labs: Lab[] = [
  {
    slug: "devsecops-three-tier-eks",
    title: "DevSecOps three-tier project on EKS",
    credit: {
      author: "Aman Pathak",
      url: "https://github.com/AmanPathak-DevOps/End-to-End-Kubernetes-Three-Tier-DevSecOps-Project",
    },
    summary:
      "My commits moved the code to GitLab, pointed both Jenkins pipelines at the new repos and swapped in my own Terraform state bucket, lock table and key pair.",
    start: "2024-08",
    startSource: "first-commit",
    stack: ["EKS", "Terraform", "Jenkins", "GitLab"],
    links: [
      { label: "My copy: app", url: "https://gitlab.com/NanaGyamfiPrempeh30/DevSecop" },
      { label: "My copy: EKS Terraform", url: "https://gitlab.com/NanaGyamfiPrempeh30/eks-terraform-gitlab" },
      {
        label: "Article",
        url: "https://medium.com/@yawgyamfiprempeh27/deploying-an-advanced-comprehensive-end-to-end-devsecops-kubernetes-three-tier-project-a18003741d0a",
      },
    ],
    verified: false,
  },
  {
    slug: "on-premise-to-multi-cloud",
    title: "On-premise to multi-cloud migration",
    // TODO(owner): original author and source link.
    credit: { author: "TODO(owner)" },
    summary:
      "My branch holds the Terraform files, the MySQL dump and the Kubernetes manifests I used to run it on AWS and Google Cloud.",
    start: "2024-06",
    startSource: "first-commit",
    stack: ["Terraform", "Kubernetes", "MySQL"],
    links: [
      { label: "My copy", url: "https://gitlab.com/NanaGyamfiPrempeh30/Devops/-/tree/Multi-Cloud" },
      {
        label: "Article",
        url: "https://medium.com/@yawgyamfiprempeh27/step-by-step-guide-to-migrating-an-on-premise-web-application-to-a-multi-cloud-environment-using-bd35f73fe86e",
      },
    ],
    verified: false,
  },
];

export function labCredit(lab: Lab): string {
  return `Followed ${lab.credit.author}'s project; deployed and run by me`;
}
