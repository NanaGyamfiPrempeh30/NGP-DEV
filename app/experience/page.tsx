import type { Metadata } from "next";
import { JobEntry } from "@/components/JobEntry";
import { Tags } from "@/components/Tags";
import { education, headline, sideWork } from "@/content/experience";
import { getCerts, getJobs } from "@/lib/content";
import { formatDate, formatRange } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work history of Yaw Nana Gyamfi Prempeh, newest first, with proof for each claim.",
};

export default function Experience() {
  return (
    <>
      <h1>Experience</h1>
      <p className="lede">{headline}</p>

      <ol className="entries">
        {getJobs().map((job) => (
          <JobEntry key={`${job.company}-${job.start}`} job={job} />
        ))}
      </ol>

      <h2>Freelance and side projects</h2>
      <p>These ran alongside the jobs above.</p>
      <ul className="entries">
        {sideWork.map((work) => (
          <li className="entry" key={work.name}>
            <p className="when">{formatRange(work.start, work.end)}</p>
            <div>
              <h3>
                {work.role}, {work.name}
              </h3>
              <p className="meta">{work.label}</p>
              <p>{work.summary}</p>
              <Tags items={work.stack} />
            </div>
          </li>
        ))}
      </ul>

      <h2>Education</h2>
      <p>
        {education.degree}, {education.school}, {education.location}. {education.start} to{" "}
        {education.end}.
      </p>

      <h2>Certifications and courses</h2>
      <ul className="entries">
        {getCerts().map((cert) => (
          <li className="entry" key={cert.name}>
            <p className="when">{formatDate(cert.issued)}</p>
            <div>
              <h3>{cert.name}</h3>
              <p className="meta">
                {cert.type === "course" ? "Course" : "Certification"}
                {cert.expires ? `, valid until ${formatDate(cert.expires)}` : ""}
              </p>
              {cert.verifyUrl && cert.validationNo ? (
                <p>
                  Validation number: <code className="validation">{cert.validationNo}</code>.{" "}
                  <a href={cert.verifyUrl}>Check it with AWS</a>
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
