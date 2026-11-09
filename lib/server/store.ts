import "server-only";
import { createSign } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/** Minimal storage interface: the Google Sheet in production, a JSON file for local development. */
export interface Store {
  ensure(tabs: Record<string, string[]>): Promise<void>;
  append(tab: string, row: (string | number)[]): Promise<void>;
  read(tab: string): Promise<string[][]>;
  /** Overwrite cells in one row starting at a 0-based column. `rowNumber` is 1-based (row 1 = header). */
  update(tab: string, rowNumber: number, startCol: number, values: (string | number)[]): Promise<void>;
}

const colLetter = (i: number) => {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
};

/* ------------------------------ Google Sheets ------------------------------ */

class GoogleSheetStore implements Store {
  private token?: { value: string; exp: number };
  private ready = false;

  constructor(
    private sheetId: string,
    private email: string,
    private privateKey: string,
  ) {}

  private async accessToken() {
    const now = Math.floor(Date.now() / 1000);
    if (this.token && this.token.exp - 60 > now) return this.token.value;
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const unsigned =
      b64({ alg: "RS256", typ: "JWT" }) +
      "." +
      b64({
        iss: this.email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      });
    const sig = createSign("RSA-SHA256").update(unsigned).sign(this.privateKey).toString("base64url");
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: unsigned + "." + sig }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Google auth failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    const j = (await res.json()) as { access_token: string; expires_in: number };
    this.token = { value: j.access_token, exp: now + j.expires_in };
    return j.access_token;
  }

  private async api<T>(pathAndQuery: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}${pathAndQuery}`, {
      ...init,
      headers: { Authorization: `Bearer ${await this.accessToken()}`, "Content-Type": "application/json", ...init.headers },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Sheets API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return (await res.json()) as T;
  }

  private rng = (tab: string, a1: string) => encodeURIComponent(`'${tab.replace(/'/g, "''")}'!${a1}`);

  async ensure(tabs: Record<string, string[]>) {
    if (this.ready) return;
    const meta = await this.api<{ sheets: { properties: { title: string } }[] }>("?fields=sheets.properties.title");
    const have = new Set(meta.sheets.map((s) => s.properties.title));
    const missing = Object.keys(tabs).filter((t) => !have.has(t));
    // existing tabs: add any header cells introduced by newer versions of the app (never touches data rows)
    for (const t of Object.keys(tabs).filter((t) => have.has(t))) {
      const cur = (await this.read(t))[0] ?? [];
      const want = tabs[t];
      if (cur.length < want.length) {
        await this.update(t, 1, cur.length, want.slice(cur.length));
      }
    }
    if (missing.length) {
      await this.api(":batchUpdate", {
        method: "POST",
        body: JSON.stringify({
          requests: missing.map((title) => ({ addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } } })),
        }),
      });
      for (const t of missing) {
        await this.api(`/values/${this.rng(t, "A1")}?valueInputOption=RAW`, {
          method: "PUT",
          body: JSON.stringify({ values: [tabs[t]] }),
        });
      }
    }
    this.ready = true;
  }

  async append(tab: string, row: (string | number)[]) {
    await this.api(`/values/${this.rng(tab, "A:A")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      body: JSON.stringify({ values: [row] }),
    });
  }

  async read(tab: string) {
    const j = await this.api<{ values?: string[][] }>(`/values/${this.rng(tab, "A:Z")}`);
    return j.values ?? [];
  }

  async update(tab: string, rowNumber: number, startCol: number, values: (string | number)[]) {
    const a1 = `${colLetter(startCol)}${rowNumber}:${colLetter(startCol + values.length - 1)}${rowNumber}`;
    await this.api(`/values/${this.rng(tab, a1)}?valueInputOption=RAW`, { method: "PUT", body: JSON.stringify({ values: [values] }) });
  }
}

/* ------------- Apps Script web app (free, no Google Cloud / billing) ------------- */

class AppsScriptStore implements Store {
  private ready = false;

  constructor(
    private url: string,
    private secret: string,
  ) {}

  private async call<T = unknown>(action: string, payload: object = {}): Promise<T> {
    // Apps Script answers a POST with a redirect to the result; fetch follows it automatically.
    const res = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret: this.secret, action, ...payload }),
      cache: "no-store",
      redirect: "follow",
    });
    const text = await res.text();
    let j: { ok?: boolean; error?: string } & T;
    try {
      j = JSON.parse(text);
    } catch {
      throw new Error(`Apps Script returned a non-JSON response (${res.status}). Check the deployment is set to "Anyone".`);
    }
    if (!j.ok) throw new Error(`Apps Script error: ${j.error ?? "unknown"}`);
    return j;
  }

  raw(action: string, payload: object) {
    return this.call(action, payload);
  }

  async ensure(tabs: Record<string, string[]>) {
    if (this.ready) return;
    await this.call("ensure", { tabs });
    this.ready = true;
  }
  async append(tab: string, row: (string | number)[]) {
    await this.call("append", { tab, row });
  }
  async read(tab: string) {
    return (await this.call<{ values?: string[][] }>("read", { tab })).values ?? [];
  }
  async update(tab: string, rowNumber: number, startCol: number, values: (string | number)[]) {
    await this.call("update", { tab, row: rowNumber, col: startCol, values });
  }
}

/** Call a raw action on the Apps Script web app (used for sending email). Throws if Apps Script is not configured. */
export async function appsScriptCall(action: string, payload: object): Promise<void> {
  const url = process.env.APPS_SCRIPT_URL, secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) throw new ConfigError("Apps Script is not configured.");
  await new AppsScriptStore(url, secret).raw(action, payload);
}

/* --------------------------- Local file (dev only) --------------------------- */

class LocalFileStore implements Store {
  private file = path.join(process.cwd(), ".data", "store.json");

  private async load(): Promise<Record<string, (string | number)[][]>> {
    try {
      return JSON.parse(await fs.readFile(this.file, "utf8"));
    } catch {
      return {};
    }
  }
  private async save(d: Record<string, (string | number)[][]>) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(d, null, 2));
  }

  async ensure(tabs: Record<string, string[]>) {
    const d = await this.load();
    let dirty = false;
    for (const [t, h] of Object.entries(tabs)) {
      if (!d[t]) {
        d[t] = [h];
        dirty = true;
      } else if (d[t][0].length < h.length) {
        d[t][0] = h;
        dirty = true;
      }
    }
    if (dirty) await this.save(d);
  }
  async append(tab: string, row: (string | number)[]) {
    const d = await this.load();
    (d[tab] ||= []).push(row);
    await this.save(d);
  }
  async read(tab: string) {
    return ((await this.load())[tab] ?? []).map((r) => r.map(String));
  }
  async update(tab: string, rowNumber: number, startCol: number, values: (string | number)[]) {
    const d = await this.load();
    const r = d[tab]?.[rowNumber - 1];
    if (!r) throw new Error("Row not found");
    values.forEach((v, i) => (r[startCol + i] = v));
    await this.save(d);
  }
}

/* --------------------------------- factory --------------------------------- */

let instance: Store | undefined;

export class ConfigError extends Error {}

export function getStore(): Store {
  if (instance) return instance;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  if (sheetId && email && key) return (instance = new GoogleSheetStore(sheetId, email, key));
  const scriptUrl = process.env.APPS_SCRIPT_URL;
  const scriptSecret = process.env.APPS_SCRIPT_SECRET;
  if (scriptUrl && scriptSecret) return (instance = new AppsScriptStore(scriptUrl, scriptSecret));
  if (process.env.LOCAL_STORE === "1" && process.env.NODE_ENV !== "production") return (instance = new LocalFileStore());
  throw new ConfigError("The Google Sheet backend is not configured (set APPS_SCRIPT_URL + APPS_SCRIPT_SECRET, or the GOOGLE_* service-account variables).");
}
