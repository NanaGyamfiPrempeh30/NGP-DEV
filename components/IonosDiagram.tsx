// Access path of the IONOS cluster. Every label is a fact from the Medium article linked on the page.
// `thumbnail` draws the same picture with no text alternative and no ids, for decorative reuse.
export function IonosDiagram({ thumbnail = false }: { thumbnail?: boolean }) {
  const id = thumbnail ? "ionos-thumb" : "ionos";
  const drawing = (
      <svg
        viewBox="0 0 720 270"
        {...(thumbnail
          ? { "aria-hidden": true, focusable: false }
          : { role: "img", "aria-labelledby": "ionos-diagram-title ionos-diagram-desc" })}
      >
        {thumbnail ? null : (
          <>
            <title id="ionos-diagram-title">How traffic reaches the cluster</title>
            <desc id="ionos-diagram-desc">
              The internet reaches one bastion host. The bastion runs OpenVPN and HAProxy. Behind it, on a
              private network, sit three nodes with no public IPs: one master and two workers.
            </desc>
          </>
        )}
        <defs>
          <clipPath id={`${id}-clip-a`}>
            <rect x="128" y="120" width="72" height="20" />
          </clipPath>
          <clipPath id={`${id}-clip-b`}>
            <rect x="372" y="120" width="76" height="20" />
          </clipPath>
        </defs>
        <rect className="box" x="16" y="90" width="112" height="80" rx="12" />
        <text x="72" y="126" textAnchor="middle">
          Internet
        </text>
        <text className="dim" x="72" y="146" textAnchor="middle">
          ports 443, 80
        </text>

        <g clipPath={`url(#${id}-clip-a)`}>
          <line className="edge flow" x1="116" y1="130" x2="200" y2="130" />
        </g>

        <rect className="box" x="200" y="62" width="172" height="136" rx="12" />
        <text x="286" y="92" textAnchor="middle">
          Bastion host
        </text>
        <text className="dim" x="286" y="114" textAnchor="middle">
          public IP
        </text>
        <text className="dim" x="286" y="140" textAnchor="middle">
          OpenVPN: the only way in
        </text>
        <text className="dim" x="286" y="162" textAnchor="middle">
          HAProxy, TCP mode
        </text>

        <g clipPath={`url(#${id}-clip-b)`}>
          <line className="edge flow" x1="360" y1="130" x2="448" y2="130" />
        </g>

        <rect className="private" x="448" y="20" width="256" height="230" rx="14" />
        <text className="dim" x="576" y="42" textAnchor="middle">
          Private network, no public IPs
        </text>
        <rect className="box" x="470" y="58" width="212" height="50" rx="10" />
        <text x="576" y="80" textAnchor="middle">
          Master
        </text>
        <text className="dim" x="576" y="97" textAnchor="middle">
          Traefik ends TLS
        </text>
        <rect className="box" x="470" y="120" width="212" height="46" rx="10" />
        <text x="576" y="148" textAnchor="middle">
          Worker
        </text>
        <rect className="box" x="470" y="178" width="212" height="46" rx="10" />
        <text x="576" y="206" textAnchor="middle">
          Worker
        </text>
      </svg>
  );
  if (thumbnail) return drawing;
  return (
    <figure className="diagram">
      {/* tabIndex lets keyboard users scroll the drawing sideways on small screens */}
      <div className="scroll" tabIndex={0} role="group" aria-label="Diagram, scrolls sideways on small screens">
      {drawing}
      </div>
      <figcaption>
        One bastion is the only way in. It runs OpenVPN for engineers and HAProxy for web traffic. The
        three nodes sit on a private network with no public IPs.
      </figcaption>
    </figure>
  );
}
