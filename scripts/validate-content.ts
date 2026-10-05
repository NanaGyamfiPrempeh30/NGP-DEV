import { Cert, Job } from "../content/schema";
import { jobs } from "../content/experience";
import { certs } from "../content/certs";

function fail(message: string): never {
  console.error(`validate: ${message}`);
  process.exit(1);
}

function warn(message: string) {
  console.warn(`validate: warning: ${message}`);
}

for (const [i, job] of jobs.entries()) {
  const result = Job.safeParse(job);
  if (!result.success) {
    fail(`jobs[${i}] (${job.company}): ${result.error.message}`);
  }
  // PRD §7.2: at most one internal claim per job.
  if (job.claims.filter((c) => c.internal).length > 1) {
    fail(`jobs[${i}] (${job.company}): more than 1 internal claim`);
  }
  if (!job.verified) {
    warn(`${job.company} is verified: false and will be hidden in production`);
  }
}

// PRD §7.2: overlapping jobs need a "Part-time" or "Contract" label. Dates are "YYYY-MM".
for (const [i, a] of jobs.entries()) {
  for (const b of jobs.slice(i + 1)) {
    const overlaps = a.start <= (b.end ?? "9999-12") && b.start <= (a.end ?? "9999-12");
    if (overlaps && a.type === "full-time" && b.type === "full-time") {
      warn(`${a.company} and ${b.company} overlap with no part-time or contract label`);
    }
  }
}

for (const [i, cert] of certs.entries()) {
  const result = Cert.safeParse(cert);
  if (!result.success) {
    fail(`certs[${i}] (${cert.name}): ${result.error.message}`);
  }
}

console.log(`validate: ${jobs.length} job(s), ${certs.length} cert(s) OK`);
