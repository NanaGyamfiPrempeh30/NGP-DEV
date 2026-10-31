import type { Claim } from "@/content/schema";

export function Claims({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) return null;
  return (
    <ul role="list" className="claims">
      {claims.map((claim) => (
        <li key={claim.text}>
          <span>{claim.text}</span>
          {claim.evidence ? (
            <a className="proof" href={claim.evidence.url}>
              Proof: {claim.evidence.label}
            </a>
          ) : claim.internal ? (
            // On paper one dagger stands in for the label; the CV page prints a single footnote for it.
            <span className="proof">
              <span className="screen-only">Private work, no public link</span>
              <span className="print-only" aria-hidden="true">
                †
              </span>
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
