import { describe, expect, it } from "vitest";
import { email, profiles } from "../content/profiles";
import { jsonLdScript, personJsonLd } from "./jsonld";

describe("Person JSON-LD", () => {
  it("uses only facts already on the site", () => {
    const person = personJsonLd();
    expect(person.name).toBe("Yaw Nana Gyamfi Prempeh");
    expect(person.jobTitle).toBe("DevSecOps Engineer");
    expect(person.email).toBe(`mailto:${email}`);
    expect(person.address).toMatchObject({ addressLocality: "Accra", addressCountry: "Ghana" });
    const urls = profiles.map((p) => p.url);
    for (const url of person.sameAs) expect(urls).toContain(url);
    expect(person.sameAs).toContain("https://github.com/NanaGyamfiPrempeh30");
  });

  it("cannot close its script tag early", () => {
    expect(jsonLdScript({ a: "</script>" })).not.toContain("</");
  });
});
