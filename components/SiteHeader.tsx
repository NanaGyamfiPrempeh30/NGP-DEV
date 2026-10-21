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
        <Link className="brand" href="/" aria-label="Yaw Nana Gyamfi Prempeh, home">
          <span className="mark" aria-hidden="true">
            NGP
          </span>
          <span className="brand-name">Yaw Nana Gyamfi Prempeh</span>
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
