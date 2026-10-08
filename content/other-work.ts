import type { OtherWork } from "./schema";

// Small projects with no debugging story to tell. Card only, no case study.
export const otherWork: OtherWork[] = [
  {
    slug: "py-guardian-ops",
    title: "py-guardian-ops",
    summary: "FastAPI app deployed to Azure Container Apps by GitHub Actions, with Trivy image scans.",
    start: "2025-09",
    startSource: "first-commit",
    stack: ["FastAPI", "Azure Container Apps", "GitHub Actions", "Trivy"],
    links: [
      { label: "Repo", url: "https://github.com/NanaGyamfiPrempeh30/py-guardian-ops" },
      {
        label: "Article",
        url: "https://medium.com/@yawgyamfiprempeh27/deploy-a-fastapi-app-to-azure-container-apps-using-github-actions-complete-ci-cd-guide-5ef253cafbba",
      },
    ],
    verified: false,
  },
];
