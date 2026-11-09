"use client";

import Image from "next/image";
import { useState } from "react";

export function DayNight() {
  const [v, setV] = useState<"night" | "day">("night");
  return (
    <>
      <div className="seg-ctl dk vis-ctl" id="dn" role="tablist" aria-label="Time of day">
        <button className={v === "night" ? "on" : ""} data-v="night" onClick={() => setV("night")}>Evening</button>
        <button className={v === "day" ? "on" : ""} data-v="day" onClick={() => setV("day")}>Day</button>
      </div>
      <div className="vis">
        <Image id="vDay" className={v === "day" ? "on" : ""} src="/img/building-day.jpg" width={1010} height={948} sizes="(max-width:1000px) 100vw, 620px" alt="TriStar 1947 building by day" loading="lazy" />
        <Image id="vNight" className={v === "night" ? "on" : ""} src="/img/building-night.jpg" width={1082} height={1003} sizes="(max-width:1000px) 100vw, 620px" alt="TriStar 1947 building in the evening" loading="lazy" />
      </div>
    </>
  );
}
