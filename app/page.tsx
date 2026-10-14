import Image from "next/image";
import Link from "next/link";
import { EcdcDiagram } from "@/components/EcdcDiagram";
import { ProjectCard } from "@/components/ProjectCard";
import { SocialRow } from "@/components/SocialRow";
import { headline } from "@/content/experience";
import { cvPdf, location, proofStrip, roleLine, tagline } from "@/content/home";
import { getArticles, getJobs } from "@/lib/content";
import { formatDate, formatRange } from "@/lib/dates";
import { heroPhoto } from "@/lib/hero";
import { getProjects } from "@/lib/projects";

const typeLabel = { "full-time": "Full-time", "part-time": "Part-time", contract: "Contract" } as const;

export default function Home() {
  const projects = getProjects();
  const slugs = new Set(projects.map((p) => p.slug));
  const proof = proofStrip.filter((item) => slugs.has(item.project));
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const articles = getArticles().slice(0, 3);
  const jobs = getJobs();

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-text">
          <p className="eyebrow" style={{ "--i": 0 } as React.CSSProperties}>
            {roleLine}
          </p>
          <h1 style={{ "--i": 1 } as React.CSSProperties}>Yaw Nana Gyamfi Prempeh</h1>
          <p className="lede" style={{ "--i": 2 } as React.CSSProperties}>
            {headline}
          </p>
          <p className="tagline" style={{ "--i": 3 } as React.CSSProperties}>
            {tagline}
          </p>
          <div className="actions" style={{ "--i": 4 } as React.CSSProperties}>
            <Link className="btn primary" href="/projects">
              View projects
            </Link>
            <a className="btn" href={cvPdf}>
              Download CV
            </a>
          </div>
          <div style={{ "--i": 5 } as React.CSSProperties}>
            <SocialRow label="Profiles" />
          </div>
        </div>
        {/* Photo slot. Falls back to a monogram tile if the photo file is missing. */}
        {heroPhoto ? (
          <div className="portrait-wrap" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="portrait photo">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              width={heroPhoto.width}
              height={heroPhoto.height}
              sizes="(min-width: 60rem) 400px, 260px"
              priority
              fetchPriority="high"
            />
          </div>
          {/* From 1024px: a tilted card on the photo's corner that leads to the ECDC case study. */}
          {slugs.has("ecdc-kubernetes-ionos") ? (
            <Link className="hero-card" href="/projects/ecdc-kubernetes-ionos" aria-label="Case study: ECDC Kubernetes on IONOS">
              <EcdcDiagram thumbnail />
              <span>Case study</span>
            </Link>
          ) : null}
          </div>
        ) : (
          <div className="portrait" role="img" aria-label="Monogram: NGP" style={{ "--i": 3 } as React.CSSProperties}>
            <span aria-hidden="true">NGP</span>
            <small aria-hidden="true">{location}</small>
          </div>
        )}
      </section>

      {proof.length > 0 ? (
        <section aria-labelledby="proof-title">
          <h2 id="proof-title">Check these first</h2>
          <ul role="list" className="bento">
            {proof.map((item) => (
              <li key={item.label} className={`tile ${item.size}`} data-reveal>
                {/* The label carries the final figure for screen readers. The animated digits are hidden from them. */}
                <a
                  href={item.url}
                  aria-label={`${item.count}${item.suffix ?? ""} ${item.what}. ${item.label}. ${
                    item.internal ? "Private work: see why" : "See proof"
                  }`}
                >
                  <span className="label">{item.label}</span>
                  <span className="figure" aria-hidden="true">
                    <span data-count={item.count}>{item.count}</span>
                    {item.suffix ? <small>{item.suffix}</small> : null}
                  </span>
                  <span className="what">{item.what}</span>
                  <span className="see">{item.internal ? "Private work: see why" : "See proof"}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section aria-labelledby="featured-title">
          <h2 id="featured-title">Featured projects</h2>
          <ul role="list" className="cards featured">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </ul>
          <p className="more">
            <Link href="/projects">See all projects</Link>
          </p>
        </section>
      ) : null}

      <section aria-labelledby="jobs-title">
        <h2 id="jobs-title">Experience</h2>
        <ol role="list" className="timeline" data-reveal>
          {jobs.map((job) => (
            <li key={`${job.company}-${job.start}`}>
              <p className="label">{formatRange(job.start, job.end)}</p>
              <h3>{job.title}</h3>
              <p className="meta">
                {[job.company, job.country, job.type ? typeLabel[job.type] : null].filter(Boolean).join(", ")}
              </p>
            </li>
          ))}
        </ol>
        <p className="more">
          <Link href="/experience">See the full experience, with proof for each claim</Link>
        </p>
      </section>

      <section aria-labelledby="writing-title">
        <h2 id="writing-title">Latest writing</h2>
        <ul role="list" className="cards writing">
          {articles.map((article) => (
            <li key={article.url} className="card-slot" data-reveal>
              <article className="card">
                <p className="label">{formatDate(article.date)}</p>
                <h3>
                  <a className="card-link" href={article.url}>
                    {article.title}
                  </a>
                </h3>
                <div className="card-foot">
                  <span className="go" aria-hidden="true">
                    Read on Medium
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <p className="more">
          <Link href="/writing">See all articles</Link>
        </p>
      </section>
    </>
  );
}
