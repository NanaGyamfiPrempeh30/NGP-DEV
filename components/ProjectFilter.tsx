"use client";

import { useState, type ReactNode } from "react";

const filters = [
  { value: "all", label: "All" },
  { value: "work", label: "Work" },
  { value: "client", label: "Client" },
  { value: "open-source", label: "Open source" },
] as const;

type Filter = (typeof filters)[number]["value"];

// The cards are rendered on the server. This only sets data-filter; CSS hides the rest.
export function ProjectFilter({
  counts,
  children,
}: {
  counts: Record<Filter, number>;
  children: ReactNode;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  return (
    <div data-filter={filter}>
      <div className="filters" role="group" aria-label="Filter projects by kind">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="meta" role="status" aria-live="polite">
        Showing {counts[filter]} of {counts.all} projects
      </p>
      {children}
    </div>
  );
}
