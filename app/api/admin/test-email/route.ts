import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { testEmail } from "@/lib/server/email/templates";
import { sendMail } from "@/lib/server/mail";
import { clientIp, limited } from "@/lib/server/ratelimit";
import { getSettings } from "@/lib/server/settings";
import { emailOk } from "@/lib/validate";

export const dynamic = "force-dynamic";

/** Sends the test message to the saved staff list, or to one address from that list. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  if (limited("testmail:" + clientIp(req), 6, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many test emails. Try again in a few minutes." }, { status: 429 });
  }
  try {
    const { to } = (await req.json().catch(() => ({}))) as { to?: unknown };
    const saved = (await getSettings()).adminEmails;
    const list = typeof to === "string" && to ? [to.trim().toLowerCase()] : saved;
    if (!list.length) return NextResponse.json({ ok: false, error: "Add at least one admin email first." }, { status: 400 });
    if (list.some((e) => !emailOk(e) || !saved.includes(e))) {
      return NextResponse.json({ ok: false, error: "Save the address first, then send a test." }, { status: 400 });
    }
    const via = await sendMail({ to: list, ...testEmail(list.join(", ")) });
    return NextResponse.json({ ok: true, via, sentTo: list });
  } catch (e) {
    console.error("[test-email]", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Could not send." }, { status: 502 });
  }
}
