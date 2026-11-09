"use client";

import { useEffect } from "react";

/**
 * Scroll choreography — subtle, slow and purposeful.
 *
 * Performance contract: GSAP + ScrollTrigger are not downloaded until the visitor first interacts
 * (scroll / touch / key / pointer), so they never compete with first paint, LCP or hydration.
 * Skipped entirely under prefers-reduced-motion. All content is present in the HTML; every effect
 * animates only transform / opacity, plays once, and nothing is pinned or hijacked.
 *
 *   data-rise   blocks of copy fade up with a gentle stagger
 *   data-badge  an emblem settles into place: a slight turn and scale, like a seal being pressed
 */
export function Motion() {
  useEffect(() => {
    // Ambient CSS loops (steam, glow) stay paused, and below-the-fold sections keep their deferred layout (content-visibility),
    // until the page has loaded AND the first contentful paint has really happened — so none of that work can sit in front of first paint.
    const goLive = () => document.documentElement.classList.add("live", "full");
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
    const release = () => (idle ? idle(goLive, { timeout: 1500 }) : setTimeout(goLive, 400));
    const afterFirstPaint = (cb: () => void) => {
      if (performance.getEntriesByName("first-contentful-paint").length) return cb();
      try {
        const po = new PerformanceObserver((list) => {
          if (list.getEntriesByName("first-contentful-paint").length) {
            po.disconnect();
            cb();
          }
        });
        po.observe({ type: "paint", buffered: true });
      } catch {
        cb();
      }
    };
    const whenLoaded = (cb: () => void) => (document.readyState === "complete" ? cb() : window.addEventListener("load", cb, { once: true }));
    whenLoaded(() => afterFirstPaint(release));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;

    const start = () =>
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
        .then(([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollTrigger);
          const q = <T extends HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));
          const once = (trigger: Element, start = "top 82%") => ({ trigger, start, once: true });

          const ctx = gsap.context(() => {
            q("[data-rise]").forEach((el) => {
              const kids = Array.from(el.children);
              gsap.from(kids.length ? kids : el, { y: 26, autoAlpha: 0, duration: 1.5, ease: "power2.out", stagger: 0.14, scrollTrigger: once(el) });
            });

            q("[data-badge]").forEach((el) => {
              const svg = el.querySelector("svg") ?? el;
              gsap.from(svg, { scale: 0.93, rotate: -6, autoAlpha: 0, duration: 2.2, ease: "power3.out", transformOrigin: "50% 50%", scrollTrigger: once(el, "top 80%") });
            });
          });
          revert = () => ctx.revert();
        })
        .catch(() => {
          /* Animation is an enhancement; failure leaves the static page intact. */
        });

    const onFirstInteraction = () => {
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
      void start();
    };
    events.forEach((e) => window.addEventListener(e, onFirstInteraction, { passive: true, once: true }));

    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
      revert?.();
    };
  }, []);

  return null;
}
