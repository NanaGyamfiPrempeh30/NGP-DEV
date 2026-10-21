import Link from "next/link";
import type { LoadedProject } from "@/lib/projects";
import { DraftBadge } from "./DraftBadge";
import { Tags } from "./Tags";

const kindLabel = { work: "Work", client: "Client", "open-source": "Open source" } as const;

export function ProjectCard({ project }: { project: LoadedProject }) {
  const proof = project.links[0];
  return (
    <li className="card-slot" data-kind={project.kind} data-reveal>
      <article className="card">
        <p className="label">
          {kindLabel[project.kind]}
          {project.kind === "client" && !project.canNameClient && project.clientLabel
            ? `, ${project.clientLabel}`
            : ""}
        </p>
        <h3>
          <Link className="card-link" href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>
        <p>{project.outcome}</p>
        <Tags items={project.stack} max={5} />
        <div className="card-foot">
          <span className="go" aria-hidden="true">
            Read the case study
          </span>
          {proof ? (
            <a className="proof-link" href={proof.url} aria-label={`Proof, ${proof.label}: ${project.title}`}>
              Proof: {proof.label}
            </a>
          ) : null}
        </div>
        <DraftBadge verified={project.verified} />
      </article>
    </li>
  );
}
