import { email, profiles } from "@/content/profiles";
import { SocialRow } from "./SocialRow";

const inRow = new Set(["GitHub", "LinkedIn", "Medium", "X", "Email"]);

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="wrap">
        <div className="contact-band">
          <h2>Contact</h2>
          <p className="contact-email">
            <a href={`mailto:${email}`}>
              {email.split("@")[0]}
              <wbr />@{email.split("@")[1]}
            </a>
          </p>
          <SocialRow label="Contact links" />
        </div>
        <ul role="list" className="links">
          {profiles
            .filter((profile) => !inRow.has(profile.label))
            .map((profile) => (
              <li key={profile.url}>
                <a href={profile.url}>{profile.label}</a>
              </li>
            ))}
        </ul>
        <p className="meta">Referees available on request.</p>
      </div>
    </footer>
  );
}
