"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const TEXT =
  "The recipe has been carried down in our family from my great-grandmother. Every dish at The Kalinga Kitchen follows the cooking she handed down — the spice blends, the slow pots, the Odia rasoi as it was meant to be eaten.";
const WORDS = TEXT.trim().split(/\s+/);

/** Story paragraph whose words light up as it scrolls into view. */
export function StoryText() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const paint = () => {
      if (reduce) return setN(WORDS.length);
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect(),
        vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.78 - r.top) / (r.height + vh * 0.18)));
      setN(Math.round(p * WORDS.length));
    };
    addEventListener("scroll", paint, { passive: true });
    addEventListener("resize", paint);
    paint();
    return () => {
      removeEventListener("scroll", paint);
      removeEventListener("resize", paint);
    };
  }, []);

  return (
    <p className="big" id="big" ref={ref}>
      {WORDS.map((w, i) => (
        <Fragment key={i}>
          <span className={`w${i < n ? " on" : ""}`}>{w}</span>
          {i < WORDS.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
  );
}
