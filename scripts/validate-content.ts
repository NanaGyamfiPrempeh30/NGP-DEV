import { Job } from "../content/schema";
import { jobs } from "../content/experience";

function fail(message: string): never {
  console.error(`validate: ${message}`);
  process.exit(1);
}

for (const [i, job] of jobs.entries()) {
  const result = Job.safeParse(job);
  if (!result.success) {
    fail(`jobs[${i}] (${job.company}): ${result.error.message}`);
  }
}

console.log(`validate: ${jobs.length} job(s) OK`);
