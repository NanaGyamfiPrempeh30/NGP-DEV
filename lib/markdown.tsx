import type { ReactNode } from "react";

// Renders the small Markdown subset the case studies use: "## " headings, paragraphs,
// "- " and "1. " lists, [links](url) and `code`. No raw HTML is ever passed through.
function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|`([^`]+)`/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[2]) {
      nodes.push(
        <a key={match.index} href={match[2]}>
          {match[1]}
        </a>,
      );
    } else {
      nodes.push(<code key={match.index}>{match[3]}</code>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] };

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").split("\n");
  let current: Block | null = null;
  const flush = () => {
    if (current) blocks.push(current);
    current = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const bullet = line.match(/^- (.*)$/);
    const numbered = line.match(/^\d+\. (.*)$/);
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (bullet || numbered) {
      const type = bullet ? "ul" : "ol";
      const text = (bullet ?? numbered)?.[1] ?? "";
      if (current && current.type === type) current.items.push(text);
      else {
        flush();
        current = { type, items: [text] };
      }
    } else if (current && current.type === "p") {
      current.text += ` ${line}`;
    } else {
      flush();
      current = { type: "p", text: line };
    }
  }
  flush();
  return blocks;
}

export function Markdown({ source }: { source: string }) {
  return (
    <>
      {parseMarkdown(source).map((block, i) => {
        if (block.type === "h2") return <h2 key={i}>{inline(block.text)}</h2>;
        if (block.type === "p") {
          return (
            <p key={i} className={block.text.startsWith("TODO(owner)") ? "todo" : undefined}>
              {inline(block.text)}
            </p>
          );
        }
        const List = block.type;
        return (
          <List key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </List>
        );
      })}
    </>
  );
}
