import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { KINDS, STATUSES, listRecords, updateRecord, type Kind } from "@/lib/server/records";
import { ConfigError } from "@/lib/server/store";

export const dynamic = "force-dynamic";

const err = (e: unknown) => {
  console.error("[admin records]", e instanceof Error ? e.message : e);
  return NextResponse.json(
    { ok: false, error: e instanceof ConfigError ? e.message : "Could not reach the Google Sheet." },
    { status: e instanceof ConfigError ? 503 : 502 },
  );
};

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const kind = new URL(req.url).searchParams.get("kind") as Kind;
  if (!KINDS.includes(kind)) return NextResponse.json({ ok: false, error: "Bad kind" }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, ...(await listRecords(kind)) });
  } catch (e) {
    return err(e);
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { kind?: Kind; ref?: string; status?: string; notes?: string };
  if (!b.kind || !KINDS.includes(b.kind) || typeof b.ref !== "string" || !/^[A-Z]{3}-[A-Z0-9]{6}$/.test(b.ref)) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (b.status !== undefined && !(STATUSES as readonly string[]).includes(b.status)) {
    return NextResponse.json({ ok: false, error: "Bad status" }, { status: 400 });
  }
  if (b.notes !== undefined && (typeof b.notes !== "string" || b.notes.length > 1000)) {
    return NextResponse.json({ ok: false, error: "Bad notes" }, { status: 400 });
  }
  try {
    const found = await updateRecord(b.kind, b.ref, { status: b.status, notes: b.notes });
    return found ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  } catch (e) {
    return err(e);
  }
}
