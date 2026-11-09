"use client";

import { useEffect } from "react";

/**
 * Scroll choreography — each food world gets its own transition language.
 *
 * Performance contract: GSAP + ScrollTrigger are not downloaded until the visitor first
 * interacts (scroll / touch / key / pointer), so they never compete with first paint, LCP or
 * hydration. Skipped entirely under prefers-reduced-motion. All content is present and
 * readable in the HTML; every effect animates only transform / clip-path / opacity and is
 * scrubbed to scroll (no scroll hijacking, no pinning).
 *
 *   biryani  slow rising curtain (heat haze): panel lifts from below, copy drifts up
 *   samosa   hard diagonal wipe in 5 snapped steps, letters knock in with rotation
 *   thali    iris opens from the plate's centre, bowls settle in a staggered orbit
 *   kinetic  the Heat / Crunch / Abundance lines slide against each other
 */
export function Motion() {
  useEffect(() => {
    // Ambient CSS loops (steam, ring) stay paused through first paint; release them once the page is idle.
    const goLive = () => document.documentElement.classList.add("live");
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
          const q = <T extends HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

          const ctx = gsap.context(() => {
            const scrub = (trigger: Element, start = "top 92%", end = "top 25%") => ({ trigger, start, end, scrub: 0.6 });

            // BIRYANI — a slow rising curtain, then the copy drifts up
            q("[data-world=biryani]").forEach((el) => {
              const bg = el.querySelector("[data-layer]");
              gsap.fromTo(el, { clipPath: "inset(14% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: scrub(el) });
              if (bg) gsap.fromTo(bg, { yPercent: 18 }, { yPercent: 0, ease: "none", scrollTrigger: scrub(el, "top bottom", "top top") });
              gsap.from(q(".copy > *", el), { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 60%", once: true } });
              gsap.from(q(".art", el), { y: 80, scale: 0.92, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 60%", once: true } });
            });

            // SAMOSA — angular wipe on a stepped ease, letters knock in
            q("[data-world=samosa]").forEach((el) => {
              gsap.fromTo(
                el,
                { clipPath: "polygon(0 0, 0% 0, -25% 100%, 0 100%)" },
                { clipPath: "polygon(0 0, 125% 0, 100% 100%, 0 100%)", ease: "steps(5)", scrollTrigger: scrub(el, "top 95%", "top 20%") },
              );
              gsap.from(q("[data-kinetic] span[aria-hidden]", el), {
                yPercent: 90,
                rotate: (i: number) => (i % 2 ? 9 : -9),
                autoAlpha: 0,
                stagger: 0.06,
                duration: 0.55,
                ease: "back.out(2)",
                scrollTrigger: { trigger: el, start: "top 55%", once: true },
              });
              gsap.from(q(".copy > :not([data-kinetic])", el), { x: 50, autoAlpha: 0, stagger: 0.07, duration: 0.5, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 55%", once: true } });
              gsap.from(q(".art", el), { x: -90, rotate: -6, duration: 0.6, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 60%", once: true } });
            });

            // THALI — iris from the centre, bowls orbit into place
            q("[data-world=thali]").forEach((el) => {
              gsap.fromTo(el, { clipPath: "circle(0% at 66% 52%)" }, { clipPath: "circle(120% at 66% 52%)", ease: "power1.inOut", scrollTrigger: scrub(el, "top 95%", "top 10%") });
              gsap.from(q(".art", el), { scale: 0.7, rotate: -40, duration: 2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 55%", once: true } });
              gsap.from(q(".copy > *", el), { y: 24, autoAlpha: 0, stagger: 0.1, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 55%", once: true } });
            });

            // KINETIC — the three words slide against each other as the section scrolls past
            q("[data-slide]").forEach((el, i) => {
              gsap.fromTo(el, { x: (i - 1) * 4 + "vw" }, { x: (1 - i) * 4 + "vw", ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.5 } });
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
