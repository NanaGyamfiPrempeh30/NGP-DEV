import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Project } from "../content/schema";

const dir = path.join(process.cwd(), "content", "projects");

export type LoadedProject = Project & { body: string };

// Reads every project file and runs its frontmatter through the Zod schema. Throws on the first bad file.
export function loadProjects(): LoadedProject[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const result = Project.safeParse(data);
      if (!result.success) {
        throw new Error(`${file}: ${result.error.message}`);
      }
      if (`${result.data.slug}.mdx` !== file) {
        throw new Error(`${file}: slug "${result.data.slug}" does not match the file name`);
      }
      return { ...result.data, body: content };
    });
}

// Pages use this. A production build never shows verified: false.
export function getProjects(): LoadedProject[] {
  const projects = loadProjects();
  return process.env.NODE_ENV === "production" ? projects.filter((p) => p.verified) : projects;
}
