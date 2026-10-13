import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { headline } from "@/content/experience";
import { cvPdf, location, proofStrip, roleLine } from "@/content/home";
import { email } from "@/content/profiles";
import { getArticles } from "@/lib/content";
import { formatDate } from "@/lib/dates";
import { getProjects } from "@/lib/projects";

export default function Home() {
  const projects = getProjects();
  const slugs = new Set(projects.map((p) => p.slug));
  const proof = proofStrip.filter((item) => !item.project || slugs.has(item.project));
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const articles = getArticles().slice(0, 2);

  return (
    <>
      <h1>Yaw Nana Gyamfi Prempeh</h1>
      <p className="lede">{roleLine}</p>
      <p className="meta">{location}</p>
      <p>{headline}</p>
      <p>Every claim on this site links to its proof.</p>

      <div className="actions">
        <a href={cvPdf}>Download CV</a>
        <a href={`mailto:${email}`}>Email me</a>
        <a href="https://github.com/NanaGyamfiPrempeh30">GitHub</a>
      </div>

      <h2>Check these first</h2>
      <ul role="list" className="proof-strip">
        {proof.map((item) => (
          <li key={item.text}>
            <a href={item.url}>{item.text}</a>
          </li>
        ))}
      </ul>

      {featured.length > 0 ? (
        <>
          <h2>Featured projects</h2>
          <ul role="list" className="cards">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </ul>
          <p>
            <Link href="/projects">See all projects</Link>
          </p>
        </>
      ) : null}

      <h2>Latest writing</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.url}>
            <a href={article.url}>{article.title}</a>
            <span className="meta"> {formatDate(article.date)}</span>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/writing">See all articles</Link>
      </p>
    </>
  );
}
