import { isAdmin } from "@/lib/server/auth";
import { adminEmail, customerEmail, sampleData, testEmail } from "@/lib/server/email/templates";
import type { Kind } from "@/lib/server/records";

export const dynamic = "force-dynamic";

/** Admin-only: renders an email with sample data so staff can see exactly what guests receive. */
export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const u = new URL(req.url).searchParams;
  const type = u.get("type") as Kind | "test";
  const who = u.get("for") === "staff" ? "staff" : "guest";
  const html =
    type === "test"
      ? testEmail("you@example.com").html
      : (["order", "reservation", "enquiry"] as const).includes(type as Kind)
        ? (who === "staff" ? adminEmail : customerEmail)(sampleData(type as Kind)).html
        : null;
  if (!html) return new Response("Bad type", { status: 400 });
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
