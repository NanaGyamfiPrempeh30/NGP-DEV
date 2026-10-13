import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Project } from "../content/schema";
import { visible } from "./visibility";

const dir = path.join(process.cwd(), "content", "projects");

// The YAML block sits inside an MDX comment, so the MDX compiler skips it with no extra plugin.
const FRONTMATTER: [string, string] = ["{/*", "*/}"];

export type LoadedProject = Project & { body: string };

// Reads every project file and runs its frontmatter through the Zod schema. Throws on the first bad file.
export function loadProjects(): LoadedProject[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"), {
        delimiters: FRONTMATTER,
      });
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

// Pages use this. Production never shows verified: false (see lib/visibility.ts).
// `hidden` wins over everything: a hidden project is never rendered, linked or listed, in any environment.
export function servable<T extends { hidden: boolean; verified: boolean }>(projects: T[]): T[] {
  return visible(projects.filter((project) => !project.hidden));
}

export function getProjects(): LoadedProject[] {
  return servable(loadProjects());
}
