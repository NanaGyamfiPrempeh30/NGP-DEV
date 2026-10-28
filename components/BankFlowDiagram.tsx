// The bank portal's request flow, for the hero card. Static and decorative: the card's link names the page.
// Labels use only wording from the ticked bank page text (checklist v3 on PR #25).
// A U-shaped 2 x 2 flow, so the card keeps about the same size as the old thumbnail.
export function BankFlowDiagram() {
  return (
    <svg className="flow" viewBox="0 0 220 88" aria-hidden="true" focusable="false">
      <rect className="box" x="4" y="4" width="96" height="32" rx="6" />
      <text x="52" y="24" textAnchor="middle">Staff</text>

      <rect className="box private" x="120" y="4" width="96" height="32" rx="6" />
      <text x="168" y="17" textAnchor="middle">Private</text>
      <text x="168" y="30" textAnchor="middle">mesh VPN</text>

      <rect className="box" x="120" y="52" width="96" height="32" rx="6" />
      <text x="168" y="72" textAnchor="middle">Reverse proxy</text>

      <rect className="box" x="4" y="52" width="96" height="32" rx="6" />
      <text x="52" y="72" textAnchor="middle">App + data</text>

      <path className="arrow" d="M103 20h13m-4-4l4 4l-4 4" />
      <path className="arrow" d="M168 38v11m-4-4l4 4l4-4" />
      <path className="arrow" d="M117 68h-13m4-4l-4 4l4 4" />
    </svg>
  );
}
