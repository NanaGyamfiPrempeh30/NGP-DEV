import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Claims } from "@/components/Claims";
import { DraftBadge } from "@/components/DraftBadge";
import { Tags } from "@/components/Tags";
import { formatDate, formatRange } from "@/lib/dates";
import { getProjects, type LoadedProject } from "@/lib/projects";
import { slugify } from "@/lib/slug";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjects().find((p) => p.slug === slug);
  return project
    ? { title: project.title, description: project.outcome, alternates: { canonical: `/projects/${slug}` } }
    : {};
}

function when(project: LoadedProject): string {
  if (project.startSource === "article") return `Published ${formatDate(project.start)}`;
  if (project.end) return formatRange(project.start, project.end);
  return `Started ${formatDate(project.start)}`;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjects().find((p) => p.slug === slug);
  if (!project) notFound();
  const { default: Body } = await import(`@/content/projects/${slug}.mdx`);

  const sections = [...project.body.matchAll(/^## (.+)$/gm)].map((match) => match[1] ?? "");

  return (
    <article>
      <p>
        <Link href="/projects">All projects</Link>
      </p>
      <h1>{project.title}</h1>
      <p className="lede">{project.outcome}</p>
      <p className="label">
        {project.role}. {when(project)}.
        {project.kind === "client" && !project.canNameClient && project.clientLabel
          ? ` Client: ${project.clientLabel}.`
          : ""}
      </p>
      <Tags items={project.stack} />
      <DraftBadge verified={project.verified} />

      <div className="study">
        <nav className="toc" aria-label="On this page">
          <p className="label">On this page</p>
          <ol role="list">
            {project.claims.length > 0 ? (
              <li>
                <a href="#proof">What I can prove</a>
              </li>
            ) : null}
            {sections.map((title) => (
              <li key={title}>
                <a href={`#${slugify(title)}`}>{title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {project.claims.length > 0 ? (
            <>
              <h2 id="proof" style={{ marginTop: 0 }}>
                What I can prove
              </h2>
              <Claims claims={project.claims} />
            </>
          ) : null}

          <div className="prose">
            <Body />
          </div>
        </div>
      </div>
    </article>
  );
}
