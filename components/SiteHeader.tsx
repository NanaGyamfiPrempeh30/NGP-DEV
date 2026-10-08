import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { Preferences } from "./Preferences";

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
        {/* Wide screens: links in a row. Small screens: a details/summary menu. CSS shows one of the two. */}
        <nav aria-label="Main" className="nav-wide">
          <NavLinks />
        </nav>
        <details className="nav-narrow">
          <summary>Menu</summary>
          <nav aria-label="Main">
            <NavLinks />
          </nav>
          <Preferences />
        </details>
        <div className="prefs-wide">
          <Preferences />
        </div>
      </div>
    </header>
  );
}
