// Turns a heading into an id: "What broke and how I fixed it" -> "what-broke-and-how-i-fixed-it".
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
