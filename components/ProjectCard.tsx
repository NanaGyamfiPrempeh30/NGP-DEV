import Link from "next/link";
import type { LoadedProject } from "@/lib/projects";
import { DraftBadge } from "./DraftBadge";
import { Tags } from "./Tags";

const kindLabel = { work: "Work", client: "Client", "open-source": "Open source" } as const;

export function ProjectCard({ project }: { project: LoadedProject }) {
  return (
    <li className="card" data-kind={project.kind}>
      <p className="meta">
        {kindLabel[project.kind]}
        {project.kind === "client" && !project.canNameClient && project.clientLabel
          ? `, ${project.clientLabel}`
          : ""}
      </p>
      <h3>
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <p>{project.outcome}</p>
      <Tags items={project.stack} max={5} />
      {project.links.length > 0 ? (
        <ul className="links">
          {project.links.map((link) => (
            <li key={link.url}>
              <a href={link.url}>{link.label}</a>
            </li>
          ))}
        </ul>
      ) : null}
      <DraftBadge verified={project.verified} />
    </li>
  );
}
