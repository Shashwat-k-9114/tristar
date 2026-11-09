"use client";

import { useEffect } from "react";

/**
 * Scroll choreography — slow, fluid, purposeful.
 *
 * Performance contract: GSAP + ScrollTrigger are not downloaded until the visitor first interacts
 * (scroll / touch / key / pointer), so they never compete with first paint, LCP or hydration.
 * Skipped entirely under prefers-reduced-motion. All content is present in the HTML; every effect
 * animates only transform / clip-path / opacity, plays once or is scrubbed to scroll, and nothing is
 * pinned or hijacked.
 *
 *   data-mask      headline lines rise out of a mask
 *   data-rise      blocks of copy fade up with a gentle stagger
 *   data-reveal    photograph frames open upward (a curtain lifting)
 *   data-parallax  the picture drifts a few percent inside its frame
 *   data-light     each chapter's light swells as it crosses the viewport
 */
export function Motion() {
  useEffect(() => {
    // Ambient CSS loops (steam) stay paused through first paint; release them once the page is idle.
    // `full` also lifts the deferred layout (content-visibility) of below-the-fold sections once the first paint is long past.
    const goLive = () => document.documentElement.classList.add("live", "full");
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
    const release = () => (idle ? idle(goLive, { timeout: 1500 }) : setTimeout(goLive, 400));
    if (document.readyState === "complete") release();
    else window.addEventListener("load", release, { once: true });

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
            q("[data-mask]").forEach((el) => {
              gsap.from(el, { yPercent: 108, duration: 1.7, ease: "expo.out", scrollTrigger: once(el.parentElement ?? el, "top 88%") });
            });

            q("[data-rise]").forEach((el) => {
              const kids = Array.from(el.children).filter((c) => !c.querySelector("[data-mask]") || c.children.length > 0);
              gsap.from(kids.length ? kids : el, { y: 28, autoAlpha: 0, duration: 1.6, ease: "power2.out", stagger: 0.14, scrollTrigger: once(el) });
            });

            q("[data-reveal]").forEach((el) => {
              gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 2.2, ease: "power3.inOut", scrollTrigger: once(el, "top 85%") });
            });

            q("[data-parallax]").forEach((el) => {
              gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: el.closest("figure") ?? el, start: "top bottom", end: "bottom top", scrub: 1.2 } });
            });

            q("[data-light]").forEach((el) => {
              gsap.fromTo(el, { opacity: 0.25 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top 80%", end: "center center", scrub: 1.5 } });
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
