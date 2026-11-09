"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";

type Kind = "order" | "reservation" | "enquiry";
interface Settings {
  adminEmails: string[];
  notify: Record<Kind, boolean>;
  customerConfirmations: boolean;
}

const EMAIL_RE = /^[^\s@<>",;]{1,64}@[^\s@<>",;]+\.[^\s@<>",;]{2,}$/;
const NOTIFY: { id: Kind; label: string; hint: string }[] = [
  { id: "order", label: "New orders", hint: "When a guest places an order" },
  { id: "reservation", label: "Table reservations", hint: "When a guest requests a table" },
  { id: "enquiry", label: "Banquet enquiries", hint: "When someone enquires about Chilika Banquet" },
];

export function Settings() {
  const [saved, setSaved] = useState<Settings | null>(null);
  const [draft, setDraft] = useState<Settings | null>(null);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState<"" | "save" | "test">("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (res.status === 401) return location.reload();
      const j = (await res.json()) as { ok: boolean; settings?: Settings; error?: string };
      if (!j.ok || !j.settings) throw new Error(j.error || "Could not load settings");
      setSaved(j.settings);
      setDraft(j.settings);
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Could not load settings" });
    }
  }, []);

  useEffect(() => {
    // initial fetch from the external Google Sheet
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  if (!draft || !saved) {
    return <div className="adm-set"><p className={msg ? "adm-err" : "adm-meta"}>{msg ? msg.text : "Loading settings…"}</p></div>;
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const addEmail = (raw: string) => {
    const parts = raw.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (!parts.length) return;
    const bad = parts.find((p) => !EMAIL_RE.test(p));
    if (bad) return setMsg({ type: "err", text: `"${bad}" is not a valid email address.` });
    const next = Array.from(new Set([...draft.adminEmails, ...parts]));
    if (next.length > 10) return setMsg({ type: "err", text: "You can add up to 10 addresses." });
    setDraft({ ...draft, adminEmails: next });
    setInput("");
    setMsg(null);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmail(input);
    } else if (e.key === "Backspace" && !input && draft.adminEmails.length) {
      setDraft({ ...draft, adminEmails: draft.adminEmails.slice(0, -1) });
    }
  };

  const save = async () => {
    // pick up an address typed but not yet added
    let d = draft;
    if (input.trim()) {
      const parts = input.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
      const bad = parts.find((p) => !EMAIL_RE.test(p));
      if (bad) return setMsg({ type: "err", text: `"${bad}" is not a valid email address.` });
      d = { ...draft, adminEmails: Array.from(new Set([...draft.adminEmails, ...parts])) };
    }
    setBusy("save");
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; settings?: Settings; error?: string };
      if (!res.ok || !j.ok || !j.settings) throw new Error(j.error || "Save failed");
      setSaved(j.settings);
      setDraft(j.settings);
      setInput("");
      setMsg({ type: "ok", text: "Settings saved to your Google Sheet." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Save failed" });
    }
    setBusy("");
  };

  const sendTest = async () => {
    setBusy("test");
    setMsg(null);
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; via?: string; sentTo?: string[]; error?: string };
      if (!res.ok || !j.ok) throw new Error(j.error || "Could not send");
      setMsg({ type: "ok", text: j.via === "outbox" ? "Dev mode: test email saved to .data/outbox (not actually sent)." : `Test email sent to ${j.sentTo?.join(", ")}. Check your inbox (and spam).` });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Could not send" });
    }
    setBusy("");
  };

  const toggle = (checked: boolean, on: (v: boolean) => void, label: string) => (
    <label className="adm-switch">
      <input type="checkbox" checked={checked} onChange={(e) => on(e.target.checked)} aria-label={label} />
      <span className="adm-sw" />
    </label>
  );

  return (
    <div className="adm-set">
      <section className="adm-panel">
        <h2>Staff notifications</h2>
        <p className="adm-hint">These addresses get an email for every new submission from the website. Add as many as you need (up to 10).</p>
        <div className="adm-chips" onClick={() => document.getElementById("adm-email-in")?.focus()}>
          {draft.adminEmails.map((e) => (
            <span className="adm-chip" key={e}>
              {e}
              <button type="button" aria-label={`Remove ${e}`} onClick={() => setDraft({ ...draft, adminEmails: draft.adminEmails.filter((x) => x !== e) })}>×</button>
            </span>
          ))}
          <input
            id="adm-email-in"
            type="email"
            inputMode="email"
            placeholder={draft.adminEmails.length ? "Add another…" : "name@example.com"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            onBlur={() => input.trim() && addEmail(input)}
            aria-label="Add admin email"
          />
        </div>
        {!draft.adminEmails.length ? <p className="adm-warn">No staff address yet: nobody will be notified about new submissions.</p> : null}

        <div className="adm-rows">
          {NOTIFY.map((n) => (
            <div className="adm-trow" key={n.id}>
              <div><b>{n.label}</b><span>{n.hint}</span></div>
              {toggle(draft.notify[n.id], (v) => setDraft({ ...draft, notify: { ...draft.notify, [n.id]: v } }), n.label)}
            </div>
          ))}
        </div>
      </section>

      <section className="adm-panel">
        <h2>Guest confirmations</h2>
        <div className="adm-rows flat">
          <div className="adm-trow">
            <div>
              <b>Email guests a confirmation</b>
              <span>Sent to the guest&apos;s address when they give one on the order, booking or enquiry form (the email field is optional).</span>
            </div>
            {toggle(draft.customerConfirmations, (v) => setDraft({ ...draft, customerConfirmations: v }), "Guest confirmations")}
          </div>
        </div>
      </section>

      <div className="adm-save">
        <button className="adm-btn primary auto" onClick={save} disabled={busy !== "" || (!dirty && !input.trim())}>{busy === "save" ? "Saving…" : "Save changes"}</button>
        <button className="adm-btn" onClick={sendTest} disabled={busy !== "" || dirty || !saved.adminEmails.length} title={dirty ? "Save your changes first" : ""}>{busy === "test" ? "Sending…" : "Send test email"}</button>
        {dirty ? <span className="adm-meta">Unsaved changes</span> : null}
      </div>
      {msg ? <p className={msg.type === "ok" ? "adm-ok" : "adm-err"} role="status">{msg.text}</p> : null}

      <section className="adm-panel">
        <h2>Preview the emails</h2>
        <p className="adm-hint">Exactly what guests and staff receive, rendered with sample data.</p>
        <div className="adm-prev">
          {NOTIFY.map((n) => (
            <div key={n.id}>
              <b>{n.label}</b>
              <a href={`/api/admin/email-preview?type=${n.id}&for=guest`} target="_blank" rel="noopener">Guest email</a>
              <a href={`/api/admin/email-preview?type=${n.id}&for=staff`} target="_blank" rel="noopener">Staff email</a>
            </div>
          ))}
        </div>
      </section>

      <p className="adm-foot">
        Emails are sent from the Google account that owns your Apps Script (Gmail allows about 100 a day on a free account, 1,500 on Google Workspace). Settings are stored in the <b>Settings</b> tab of your Google Sheet.
      </p>
    </div>
  );
}
