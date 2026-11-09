import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { KINDS } from "@/lib/server/records";
import { getSettings, saveSettings, validatePatch, type SettingsPatch } from "@/lib/server/settings";
import { ConfigError } from "@/lib/server/store";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
const err = (e: unknown) => {
  console.error("[admin settings]", e instanceof Error ? e.message : e);
  return NextResponse.json(
    { ok: false, error: e instanceof ConfigError ? e.message : "Could not reach the Google Sheet." },
    { status: e instanceof ConfigError ? 503 : 502 },
  );
};

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    return NextResponse.json({ ok: true, settings: await getSettings() });
  } catch (e) {
    return err(e);
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b || typeof b !== "object") return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });

  const patch: SettingsPatch = {};
  if (b.adminEmails !== undefined) {
    if (!Array.isArray(b.adminEmails) || b.adminEmails.some((e) => typeof e !== "string")) {
      return NextResponse.json({ ok: false, error: "Bad admin emails" }, { status: 400 });
    }
    patch.adminEmails = (b.adminEmails as string[]).map((e) => e.trim().toLowerCase());
  }
  if (b.customerConfirmations !== undefined) patch.customerConfirmations = b.customerConfirmations === true;
  if (b.notify && typeof b.notify === "object") {
    patch.notify = {};
    for (const k of KINDS) if ((b.notify as Record<string, unknown>)[k] !== undefined) patch.notify[k] = (b.notify as Record<string, unknown>)[k] === true;
  }

  const problem = validatePatch(patch);
  if (problem) return NextResponse.json({ ok: false, error: problem }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, settings: await saveSettings(patch) });
  } catch (e) {
    return err(e);
  }
}
