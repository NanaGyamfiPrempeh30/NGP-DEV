import type { Job } from "@/content/schema";
import { formatRange } from "@/lib/dates";
import { Claims } from "./Claims";
import { Tags } from "./Tags";

const typeLabel = { "full-time": "Full-time", "part-time": "Part-time", contract: "Contract" } as const;
const modeLabel = { remote: "Remote", hybrid: "Hybrid", onsite: "On site" } as const;

export function JobEntry({ job }: { job: Job }) {
  const facts = [job.type ? typeLabel[job.type] : null, modeLabel[job.mode], job.country].filter(Boolean);
  return (
    <li className="entry">
      <p className="when">{formatRange(job.start, job.end)}</p>
      <div>
        <h3>
          {job.title}, {job.company}
        </h3>
        <p className="meta">{facts.join(", ")}</p>
        <Claims claims={job.claims} />
        <Tags items={job.stack} />
      </div>
    </li>
  );
}
