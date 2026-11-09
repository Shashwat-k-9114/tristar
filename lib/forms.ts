// Validation + form helpers shared by the banquet, reservation and order forms.
import { useState } from "react";
import { OPENING } from "./site";

export { phoneOk, SLOTS, GUESTS, EVENT_TYPES } from "./validate";

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
