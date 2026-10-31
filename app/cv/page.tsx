import type { Metadata } from "next";
import { JobEntry } from "@/components/JobEntry";
import { education, headline, sideWork } from "@/content/experience";
import { cvPdf, cvUpdated, location, roleLine } from "@/content/home";
import { email } from "@/content/profiles";
import { languages, skills } from "@/content/skills";
import { getCerts, getJobs } from "@/lib/content";
import { formatDate, formatRange } from "@/lib/dates";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/cv" },
  title: "CV",
  description: "Printable CV of Yaw Nana Gyamfi Prempeh, with a PDF download.",
};

export default function Cv() {
  return (
    <>
      <h1>Yaw Nana Gyamfi Prempeh</h1>
      <p className="lede">{roleLine}</p>
      <p className="meta">
        {location}. <a href={`mailto:${email}`}>{email}</a>. <a href={SITE_URL}>{new URL(SITE_URL).host}</a>
      </p>
      <p>{headline}</p>

      <div className="actions no-print">
        <a href={cvPdf}>Download PDF</a>
      </div>
      <p className="meta">Last updated {formatDate(cvUpdated)}.</p>

      <h2>Experience</h2>
      <ol role="list" className="entries">
        {getJobs().map((job) => (
          <JobEntry key={`${job.company}-${job.start}`} job={job} maxTags={8} />
        ))}
      </ol>
      <p className="meta print-only">† Private work, no public link.</p>

      <h2>Freelance and side projects</h2>
      <ul>
        {sideWork.map((work) => (
          <li key={work.name}>
            {work.role}, {work.name}. {formatRange(work.start, work.end)}.
          </li>
        ))}
      </ul>

      <h2>Skills</h2>
      <ul>
        {skills.map((skill) => (
          <li key={skill.group}>
            {skill.group}: {skill.items}
          </li>
        ))}
      </ul>
      <h2>Education</h2>
      <p>
        {education.degree}, {education.school}, {education.location}. {education.start} to{" "}
        {education.end}.
      </p>

      <h2>Certifications and courses</h2>
      <ul>
        {getCerts().map((cert) => (
          <li key={cert.name}>
            {cert.name} ({cert.type === "course" ? "course" : "certification"},{" "}
            {formatDate(cert.issued)})
          </li>
        ))}
      </ul>

      <h2>Languages</h2>
      <p>{languages.join(". ")}</p>
      <h2>References</h2>
      <p>Available on request.</p>
    </>
  );
}
