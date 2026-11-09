"use client";

import { useEffect } from "react";

/**
 * Scroll choreography.
 *
 * Performance contract: GSAP is not downloaded or executed until the visitor first
 * interacts (scroll / touch / key / pointer), so it can never compete with first
 * paint, LCP or initial hydration. It is skipped entirely under prefers-reduced-motion.
 * Nothing is hidden by CSS beforehand, so if this never runs the page is simply
 * complete and static. Elements already on screen when it starts are left alone,
 * so there is no flash of hide-then-reveal.
 *
 * Vocabulary (data attributes):
 *   data-rise      masked line rises into view
 *   data-reveal    fade + lift
 *   data-wipe      clip-path wipe left→right
 *   data-parallax  scrubbed vertical drift (value = strength, e.g. "0.2")
 */
const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.9;

export function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;

    const start = () =>
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
        .then(([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollTrigger);

          const ctx = gsap.context(() => {
            gsap.utils
              .toArray<HTMLElement>("[data-rise]")
              .filter((el) => belowFold(el.parentElement ?? el))
              .forEach((el) => {
                gsap.from(el, {
                  yPercent: 110,
                  duration: 1.1,
                  ease: "expo.out",
                  scrollTrigger: { trigger: el.parentElement ?? el, start: "top 90%", once: true },
                });
              });

            gsap.utils
              .toArray<HTMLElement>("[data-reveal]")
              .filter(belowFold)
              .forEach((el) => {
                gsap.from(el, {
                  autoAlpha: 0,
                  y: 36,
                  duration: 1,
                  ease: "power3.out",
                  delay: Number(el.dataset.delay ?? 0),
                  scrollTrigger: { trigger: el, start: "top 90%", once: true },
                });
              });

            gsap.utils
              .toArray<HTMLElement>("[data-wipe]")
              .filter(belowFold)
              .forEach((el) => {
                gsap.from(el, {
                  clipPath: "inset(0 100% 0 0)",
                  duration: 1.4,
                  ease: "expo.inOut",
                  scrollTrigger: { trigger: el, start: "top 88%", once: true },
                });
              });

            gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
              const strength = Number(el.dataset.parallax) || 0.15;
              const root = el.closest<HTMLElement>("[data-parallax-root]") ?? el;
              gsap.to(el, {
                yPercent: strength * 100,
                ease: "none",
                scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
              });
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
