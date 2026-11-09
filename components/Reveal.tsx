"use client";

import { useEffect } from "react";

/**
 * Fades `.rv` elements in as they reach the viewport (renders nothing itself).
 * Anything at or above the viewport is also revealed, so content is never left
 * invisible after a reload mid-page, an anchor jump or a fast scroll.
 */
export function Reveal() {
  useEffect(() => {
    const pending = new Set(document.querySelectorAll<HTMLElement>(".rv:not(.in)"));
    const show = (el: HTMLElement) => {
      el.classList.add("in");
      pending.delete(el);
    };

    const sweep = () => {
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.92) show(el);
      });
    };

    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (es) =>
          es.forEach((en) => {
            if (en.isIntersecting) {
              show(en.target as HTMLElement);
              io?.unobserve(en.target);
            }
          }),
        { threshold: 0.12 },
      );
      pending.forEach((el) => io!.observe(el));
    } else {
      pending.forEach(show);
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sweep);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    addEventListener("load", onScroll);
    sweep();

    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      removeEventListener("load", onScroll);
    };
  }, []);
  return null;
}
