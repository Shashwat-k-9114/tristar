// Browser helper: send a form to /api/submit (which writes it to the Google Sheet).
export type SubmitResult = { ok: true; ref: string } | { ok: false; error: string };

export async function submitForm(kind: "order" | "reservation" | "enquiry", data: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...data }),
    });
    const j = (await res.json().catch(() => null)) as { ok?: boolean; ref?: string; error?: string } | null;
    if (res.ok && j?.ok && j.ref) return { ok: true, ref: j.ref };
    return { ok: false, error: j?.error || "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "You appear to be offline. Please check your connection and try again." };
  }
}
