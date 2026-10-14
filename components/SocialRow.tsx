import { profiles } from "@/content/profiles";

// Short text glyphs in the mono face stand in for brand logos. The full name is always
// there for screen readers, and shows beside the glyph from 768 px.
const shown = [
  { label: "GitHub", glyph: "GH" },
  { label: "LinkedIn", glyph: "in" },
  { label: "Medium", glyph: "M" },
  { label: "X", glyph: "X" },
  { label: "Email", glyph: "@" },
];

export function SocialRow({ label }: { label: string }) {
  return (
    <ul role="list" className="social" aria-label={label}>
      {shown.map((item) => {
        const profile = profiles.find((p) => p.label === item.label);
        if (!profile) return null;
        return (
          <li key={item.label}>
            <a href={profile.url}>
              <span className="glyph" aria-hidden="true">
                {item.glyph}
              </span>
              <span className="name">{item.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
