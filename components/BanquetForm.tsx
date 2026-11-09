"use client";

import { useState, type FormEvent } from "react";
import { useShop } from "./Shop";
import { phoneOk, useFieldErrors } from "@/lib/forms";
import { BANQUET_MIN_DATE } from "@/lib/site";

const TYPES = ["Wedding Reception", "Wedding Ceremony", "Engagement / Roka", "Birthday", "Anniversary", "Corporate Event", "Other"];

export function BanquetForm() {
  const { save, confirmBox } = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const { errs, setErrs, clear } = useFieldErrors();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const g = +guests;
    const bad = {
      name: name.trim().length <= 1,
      phone: !phoneOk(phone),
      date: !(date && date >= BANQUET_MIN_DATE),
      guests: !(g >= 50 && g <= 100),
    };
    setErrs(bad);
    if (bad.name || bad.phone || bad.date || bad.guests) {
      const first = (["name", "phone", "date", "guests"] as const).find((k) => bad[k]);
      (e.currentTarget.elements.namedItem(first!) as HTMLInputElement | null)?.focus();
      return;
    }
    const d = { name: name.trim(), phone: phone.trim(), type, date, guests: g };
    const ref = save("banquet", d);
    confirmBox(
      "Enquiry received",
      [<>Thank you, <b>{d.name}</b>.</>, `${d.type} · ${d.guests} guests · ${d.date}`],
      ref,
      `Hello TriStar 1947, banquet enquiry (${ref}): ${d.type}, ${d.guests} guests on ${d.date}. Name: ${d.name}, Phone: ${d.phone}`,
    );
    setName("");
    setPhone("");
    setType(TYPES[0]);
    setDate("");
    setGuests("");
  };

  const cls = (k: string) => `fld${errs[k] ? " err" : ""}`;
  return (
    <form className="card rv" id="bqForm" noValidate onSubmit={submit}>
      <h3>Enquire about your event</h3>
      <p className="sm">Enquiries are open for dates from 15 August 2027. We&apos;ll call you with availability and a quote.</p>
      <div className={cls("name")}>
        <label htmlFor="bq-name">Full name</label>
        <input id="bq-name" name="name" placeholder="e.g. Ramesh Mohanty" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); clear("name"); }} />
        <div className="em">Please enter your name.</div>
      </div>
      <div className={cls("phone")}>
        <label htmlFor="bq-phone">Phone</label>
        <input id="bq-phone" name="phone" type="tel" inputMode="tel" placeholder="+91 98765 43210" autoComplete="tel" value={phone} onChange={(e) => { setPhone(e.target.value); clear("phone"); }} />
        <div className="em">Enter a valid 10-digit number.</div>
      </div>
      <div className="fld">
        <label htmlFor="bq-type">Event</label>
        <select id="bq-type" name="type" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="row2">
        <div className={cls("date")}>
          <label htmlFor="bq-date">Date</label>
          <input id="bq-date" name="date" type="date" min={BANQUET_MIN_DATE} value={date} onChange={(e) => { setDate(e.target.value); clear("date"); }} />
          <div className="em">Enquiries for dates from 15 August 2027.</div>
        </div>
        <div className={cls("guests")}>
          <label htmlFor="bq-guests">Guests</label>
          <input id="bq-guests" name="guests" type="number" min={50} max={100} inputMode="numeric" placeholder="e.g. 75" value={guests} onChange={(e) => { setGuests(e.target.value); clear("guests"); }} />
          <div className="em">Between 50 and 100.</div>
        </div>
      </div>
      <button className="pill" type="submit">Send enquiry</button>
    </form>
  );
}
