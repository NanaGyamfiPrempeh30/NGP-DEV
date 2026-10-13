import { profiles } from "@/content/profiles";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <h2>Contact</h2>
        <ul role="list" className="links">
          {profiles.map((profile) => (
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
