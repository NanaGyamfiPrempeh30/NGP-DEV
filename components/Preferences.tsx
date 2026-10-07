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

export function Preferences() {
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

  return (
    <div className="prefs">
      <button type="button" onClick={nextTheme}>
        Theme: {names[theme]}
      </button>
      <button type="button" aria-pressed={comfort} onClick={toggleComfort}>
        Comfort mode
      </button>
    </div>
  );
}
