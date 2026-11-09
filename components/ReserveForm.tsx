"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SELECT_HOUSE_EVENT } from "./LaunchCards";
import { useShop } from "./Shop";
import { SLOTS, fmtD, minFor, phoneOk, todayStr, useFieldErrors } from "@/lib/forms";
import { OPENING, type House } from "@/lib/site";

const DEFAULT_HOUSE: House = "Utkal Biryani House";
const DEFAULT_GUESTS = "2 Guests";
const GUESTS = ["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests", "6 Guests", "7 Guests", "8 Guests", "9–15 Guests"];

export function ReserveForm() {
  const { save, confirmBox } = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [seat, setSeat] = useState<House>(DEFAULT_HOUSE);
  const [time, setTime] = useState(SLOTS[DEFAULT_HOUSE][0]);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(DEFAULT_GUESTS);
  const [ready, setReady] = useState(false); // dates depend on "today", so they are filled in on the client
  const { errs, setErrs, clear } = useFieldErrors();

  // choose a house: keep the time/date when possible (keep) or reset the date to the earliest bookable
  const pickHouse = (h: House, keep: boolean) => {
    setSeat(h);
    setTime((t) => (SLOTS[h].includes(t) ? t : SLOTS[h][0]));
    const m = minFor(h);
    setDate((d) => (!keep || !d || d < m ? m : d));
  };

  useEffect(() => {
    // depends on the visitor's "today": filled in after hydration to avoid a mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
    setDate(minFor(DEFAULT_HOUSE));
  }, []);

  useEffect(() => {
    const on = (e: Event) => {
      const h = (e as CustomEvent<string>).detail as House;
      if (h in OPENING) pickHouse(h, false);
    };
    window.addEventListener(SELECT_HOUSE_EVENT, on);
    return () => window.removeEventListener(SELECT_HOUSE_EVENT, on);
  }, []);

  const min = ready ? minFor(seat) : undefined;
  const opens = OPENING[seat];
  const hint = ready
    ? (opens && opens > todayStr() ? seat + " opens " + fmtD(opens) + "." : "") +
      (seat === "Utkal Biryani House" ? " Open terrace dining, bookings 7 – 10 PM." : "")
    : "";
  const dateErr = ready && min ? "Choose " + fmtD(min) + " or later." : "Choose a date on or after opening.";

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bad = {
      name: name.trim().length <= 1,
      phone: !phoneOk(phone),
      date: !(date && date >= minFor(seat)),
    };
    setErrs(bad);
    if (bad.name || bad.phone || bad.date) {
      const first = (["name", "phone", "date"] as const).find((k) => bad[k]);
      (e.currentTarget.elements.namedItem(first!) as HTMLInputElement | null)?.focus();
      return;
    }
    const d = { name: name.trim(), phone: phone.trim(), date, time, guests, seating: seat };
    const ref = save("reservation", d);
    confirmBox(
      "Booking requested",
      [<><b>{d.name}</b>, we have your request.</>, <>{d.date} · {d.time}<br />{d.guests} · {d.seating}</>],
      ref,
      `Hello TriStar 1947, pre-launch table booking (${ref}): ${d.guests}, ${d.date} at ${d.time}, ${d.seating}. Name: ${d.name}, Phone: ${d.phone}`,
    );
    setName("");
    setPhone("");
    setGuests(DEFAULT_GUESTS);
    setSeat(DEFAULT_HOUSE);
    setTime(SLOTS[DEFAULT_HOUSE][0]);
    setDate(minFor(DEFAULT_HOUSE));
  };

  const cls = (k: string) => `fld${errs[k] ? " err" : ""}`;
  return (
    <form className="card rv" id="rsvForm" noValidate onSubmit={submit}>
      <div className="row2">
        <div className={cls("name")}>
          <label htmlFor="r-name">Name</label>
          <input id="r-name" name="name" placeholder="Your name" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); clear("name"); }} />
          <div className="em">Please enter your name.</div>
        </div>
        <div className={cls("phone")}>
          <label htmlFor="r-phone">Phone</label>
          <input id="r-phone" name="phone" type="tel" inputMode="tel" placeholder="+91 91234 56789" autoComplete="tel" value={phone} onChange={(e) => { setPhone(e.target.value); clear("phone"); }} />
          <div className="em">Enter a valid 10-digit number.</div>
        </div>
      </div>
      <div className="row2">
        <div className={cls("date")}>
          <label htmlFor="r-date">Date</label>
          <input id="r-date" name="date" type="date" min={min} value={date} onChange={(e) => { setDate(e.target.value); clear("date"); }} />
          <div className="em" id="r-em">{dateErr}</div>
          <div className="hint" id="r-hint">{hint}</div>
        </div>
        <div className="fld">
          <label htmlFor="r-time">Time</label>
          <select id="r-time" name="time" value={time} onChange={(e) => setTime(e.target.value)}>
            {SLOTS[seat].map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
      </div>
      <div className="fld">
        <label htmlFor="r-guests">Guests</label>
        <select id="r-guests" name="guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
          {GUESTS.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div className="fld">
        <span className="lbl">Seating</span>
        <div className="seats">
          {(["Utkal Biryani House", "The Kalinga Kitchen"] as House[]).map((h) => (
            <label key={h}>
              <input type="radio" name="seat" value={h} checked={seat === h} onChange={() => pickHouse(h, true)} />
              <span>{h === "Utkal Biryani House" ? "Utkal Biryani House · Open Terrace" : h}</span>
            </label>
          ))}
        </div>
      </div>
      <button className="pill" type="submit">Confirm reservation</button>
    </form>
  );
}
