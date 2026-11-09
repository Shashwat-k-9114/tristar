import { NextResponse } from "next/server";
import { COOKIE, cookieOptions, makeSession, passwordOk } from "@/lib/server/auth";
import { clientIp, limited } from "@/lib/server/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (limited("login:" + clientIp(req), 8, 15 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again later." }, { status: 429 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: unknown };
  try {
    if (typeof password !== "string" || !passwordOk(password)) {
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, makeSession(), cookieOptions);
    return res;
  } catch (e) {
    console.error("[admin login]", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: "Admin login is not configured on the server." }, { status: 503 });
  }
}
