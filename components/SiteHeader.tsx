import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { Preferences } from "./Preferences";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="wrap bar">
        {/* No aria-label: the name comes from the visible text, so it always contains it (WCAG 2.5.3). */}
        <Link className="brand" href="/">
          <span className="mark" aria-hidden="true">
            NGP
          </span>
          <span className="brand-name">Yaw Nana Gyamfi Prempeh</span>
          <span className="sr-only">, home</span>
        </Link>
        <nav aria-label="Main" className="nav-wide">
          <NavLinks />
        </nav>
        <div className="header-end">
          <div className="prefs-wide">
            <Preferences compact />
          </div>
          <a className="btn small" href="#contact">
            Contact
          </a>
          <MobileMenu />
        </div>
      </div>
      <div className="progress" aria-hidden="true" />
    </header>
  );
}
