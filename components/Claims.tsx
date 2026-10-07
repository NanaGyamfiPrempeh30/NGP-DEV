import type { Claim } from "@/content/schema";

export function Claims({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) return null;
  return (
    <ul className="claims">
      {claims.map((claim) => (
        <li key={claim.text}>
          <span>{claim.text}</span>
          {claim.evidence ? (
            <a className="proof" href={claim.evidence.url}>
              Proof: {claim.evidence.label}
            </a>
          ) : claim.internal ? (
            <span className="proof">Private work, no public link</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
