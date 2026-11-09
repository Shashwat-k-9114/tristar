"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SELECT_HOUSE_EVENT } from "./LaunchCards";
import { useShop } from "./Shop";
import { GUESTS, SLOTS, fmtD, minFor, phoneOk, todayStr, useFieldErrors } from "@/lib/forms";
import { emailOk } from "@/lib/validate";
import { OPENING, type House } from "@/lib/site";
import { submitForm } from "@/lib/submit";

const DEFAULT_HOUSE: House = "Utkal Biryani House";
const DEFAULT_GUESTS = "2 Guests";

export function ReserveForm() {
  const { confirmBox } = useShop();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const bad = {
      name: name.trim().length <= 1,
      phone: !phoneOk(phone),
      email: !emailOk(email.trim()),
      date: !(date && date >= minFor(seat)),
    };
    setErrs(bad);
    if (bad.name || bad.phone || bad.email || bad.date) {
      const first = (["name", "phone", "email", "date"] as const).find((k) => bad[k]);
      (form.elements.namedItem(first!) as HTMLInputElement | null)?.focus();
      return;
    }
    const d = { name: name.trim(), phone: phone.trim(), email: email.trim(), date, time, guests, seating: seat };
    setSending(true);
    setError("");
    const r = await submitForm("reservation", { ...d, website: (new FormData(form).get("website") as string) || "" });
    setSending(false);
    if (!r.ok) return setError(r.error);
    const ref = r.ref;
    confirmBox(
      "Booking requested",
      [<><b>{d.name}</b>, we have your request.</>, <>{d.date} · {d.time}<br />{d.guests} · {d.seating}</>],
      ref,
      `Hello TriStar 1947, pre-launch table booking (${ref}): ${d.guests}, ${d.date} at ${d.time}, ${d.seating}. Name: ${d.name}, Phone: ${d.phone}`,
    );
    setName("");
    setPhone("");
    setEmail("");
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
      <div className={cls("email")}>
        <label htmlFor="r-email">Email <span style={{ opacity: 0.6 }}>(for your confirmation)</span></label>
        <input id="r-email" name="email" type="email" inputMode="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); clear("email"); }} />
        <div className="em">Enter a valid email address.</div>
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
      <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? <p className="form-err" role="alert">{error}</p> : null}
      <button className="pill" type="submit" disabled={sending}>{sending ? "Sending…" : "Confirm reservation"}</button>
    </form>
  );
}
