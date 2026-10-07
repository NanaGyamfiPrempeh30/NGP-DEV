import type { Metadata } from "next";
import { DraftBadge } from "@/components/DraftBadge";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilter } from "@/components/ProjectFilter";
import { Tags } from "@/components/Tags";
import { labCredit } from "@/content/labs";
import { getLabs, getOtherWork } from "@/lib/content";
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
  const other = getOtherWork();

  return (
    <>
      <h1>Projects</h1>
      {projects.length > 0 ? <h2>Case studies</h2> : null}
      {projects.length > 0 ? (
        <ProjectFilter>
          <ul role="list" className="cards">
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
          <ul role="list" className="cards">
            {labs.map((lab) => (
              <li className="card" key={lab.slug}>
                <h3>{lab.title}</h3>
                <p>
                  {labCredit(lab)}.{" "}
                  {lab.credit.url ? <a href={lab.credit.url}>See the original</a> : null}
                </p>
                <p>{lab.summary}</p>
                <p className="meta">Started {formatDate(lab.start)}</p>
                <Tags items={lab.stack} max={5} />
                <ul role="list" className="links">
                  {lab.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} aria-label={`${link.label}: ${lab.title}`}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <DraftBadge verified={lab.verified} />
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {other.length > 0 ? (
        <>
          <h2>Other work</h2>
          <p>Smaller projects. Each has code or an article, but no case study.</p>
          <ul role="list" className="cards">
            {other.map((work) => (
              <li className="card" key={work.slug}>
                <h3>{work.title}</h3>
                <p>{work.summary}</p>
                <p className="meta">Started {formatDate(work.start)}</p>
                <Tags items={work.stack} max={5} />
                <ul role="list" className="links">
                  {work.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} aria-label={`${link.label}: ${work.title}`}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <DraftBadge verified={work.verified} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}
