import { NextResponse, after } from "next/server";
import type { NotifyData } from "@/lib/server/email/templates";
import { notifySubmission } from "@/lib/server/notify";
import { createRecord, type Kind } from "@/lib/server/records";
import { clientIp, limited } from "@/lib/server/ratelimit";
import { ConfigError } from "@/lib/server/store";
import { parseEnquiry, parseOrder, parseReservation } from "@/lib/validate";

export const dynamic = "force-dynamic";

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  if (limited("submit:" + clientIp(req), 10, 10 * 60_000)) return fail("Too many requests. Please try again in a few minutes.", 429);

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 20_000) return fail("Request too large.", 413);
    body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return fail("Invalid request.", 400);
  }

  // honeypot: real visitors never fill this hidden field; pretend success to bots
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true, ref: "OK-000000" });

  const kind = body.kind as Kind;
  const parsed =
    kind === "order" ? parseOrder(body) : kind === "reservation" ? parseReservation(body) : kind === "enquiry" ? parseEnquiry(body) : null;
  if (!parsed) return fail("Invalid request.", 400);
  if (!parsed.ok) return fail(parsed.error, 400);

  try {
    const { ref, at, total, lines, summary } = await createRecord(kind, parsed.data);

    // Emails go out after the response so the guest is never kept waiting on them.
    const d = parsed.data as { name: string; phone: string; email: string };
    const n: NotifyData = { kind, ref, at, name: d.name, phone: d.phone, email: d.email };
    if (kind === "order") n.order = { lines, total };
    if (kind === "reservation") {
      const r = parsed.data as { date: string; time: string; guests: string; seating: string };
      n.reservation = { date: r.date, time: r.time, guests: r.guests, seating: r.seating };
    }
    if (kind === "enquiry") {
      const e = parsed.data as { type: string; date: string; guests: number };
      n.enquiry = { type: e.type, date: e.date, guests: e.guests };
    }
    after(() => notifySubmission(n));

    return NextResponse.json({ ok: true, ref, ...summary });
  } catch (e) {
    console.error("[submit]", kind, e instanceof Error ? e.message : e);
    if (e instanceof ConfigError) return fail("Bookings are temporarily unavailable. Please message us on WhatsApp.", 503);
    return fail("We couldn't save your request. Please try again or message us on WhatsApp.", 502);
  }
}
