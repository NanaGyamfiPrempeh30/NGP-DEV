"use client";

import { useState } from "react";

// Click-to-load: nothing from TikTok is requested until the visitor asks for it.
export function TikTokFacade({ handle }: { handle: string }) {
  const [loaded, setLoaded] = useState(false);
  const profile = `https://www.tiktok.com/@${handle}`;

  function load() {
    setLoaded(true);
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }

  if (!loaded) {
    return (
      <div className="facade">
        <p>
          My drone videos are on TikTok at <a href={profile}>@{handle}</a>.
        </p>
        <button type="button" onClick={load}>
          Load the TikTok player here
        </button>
        <p className="meta">Loading it contacts TikTok and runs its scripts.</p>
      </div>
    );
  }

  return (
    <blockquote
      className="tiktok-embed"
      cite={profile}
      data-unique-id={handle}
      data-embed-type="creator"
    >
      <a href={profile}>@{handle} on TikTok</a>
    </blockquote>
  );
}
