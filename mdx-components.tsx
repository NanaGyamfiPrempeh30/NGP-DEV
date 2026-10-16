import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { EcdcDiagram } from "@/components/EcdcDiagram";
import { slugify } from "@/lib/slug";

function text(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(text).join("");
  return "";
}

// Required by @next/mdx.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Headings get an id for the table of contents. "What broke" is marked so CSS can make it a callout.
    h2: ({ children }) => {
      const title = text(children);
      return (
        <h2 id={slugify(title)} className={title.startsWith("What broke") ? "broke" : undefined}>
          {children}
        </h2>
      );
    },
    // Owner TODOs stand out on preview builds.
    p: ({ children }) => (
      <p className={text(children).startsWith("TODO(owner)") ? "todo" : undefined}>{children}</p>
    ),
    EcdcDiagram,
  };
}
