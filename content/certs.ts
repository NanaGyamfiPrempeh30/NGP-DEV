import type { Cert } from "./schema";

// Source: certificate PDFs, PRD §10.7. Expired certs are hidden at build.
const verifyUrl = "https://aws.amazon.com/verification";

export const certs: Cert[] = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    type: "certification",
    issued: "2024-11-08",
    expires: "2027-11-08",
    validationNo: "96cc4454003848bfa20168bac6682ef9",
    verifyUrl,
  },
  {
    name: "AWS Certified Cloud Practitioner",
    type: "certification",
    issued: "2024-01-03",
    expires: "2027-01-03",
    validationNo: "R7E071SDYNEQQ9GE",
    verifyUrl,
  },
  {
    name: "AWS Technical Essentials",
    type: "course",
    issued: "2024-07-10",
  },
];
