"use client";

import { useState, type FormEvent } from "react";
import { useShop } from "./Shop";
import { EVENT_TYPES, phoneOk, useFieldErrors } from "@/lib/forms";
import { emailOk } from "@/lib/validate";
import { BANQUET_MIN_DATE } from "@/lib/site";
import { submitForm } from "@/lib/submit";

const TYPES = EVENT_TYPES;

export function BanquetForm() {
  const { confirmBox } = useShop();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const { errs, setErrs, clear } = useFieldErrors();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const g = +guests;
    const bad = {
      name: name.trim().length <= 1,
      phone: !phoneOk(phone),
      email: !emailOk(email.trim()),
      date: !(date && date >= BANQUET_MIN_DATE),
      guests: !(g >= 50 && g <= 100),
    };
    setErrs(bad);
    if (bad.name || bad.phone || bad.email || bad.date || bad.guests) {
      const first = (["name", "phone", "email", "date", "guests"] as const).find((k) => bad[k]);
      (form.elements.namedItem(first!) as HTMLInputElement | null)?.focus();
      return;
    }
    const d = { name: name.trim(), phone: phone.trim(), email: email.trim(), type, date, guests: g };
    setSending(true);
    setError("");
    const r = await submitForm("enquiry", { ...d, website: (new FormData(form).get("website") as string) || "" });
    setSending(false);
    if (!r.ok) return setError(r.error);
    const ref = r.ref;
    confirmBox(
      "Enquiry received",
      [<>Thank you, <b>{d.name}</b>.</>, `${d.type} · ${d.guests} guests · ${d.date}`],
      ref,
      `Hello TriStar 1947, banquet enquiry (${ref}): ${d.type}, ${d.guests} guests on ${d.date}. Name: ${d.name}, Phone: ${d.phone}`,
    );
    setName("");
    setPhone("");
    setEmail("");
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
      <div className={cls("email")}>
        <label htmlFor="bq-email">Email <span style={{ opacity: 0.6 }}>(for your confirmation)</span></label>
        <input id="bq-email" name="email" type="email" inputMode="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); clear("email"); }} />
        <div className="em">Enter a valid email address.</div>
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
      <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? <p className="form-err" role="alert">{error}</p> : null}
      <button className="pill" type="submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry"}</button>
    </form>
  );
}
