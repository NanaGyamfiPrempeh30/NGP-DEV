"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// The only site script for motion: one scroll listener (header and progress bar), and one
// IntersectionObserver for the proof count-up. Scroll reveals are CSS only.
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

    // Count a figure up to the number already printed in the HTML, but only for figures that scroll
    // into view later. A figure already on screen when the page loads keeps its final value.
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

    const figures = document.querySelectorAll<HTMLElement>("[data-count]");
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                countUp(entry.target as HTMLElement);
                observer?.unobserve(entry.target);
              }
            },
            { rootMargin: "0px 0px -8% 0px" },
          )
        : null;
    figures.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return; // on screen already
      observer?.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
