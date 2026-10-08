import type { Metadata } from "next";
import { Tags } from "@/components/Tags";
import { getArticles } from "@/lib/content";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles by Yaw Nana Gyamfi Prempeh on Kubernetes, DevSecOps and cloud infrastructure.",
};

export default function Writing() {
  const articles = getArticles();
  return (
    <>
      <h1>Writing</h1>
      <p className="lede">
        I write on <a href="https://medium.com/@yawgyamfiprempeh27">Medium</a>. Each title opens the
        article there.
      </p>
      <ul role="list" className="entries">
        {articles.map((article) => (
          <li className="entry" key={article.url}>
            <p className="when">{formatDate(article.date)}</p>
            <div>
              <h2 className="entry-title">
                <a href={article.url}>{article.title}</a>
              </h2>
              <Tags items={article.tags} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
