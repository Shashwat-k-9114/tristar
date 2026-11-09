import "server-only";
import { randomInt } from "node:crypto";
import { MENU, rupee } from "../menu";
import type { EnquiryInput, OrderInput, ReservationInput } from "../validate";
import { getStore } from "./store";

export type Kind = "order" | "reservation" | "enquiry";
export interface OrderLine { name: string; qty: number; price: number }
export const KINDS: Kind[] = ["order", "reservation", "enquiry"];
export const STATUSES = ["New", "Confirmed", "Completed", "Cancelled"] as const;

export const TABS: Record<Kind, string> = { order: "Orders", reservation: "Reservations", enquiry: "Banquet Enquiries" };
const PREFIX: Record<Kind, string> = { order: "ORD", reservation: "RES", enquiry: "BNQ" };

/** Sheet header rows. Columns are only ever appended (Email was added last) so existing sheets keep working. */
export const COLUMNS: Record<Kind, string[]> = {
  order: ["Ref", "Created At", "Name", "Phone", "Items", "Total (₹)", "Status", "Notes", "Email"],
  reservation: ["Ref", "Created At", "Name", "Phone", "Date", "Time", "Guests", "Seating", "Status", "Notes", "Email"],
  enquiry: ["Ref", "Created At", "Name", "Phone", "Event", "Event Date", "Guests", "Status", "Notes", "Email"],
};

export const SETTINGS_TAB = "Settings";
export const SETTINGS_COLUMNS = ["Key", "Value", "Updated At"];

export const ALL_TABS: Record<string, string[]> = {
  ...Object.fromEntries(KINDS.map((k) => [TABS[k], COLUMNS[k]])),
  [SETTINGS_TAB]: SETTINGS_COLUMNS,
};
const statusCol = (k: Kind) => COLUMNS[k].indexOf("Status");

const newRef = (k: Kind) => {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return PREFIX[k] + "-" + Array.from({ length: 6 }, () => A[randomInt(A.length)]).join("");
};

export async function createRecord(
  kind: Kind,
  d: OrderInput | ReservationInput | EnquiryInput,
): Promise<{ ref: string; at: string; total: number; lines: OrderLine[]; summary: Record<string, string> }> {
  const store = getStore();
  await store.ensure(ALL_TABS);
  const ref = newRef(kind), at = new Date().toISOString();
  let row: (string | number)[], summary: Record<string, string>;
  let totalNum = 0;
  const lines: OrderLine[] = [];

  if (kind === "order") {
    const o = d as OrderInput;
    let total = 0;
    const items = o.items.map(({ id, qty }) => {
      const m = MENU.find((x) => x.id === id)!; // prices always come from the server-side menu
      total += (m.price as number) * qty;
      lines.push({ name: m.name, qty, price: m.price as number });
      return `${qty}× ${m.name}`;
    });
    row = [ref, at, o.name, o.phone, items.join(", "), total, "New", "", o.email];
    summary = { items: items.join(", "), total: rupee(total) };
    totalNum = total;
  } else if (kind === "reservation") {
    const r = d as ReservationInput;
    row = [ref, at, r.name, r.phone, r.date, r.time, r.guests, r.seating, "New", "", r.email];
    summary = {};
  } else {
    const e = d as EnquiryInput;
    row = [ref, at, e.name, e.phone, e.type, e.date, e.guests, "New", "", e.email];
    summary = {};
  }
  await store.append(TABS[kind], row);
  return { ref, at, total: totalNum, lines, summary };
}

export type RecordRow = Record<string, string> & { _row: string };

export async function listRecords(kind: Kind): Promise<{ columns: string[]; rows: RecordRow[] }> {
  const store = getStore();
  await store.ensure(ALL_TABS);
  const cols = COLUMNS[kind];
  const data = await store.read(TABS[kind]);
  const rows = data
    .slice(1)
    .map((r, i) => {
      const o: Record<string, string> = { _row: String(i + 2) };
      cols.forEach((c, j) => (o[c] = r[j] ?? ""));
      return o as RecordRow;
    })
    .filter((r) => r.Ref)
    .reverse(); // newest first
  return { columns: cols, rows };
}

export async function updateRecord(kind: Kind, ref: string, patch: { status?: string; notes?: string }) {
  const store = getStore();
  await store.ensure(ALL_TABS);
  const data = await store.read(TABS[kind]);
  const idx = data.findIndex((r, i) => i > 0 && r[0] === ref);
  if (idx < 0) return false;
  const cur = data[idx];
  const sc = statusCol(kind);
  const status = patch.status ?? cur[sc] ?? "New";
  const notes = patch.notes ?? cur[sc + 1] ?? "";
  await store.update(TABS[kind], idx + 1, sc, [status, notes]);
  return true;
}
