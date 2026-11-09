import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ConfigError, appsScriptCall } from "./store";

export interface Mail {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

const SENDER_NAME = "TriStar 1947";

/**
 * Sends through the Apps Script web app (i.e. from the Google account that owns the script).
 * In local development with LOCAL_STORE=1 nothing is sent; the message is written to .data/outbox/ for preview.
 */
export async function sendMail(m: Mail): Promise<"sent" | "outbox"> {
  const list = Array.isArray(m.to) ? m.to : [m.to];
  const to = list.join(",");
  if (process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_SECRET) {
    // One message per recipient: multi-recipient sends were not being delivered, and a bad address then can't block the rest.
    const results = await Promise.allSettled(
      list.map((one) => appsScriptCall("sendEmail", { to: one, subject: m.subject, html: m.html, text: m.text, replyTo: m.replyTo, name: SENDER_NAME })),
    );
    const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    if (failed.length === list.length) throw failed[0].reason;
    if (failed.length) console.error(`[mail] ${failed.length}/${list.length} recipients failed:`, failed.map((f) => String(f.reason)).join("; "));
    return "sent";
  }
  if (process.env.LOCAL_STORE === "1" && process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), ".data", "outbox");
    await fs.mkdir(dir, { recursive: true });
    const safe = to.replace(/[^a-z0-9@.-]/gi, "_").slice(0, 60);
    await fs.writeFile(path.join(dir, `${Date.now()}-${safe}.html`), `<!-- to: ${to} | subject: ${m.subject} -->\n${m.html}`);
    return "outbox";
  }
  throw new ConfigError("Email sending needs the Apps Script backend (APPS_SCRIPT_URL / APPS_SCRIPT_SECRET).");
}
