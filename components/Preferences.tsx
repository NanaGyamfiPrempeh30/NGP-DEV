"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";
const order: Theme[] = ["system", "light", "dark"];
const names: Record<Theme, string> = { system: "System", light: "Light", dark: "Dark" };

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked. The setting still applies to this page view.
  }
}

export function Preferences({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [comfort, setComfort] = useState(false);

  // The inline script in layout.tsx has already applied the stored values. Sync the labels to them.
  useEffect(() => {
    const stored = read("theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "light" || stored === "dark") setTheme(stored);
    setComfort(read("comfort") === "on");
  }, []);

  function nextTheme() {
    const next = order[(order.indexOf(theme) + 1) % order.length] ?? "system";
    setTheme(next);
    write("theme", next);
    if (next === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
  }

  function toggleComfort() {
    const next = !comfort;
    setComfort(next);
    write("comfort", next ? "on" : "off");
    if (next) document.documentElement.dataset.comfort = "on";
    else delete document.documentElement.dataset.comfort;
  }

  const themeLabel = `Theme: ${names[theme]}`;

  // Compact: icon buttons for the wide header. The names stay available to screen readers and as tooltips.
  if (compact) {
    return (
      <div className="prefs compact">
        <button type="button" onClick={nextTheme} aria-label={`${themeLabel}. Change theme`} title={themeLabel}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          aria-pressed={comfort}
          aria-label="Comfort mode"
          title="Comfort mode: larger text and spacing"
          onClick={toggleComfort}
        >
          <span aria-hidden="true">Aa</span>
        </button>
      </div>
    );
  }

  return (
    <div className="prefs">
      <button type="button" onClick={nextTheme}>
        {themeLabel}
      </button>
      <button type="button" aria-pressed={comfort} onClick={toggleComfort}>
        Comfort mode
      </button>
    </div>
  );
}
