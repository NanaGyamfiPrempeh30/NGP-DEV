import type { Metadata } from "next";
import { mentor, mentoring } from "@/content/mentoring";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Mentoring",
  description: "Mentoring given and received by Yaw Nana Gyamfi Prempeh.",
};

export default function Mentoring() {
  return (
    <>
      <h1>Mentoring</h1>

      {mentoring ? (
        <>
          <h2>Mentoring {mentoring.menteeName}</h2>
          <p>
            {mentoring.menteeName} is a Ghanaian engineer teaching himself DevOps in the UK. I mentor
            him for free, and we do it in public on X.
          </p>
          <p>
            {mentoring.format} One rule: &ldquo;{mentoring.rule}&rdquo;
          </p>
          <p>
            Over {mentoring.weeks} weeks he went {mentoring.progress.charAt(0).toLowerCase()}
            {mentoring.progress.slice(1)}
          </p>
          <p>
            <strong>Status: {mentoring.status}.</strong>{" "}
            {mentoring.status === "paused"
              ? `${mentoring.menteeName} paused the sessions after week ${mentoring.weeks}. The series is not finished.`
              : null}
          </p>

          <h3>The posts</h3>
          <ol className="entries">
            {mentoring.posts.map((post) => (
              <li className="entry" key={post.url}>
                <p className="when">{formatDate(post.date)}</p>
                <p style={{ marginTop: 0 }}>
                  <a href={post.url}>Read the post on X</a>
                </p>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      <h2>Being mentored</h2>
      <p>
        <a href={mentor.url}>{mentor.name}</a>, {mentor.description}, mentored me while I built the{" "}
        {mentor.project} server.
      </p>
    </>
  );
}
