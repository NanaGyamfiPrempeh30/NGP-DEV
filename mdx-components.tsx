import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

function isTodo(children: ReactNode): boolean {
  const first = Array.isArray(children) ? children[0] : children;
  return typeof first === "string" && first.startsWith("TODO(owner)");
}

// Required by @next/mdx. Marks owner TODOs so they stand out on preview builds.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: ({ children }) => <p className={isTodo(children) ? "todo" : undefined}>{children}</p>,
  };
}
