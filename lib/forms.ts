// Validation + form helpers shared by the banquet, reservation and order forms.
import { useState } from "react";
import { OPENING, type House } from "./site";

export const phoneOk = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.length === 10 || (d.length === 12 && d.startsWith("91")) || (d.length === 11 && d.startsWith("0"));
};

/** Today as YYYY-MM-DD in the visitor's local time zone. */
export const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export const fmtD = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export const minFor = (h: string) => {
  const o = (OPENING as Record<string, string>)[h] || todayStr();
  return o > todayStr() ? o : todayStr();
};

/** Per-field error flags; an error clears as soon as the user edits that field. */
export function useFieldErrors() {
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const clear = (k: string) => setErrs((e) => (e[k] ? { ...e, [k]: false } : e));
  return { errs, setErrs, clear };
}

export const SLOTS: Record<House, string[]> = {
  "Utkal Biryani House": ["07:00 PM (Dinner)", "08:00 PM (Dinner)", "09:00 PM (Dinner)", "10:00 PM (Last seating)"],
  "The Kalinga Kitchen": [
    "12:30 PM (Lunch)", "01:30 PM (Lunch)", "02:30 PM (Lunch)",
    "07:00 PM (Dinner)", "08:00 PM (Dinner)", "09:00 PM (Dinner)", "10:00 PM (Late Dinner)",
  ],
};
