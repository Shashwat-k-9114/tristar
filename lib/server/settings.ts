import "server-only";
import { emailOk } from "../validate";
import { ALL_TABS, KINDS, SETTINGS_TAB, type Kind } from "./records";
import { getStore } from "./store";

export interface Settings {
  /** Staff addresses that get a notification for every new order / reservation / enquiry. */
  adminEmails: string[];
  /** Per-type switches for the staff notification. */
  notify: Record<Kind, boolean>;
  /** Send the guest a confirmation email when they supply an address. */
  customerConfirmations: boolean;
}

const KEYS = {
  adminEmails: "admin_emails",
  customerConfirmations: "customer_confirmations",
  notify: { order: "notify_order", reservation: "notify_reservation", enquiry: "notify_enquiry" } as Record<Kind, string>,
};

export const parseEmailList = (v: string) =>
  Array.from(new Set(v.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean)));

const defaults = (): Settings => ({
  adminEmails: parseEmailList(process.env.ADMIN_EMAILS ?? ""),
  notify: { order: true, reservation: true, enquiry: true },
  customerConfirmations: true,
});

export async function getSettings(): Promise<Settings> {
  const store = getStore();
  await store.ensure(ALL_TABS);
  const rows = await store.read(SETTINGS_TAB);
  const map = new Map(rows.slice(1).map((r) => [r[0], r[1] ?? ""]));
  const d = defaults();
  const flag = (k: string, fallback: boolean) => (map.has(k) ? map.get(k) !== "0" : fallback);
  return {
    adminEmails: map.has(KEYS.adminEmails) ? parseEmailList(map.get(KEYS.adminEmails)!) : d.adminEmails,
    customerConfirmations: flag(KEYS.customerConfirmations, d.customerConfirmations),
    notify: Object.fromEntries(KINDS.map((k) => [k, flag(KEYS.notify[k], d.notify[k])])) as Record<Kind, boolean>,
  };
}

export type SettingsPatch = Partial<{ adminEmails: string[]; notify: Partial<Record<Kind, boolean>>; customerConfirmations: boolean }>;

export function validatePatch(p: SettingsPatch): string | null {
  if (p.adminEmails) {
    if (p.adminEmails.length > 10) return "You can add up to 10 admin email addresses.";
    const bad = p.adminEmails.find((e) => !e || !emailOk(e));
    if (bad !== undefined) return `"${bad}" is not a valid email address.`;
  }
  return null;
}

export async function saveSettings(p: SettingsPatch): Promise<Settings> {
  const store = getStore();
  await store.ensure(ALL_TABS);
  const rows = await store.read(SETTINGS_TAB);
  const at = new Date().toISOString();

  const entries: [string, string][] = [];
  if (p.adminEmails) entries.push([KEYS.adminEmails, Array.from(new Set(p.adminEmails.map((e) => e.trim().toLowerCase()))).join(", ")]);
  if (p.customerConfirmations !== undefined) entries.push([KEYS.customerConfirmations, p.customerConfirmations ? "1" : "0"]);
  for (const k of KINDS) if (p.notify?.[k] !== undefined) entries.push([KEYS.notify[k], p.notify[k] ? "1" : "0"]);

  for (const [key, value] of entries) {
    const idx = rows.findIndex((r, i) => i > 0 && r[0] === key);
    if (idx >= 0) {
      await store.update(SETTINGS_TAB, idx + 1, 1, [value, at]);
    } else {
      await store.append(SETTINGS_TAB, [key, value, at]);
      rows.push([key, value, at]);
    }
  }
  return getSettings();
}
