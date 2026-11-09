// Pure validation rules shared by the browser forms and the server API (no React / Node imports).
import { MENU } from "./menu";
import { BANQUET_MIN_DATE, OPENING, type House } from "./site";

export const phoneOk = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.length === 10 || (d.length === 12 && d.startsWith("91")) || (d.length === 11 && d.startsWith("0"));
};

export const SLOTS: Record<House, string[]> = {
  "Utkal Biryani House": ["07:00 PM (Dinner)", "08:00 PM (Dinner)", "09:00 PM (Dinner)", "10:00 PM (Last seating)"],
  "The Kalinga Kitchen": [
    "12:30 PM (Lunch)", "01:30 PM (Lunch)", "02:30 PM (Lunch)",
    "07:00 PM (Dinner)", "08:00 PM (Dinner)", "09:00 PM (Dinner)", "10:00 PM (Late Dinner)",
  ],
};
export const HOUSES = Object.keys(SLOTS) as House[];
export const GUESTS = ["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests", "6 Guests", "7 Guests", "8 Guests", "9–15 Guests"];
export const EVENT_TYPES = ["Wedding Reception", "Wedding Ceremony", "Engagement / Roka", "Birthday", "Anniversary", "Corporate Event", "Other"];

/** Today (YYYY-MM-DD) in India, where the restaurant operates. */
export const todayIST = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);

export type Parsed<T> = { ok: true; data: T } | { ok: false; error: string };

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + "T00:00:00Z"));

export interface OrderInput { name: string; phone: string; email: string; items: { id: number; qty: number }[] }
export interface ReservationInput { name: string; phone: string; email: string; date: string; time: string; guests: string; seating: House }
export interface EnquiryInput { name: string; phone: string; email: string; type: string; date: string; guests: number }

/** Optional email: empty is allowed; anything entered must look like an address. */
export const emailOk = (v: string) => v === "" || /^[^\s@<>",;]{1,64}@[^\s@<>",;]+\.[^\s@<>",;]{2,}$/.test(v);

function contact(b: Record<string, unknown>): Parsed<{ name: string; phone: string; email: string }> {
  const name = str(b.name, 80), phone = str(b.phone, 20), email = str(b.email, 120).toLowerCase();
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!phoneOk(phone)) return { ok: false, error: "Enter a valid 10-digit phone number." };
  if (!emailOk(email)) return { ok: false, error: "That email address doesn't look right." };
  return { ok: true, data: { name, phone, email } };
}

export function parseOrder(b: Record<string, unknown>): Parsed<OrderInput> {
  const c = contact(b);
  if (!c.ok) return c;
  if (!Array.isArray(b.items) || b.items.length < 1 || b.items.length > 60) return { ok: false, error: "Your order is empty." };
  const seen = new Map<number, number>();
  for (const it of b.items as { id?: unknown; qty?: unknown }[]) {
    const id = Number(it?.id), qty = Number(it?.qty);
    const m = MENU.find((x) => x.id === id);
    if (!m || m.price == null) return { ok: false, error: "An item in your order is no longer available." };
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) return { ok: false, error: "Invalid quantity." };
    seen.set(id, (seen.get(id) || 0) + qty);
  }
  return { ok: true, data: { ...c.data, items: [...seen].map(([id, qty]) => ({ id, qty })) } };
}

export function parseReservation(b: Record<string, unknown>): Parsed<ReservationInput> {
  const c = contact(b);
  if (!c.ok) return c;
  const seating = str(b.seating, 40) as House, date = str(b.date, 10), time = str(b.time, 40), guests = str(b.guests, 20);
  if (!HOUSES.includes(seating)) return { ok: false, error: "Please choose a house." };
  const open = OPENING[seating], min = open > todayIST() ? open : todayIST();
  if (!isDate(date) || date < min) return { ok: false, error: "Please choose a valid date." };
  if (!SLOTS[seating].includes(time)) return { ok: false, error: "Please choose an available time." };
  if (!GUESTS.includes(guests)) return { ok: false, error: "Please choose the number of guests." };
  return { ok: true, data: { ...c.data, date, time, guests, seating } };
}

export function parseEnquiry(b: Record<string, unknown>): Parsed<EnquiryInput> {
  const c = contact(b);
  if (!c.ok) return c;
  const type = str(b.type, 40), date = str(b.date, 10), guests = Number(b.guests);
  if (!EVENT_TYPES.includes(type)) return { ok: false, error: "Please choose an event type." };
  if (!isDate(date) || date < BANQUET_MIN_DATE) return { ok: false, error: "Enquiries are open for dates from 15 August 2027." };
  if (!Number.isInteger(guests) || guests < 50 || guests > 100) return { ok: false, error: "Guests must be between 50 and 100." };
  return { ok: true, data: { ...c.data, type, date, guests } };
}
