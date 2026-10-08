// Only ever rendered on previews: production filters unverified items out before this point.
export function DraftBadge({ verified }: { verified: boolean }) {
  if (verified) return null;
  return <p className="draft">Unverified draft. Hidden on the live site.</p>;
}
