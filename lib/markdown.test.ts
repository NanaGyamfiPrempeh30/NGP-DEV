import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./markdown";

describe("parseMarkdown", () => {
  it("splits headings, paragraphs and lists", () => {
    const blocks = parseMarkdown("## What broke\n\nOne line\nsame paragraph.\n\n- a\n- b\n\n1. first\n2. second\n");
    expect(blocks).toEqual([
      { type: "h2", text: "What broke" },
      { type: "p", text: "One line same paragraph." },
      { type: "ul", items: ["a", "b"] },
      { type: "ol", items: ["first", "second"] },
    ]);
  });

  it("drops MDX comments", () => {
    expect(parseMarkdown("{/* TODO: body */}\n")).toEqual([]);
  });
});
