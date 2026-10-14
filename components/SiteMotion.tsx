"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// The only site script for motion. One scroll listener, one IntersectionObserver.
// Everything it animates is already in the HTML, so the page is complete without it.
export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Header: shrink after the first scroll, and move the progress bar.
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const max = root.scrollHeight - window.innerHeight;
        root.style.setProperty("--progress", max > 0 ? String(Math.min(1, window.scrollY / max)) : "0");
        root.toggleAttribute("data-scrolled", window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pause the hero's ambient drift while the tab is hidden.
    const onVisibility = () => root.toggleAttribute("data-tab-hidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    // Count a figure up to the number already printed in the HTML.
    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (reduce || !Number.isFinite(target) || target === 0) return;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 600);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const show = (el: HTMLElement) => {
      el.classList.add("is-in");
      el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
    };
    if (!("IntersectionObserver" in window)) {
      targets.forEach(show);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
