import { location, roleLine } from "../content/home";
import { email, profiles } from "../content/profiles";
import { heroPhoto } from "./hero";
import { absolute, SITE_NAME, SITE_URL } from "./site";

// schema.org Person for Home. Every value comes from text already on the site:
// the name, the role line, the location line, the email and the profile links in the footer.
export function personJsonLd() {
  const [city, country] = location.split(" · ")[0]!.split(", ");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    alternateName: "NGP-Dev",
    jobTitle: roleLine.split(" · ")[0],
    url: SITE_URL,
    email: `mailto:${email}`,
    ...(heroPhoto ? { image: absolute(heroPhoto.src) } : {}),
    address: { "@type": "PostalAddress", addressLocality: city, addressCountry: country },
    // Account pages only; the mcp.so and Glama links point at one project, not at the person.
    sameAs: profiles.map((p) => p.url).filter((url) => url.startsWith("https://") && !/\/servers?\//.test(url)),
  };
}

// JSON.stringify does not escape "<", so a "</script>" inside a value could end the tag early.
export const jsonLdScript = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
