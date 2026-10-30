import { inflateSync } from "node:zlib";

// Reads the text of a PDF printed by Chromium (scripts/cv-pdf.mjs), for tests only. It handles what
// that printer writes: plain objects, Flate streams, and fonts with a ToUnicode map. Not a general
// PDF parser, and it needs no dependency.

type CMap = { bytes: number; map: Map<number, string> };

const utf16 = (hex: string) => {
  let out = "";
  for (let i = 0; i < hex.length; i += 4) out += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
  return out;
};

function parseCMap(text: string): CMap {
  const range = text.match(/begincodespacerange\s*<([0-9a-fA-F]+)>/);
  const map = new Map<number, string>();
  for (const block of text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const [, src, dst] of block[1]!.matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) {
      map.set(parseInt(src!, 16), utf16(dst!));
    }
  }
  for (const block of text.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const [, lo, hi, dst] of block[1]!.matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) {
      const start = parseInt(dst!, 16);
      for (let code = parseInt(lo!, 16); code <= parseInt(hi!, 16); code++) {
        map.set(code, String.fromCharCode(start + code - parseInt(lo!, 16)));
      }
    }
  }
  return { bytes: range ? range[1]!.length / 2 : 1, map };
}

function literalBytes(body: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]!;
    if (ch !== "\\") {
      out.push(ch.charCodeAt(0));
      continue;
    }
    const next = body[++i]!;
    const octal = body.slice(i).match(/^[0-7]{1,3}/);
    if (octal) {
      out.push(parseInt(octal[0], 8));
      i += octal[0].length - 1;
    } else {
      out.push(({ n: 10, r: 13, t: 9, b: 8, f: 12 } as Record<string, number>)[next] ?? next.charCodeAt(0));
    }
  }
  return out;
}

function decode(bytes: number[], cmap: CMap | undefined): string {
  let out = "";
  const width = cmap?.bytes ?? 1;
  for (let i = 0; i + width <= bytes.length; i += width) {
    let code = 0;
    for (let j = 0; j < width; j++) code = code * 256 + bytes[i + j]!;
    out += cmap?.map.get(code) ?? "";
  }
  return out;
}

export function pdfText(pdf: Buffer): string {
  const raw = pdf.toString("latin1");
  const objects = new Map<number, string>();
  for (const m of raw.matchAll(/(\d+) 0 obj([\s\S]*?)endobj/g)) objects.set(Number(m[1]), m[2]!);

  const stream = (num: number): string => {
    const body = objects.get(num) ?? "";
    const m = body.match(/stream\r?\n([\s\S]*?)\r?\nendstream/);
    if (!m) return "";
    const data = Buffer.from(m[1]!, "latin1");
    return /\/FlateDecode/.test(body) ? inflateSync(data).toString("latin1") : m[1]!;
  };

  const cmaps = new Map<number, CMap>();
  const fontCMap = (fontNum: number) => {
    const ref = objects.get(fontNum)?.match(/\/ToUnicode (\d+) 0 R/);
    if (!ref) return undefined;
    const num = Number(ref[1]);
    if (!cmaps.has(num)) cmaps.set(num, parseCMap(stream(num)));
    return cmaps.get(num);
  };

  const pages: string[] = [];
  for (const body of objects.values()) {
    if (!/\/Type \/Page\s/.test(body)) continue;
    const fonts = new Map<string, number>();
    const fontDict = body.match(/\/Font <<([\s\S]*?)>>/)?.[1] ?? "";
    for (const [, name, num] of fontDict.matchAll(/\/(\S+) (\d+) 0 R/g)) fonts.set(name!, Number(num));
    const contents = body.match(/\/Contents (?:\[([^\]]*)\]|(\d+) 0 R)/);
    const refs = contents?.[1] ? [...contents[1].matchAll(/(\d+) 0 R/g)].map((m) => Number(m[1])) : [Number(contents?.[2])];

    let text = "";
    let cmap: CMap | undefined;
    for (const ref of refs) {
      const ops = stream(ref);
      const tokens = ops.matchAll(/\/(\S+)\s+[\d.]+\s+Tf|<([0-9a-fA-F]*)>|\(((?:\\.|[^\\)])*)\)|\b(T[dDm*]|ET)\b/g);
      for (const [, font, hex, literal, move] of tokens) {
        if (font !== undefined) cmap = fontCMap(fonts.get(font) ?? -1);
        else if (hex !== undefined) text += decode(hex.match(/../g)?.map((h) => parseInt(h, 16)) ?? [], cmap);
        else if (literal !== undefined) text += decode(literalBytes(literal), cmap);
        else if (move === "ET" || move === "T*") text += "\n";
      }
    }
    pages.push(text);
  }
  return pages.join("\n");
}
