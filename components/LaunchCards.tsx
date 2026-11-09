"use client";

import { useEffect, useState } from "react";

export const SELECT_HOUSE_EVENT = "ts:select-house";

const countdown = (date: string) => {
  const n = Math.ceil((+new Date(date + "T00:00:00") - +new Date()) / 864e5);
  return n > 1 ? n + " days to go" : n === 1 ? "Opens tomorrow" : n === 0 ? "Opens today" : "Now open";
};

function Countdown({ date }: { date: string }) {
  const [t, setT] = useState("");
  // depends on the visitor's "today": computed after hydration to avoid a mismatch
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setT(countdown(date)), [date]);
  return <span className="cd" data-date={date}>{t}</span>;
}

export function LaunchCards() {
  const pick = (house: string) => () =>
    window.dispatchEvent(new CustomEvent(SELECT_HOUSE_EVENT, { detail: house }));
  return (
    <div className="launch">
      <a className="lc rv" href="#reserve" data-house="The Kalinga Kitchen" onClick={pick("The Kalinga Kitchen")}>
        <span className="k">Opening</span><b className="d">26 January 2027</b><span className="n">The Kalinga Kitchen · First floor</span>
        <Countdown date="2027-01-26" /><span className="lnk">Pre-book a table</span>
      </a>
      <a className="lc rv" href="#reserve" data-house="Utkal Biryani House" onClick={pick("Utkal Biryani House")}>
        <span className="k">Opening</span><b className="d">14 February 2027</b><span className="n">Utkal Biryani House · Open terrace</span>
        <Countdown date="2027-02-14" /><span className="lnk">Pre-book a table</span>
      </a>
      <a className="lc rv" href="#chilika">
        <span className="k">Opening</span><b className="d">Coming soon</b><span className="n">Chilika Banquet</span>
        <span className="cd">Weddings &amp; celebrations</span><span className="lnk">Know more</span>
      </a>
    </div>
  );
}
