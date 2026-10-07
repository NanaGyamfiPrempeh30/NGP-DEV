import Link from "next/link";
import { Preferences } from "./Preferences";

const nav = [
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/mentoring", label: "Mentoring" },
  { href: "/beyond", label: "Beyond code" },
  { href: "/cv", label: "CV" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="wrap bar">
        <Link className="brand" href="/">
          Yaw Nana Gyamfi Prempeh
        </Link>
        <nav aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Preferences />
      </div>
    </header>
  );
}
