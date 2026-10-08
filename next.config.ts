import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// No plugins: each project file keeps its YAML inside an MDX comment, which MDX skips.
// gray-matter and Zod read that block (lib/projects.ts).
const withMDX = createMDX();

export default withMDX(nextConfig);
