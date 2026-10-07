import type { Metadata } from "next";
import { DraftBadge } from "@/components/DraftBadge";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilter } from "@/components/ProjectFilter";
import { Tags } from "@/components/Tags";
import { labCredit } from "@/content/labs";
import { getLabs } from "@/lib/content";
import { formatDate } from "@/lib/dates";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Work, client and open source projects by Yaw Nana Gyamfi Prempeh, each with links to proof.",
};

export default function Projects() {
  const projects = getProjects().sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.start.localeCompare(a.start),
  );
  const labs = getLabs();

  return (
    <>
      <h1>Projects</h1>
      {projects.length > 0 ? (
        <ProjectFilter>
          <ul className="cards">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </ul>
        </ProjectFilter>
      ) : (
        <p>
          Project pages are being fact-checked and will appear here. Until then, the code is on{" "}
          <a href="https://github.com/NanaGyamfiPrempeh30">GitHub</a>.
        </p>
      )}

      {labs.length > 0 ? (
        <>
          <h2>Practice labs</h2>
          <p>These are other people&apos;s projects. I followed them and ran them myself to learn.</p>
          <ul className="cards">
            {labs.map((lab) => (
              <li className="card" key={lab.slug}>
                <h3>{lab.title}</h3>
                <p>
                  {labCredit(lab)}.{" "}
                  {lab.credit.url ? <a href={lab.credit.url}>See the original</a> : null}
                </p>
                <p>{lab.summary}</p>
                {lab.note ? (
                  <p className="meta">
                    {lab.note.label} <a href={lab.note.url}>Google&apos;s notice</a>
                  </p>
                ) : null}
                <p className="meta">Started {formatDate(lab.start)}</p>
                <Tags items={lab.stack} max={5} />
                <ul className="links">
                  {lab.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url}>{link.label}</a>
                    </li>
                  ))}
                </ul>
                <DraftBadge verified={lab.verified} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}
