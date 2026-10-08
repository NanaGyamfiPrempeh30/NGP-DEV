"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/mentoring", label: "Mentoring" },
  { href: "/beyond", label: "Beyond code" },
  { href: "/cv", label: "CV" },
];

// aria-current is in the prerendered HTML, so it works before any script runs.
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul role="list">
      {nav.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              // Closes the small-screen menu after a choice. The menu itself opens with no script.
              onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
