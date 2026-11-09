"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && j.ok) return location.reload();
      setErr(j.error || "Could not sign in.");
    } catch {
      setErr("Network error. Please try again.");
    }
    setBusy(false);
  };

  return (
    <main className="adm-login">
      <form onSubmit={submit} className="adm-card">
        <span className="adm-brand">TriStar <span>1947</span></span>
        <h1>Staff sign in</h1>
        <p>Orders, table bookings and banquet enquiries.</p>
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" autoComplete="current-password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} />
        {err ? <p className="adm-err" role="alert">{err}</p> : null}
        <button className="adm-btn primary" type="submit" disabled={busy || !pw}>{busy ? "Signing in…" : "Sign in"}</button>
        <Link className="adm-back" href="/">← Back to site</Link>
      </form>
    </main>
  );
}
