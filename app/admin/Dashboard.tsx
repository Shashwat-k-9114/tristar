"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Settings } from "./Settings";

type Kind = "order" | "reservation" | "enquiry";
type Row = Record<string, string>;
type Data = { columns: string[]; rows: Row[] };

const KINDS: { id: Kind; label: string }[] = [
  { id: "order", label: "Orders" },
  { id: "reservation", label: "Reservations" },
  { id: "enquiry", label: "Banquet enquiries" },
];
const STATUSES = ["New", "Confirmed", "Completed", "Cancelled"];
const REFRESH_MS = 30_000;

const IST = "Asia/Kolkata";
const fmtWhen = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(+d)
    ? iso
    : d.toLocaleString("en-IN", { timeZone: IST, day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });
};
const dayIST = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: IST });
const waLink = (phone: string) => {
  let d = phone.replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  else if (d.length === 11 && d.startsWith("0")) d = "91" + d.slice(1);
  return `https://wa.me/${d}`;
};

export function Dashboard() {
  const [kind, setKind] = useState<Kind>("order");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [data, setData] = useState<Partial<Record<Kind, Data>>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState<Date | null>(null);
  const [auto, setAuto] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [saving, setSaving] = useState<string>("");
  const busy = useRef(false);

  const load = useCallback(async (silent = false) => {
    if (busy.current) return;
    busy.current = true;
    if (!silent) setLoading(true);
    try {
      const results = await Promise.all(
        KINDS.map(async (k) => {
          const res = await fetch(`/api/admin/records?kind=${k.id}`, { cache: "no-store" });
          if (res.status === 401) {
            location.reload();
            throw new Error("Session expired");
          }
          const j = (await res.json()) as { ok: boolean; error?: string } & Data;
          if (!j.ok) throw new Error(j.error || "Failed to load");
          return [k.id, { columns: j.columns, rows: j.rows }] as const;
        }),
      );
      setData(Object.fromEntries(results));
      setUpdated(new Date());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // initial fetch from the external Google Sheet
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => document.visibilityState === "visible" && load(true), REFRESH_MS);
    return () => clearInterval(t);
  }, [auto, load]);

  const patch = async (row: Row, body: { status?: string; notes?: string }) => {
    const ref = row.Ref;
    setSaving(ref);
    const prev = data[kind];
    // optimistic update
    setData((d) => ({
      ...d,
      [kind]: d[kind] && {
        ...d[kind]!,
        rows: d[kind]!.rows.map((r) => (r.Ref === ref ? { ...r, ...(body.status !== undefined && { Status: body.status }), ...(body.notes !== undefined && { Notes: body.notes }) } : r)),
      },
    }));
    try {
      const res = await fetch("/api/admin/records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ref, ...body }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !j.ok) throw new Error(j.error || "Save failed");
      setError("");
    } catch (e) {
      setData((d) => ({ ...d, [kind]: prev }));
      setError(e instanceof Error ? `Could not save: ${e.message}` : "Could not save");
    } finally {
      setSaving("");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    location.reload();
  };

  const cur = data[kind];
  const rows = useMemo(() => {
    if (!cur) return [];
    const s = q.trim().toLowerCase();
    return cur.rows.filter(
      (r) => (status === "all" || r.Status === status) && (!s || Object.values(r).some((v) => v.toLowerCase().includes(s))),
    );
  }, [cur, q, status]);

  const stats = useMemo(() => {
    const all = cur?.rows ?? [];
    const today = dayIST(new Date());
    const live = all.filter((r) => r.Status !== "Cancelled");
    return {
      total: all.length,
      fresh: all.filter((r) => r.Status === "New").length,
      today: all.filter((r) => dayIST(new Date(r["Created At"])) === today).length,
      revenue: live.reduce((a, r) => a + (Number(r["Total (₹)"]) || 0), 0),
    };
  }, [cur]);

  const newCount = (k: Kind) => data[k]?.rows.filter((r) => r.Status === "New").length ?? 0;

  const exportCsv = () => {
    if (!cur) return;
    const esc = (v: string) => '"' + v.replace(/"/g, '""') + '"';
    const csv = [cur.columns.map(esc).join(",")].concat(rows.map((r) => cur.columns.map((c) => esc(r[c] ?? "")).join(","))).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `tristar-${kind}-${dayIST(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const cols = (() => {
    const c = (cur?.columns ?? []).filter((x) => x !== "Ref" && x !== "Email");
    if (cur?.columns.includes("Email")) c.splice(c.indexOf("Phone") + 1, 0, "Email");
    return c;
  })();

  return (
    <div className="adm-wrap">
      <header className="adm-top">
        <div>
          <span className="adm-brand">TriStar <span>1947</span></span>
          <span className="adm-sub">Staff dashboard · live from Google Sheets</span>
        </div>
        <div className="adm-actions">
          <label className="adm-chk"><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />Auto-refresh</label>
          <button className="adm-btn" onClick={() => load()} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button>
          <button className="adm-btn" onClick={logout}>Sign out</button>
        </div>
      </header>

      <nav className="adm-tabs" role="tablist" aria-label="Record type">
        {KINDS.map((k) => (
          <button key={k.id} role="tab" aria-selected={!settingsOpen && k.id === kind} className={!settingsOpen && k.id === kind ? "on" : ""} onClick={() => { setSettingsOpen(false); setKind(k.id); setStatus("all"); }}>
            {k.label}
            {newCount(k.id) > 0 ? <b className="adm-pip">{newCount(k.id)}</b> : null}
          </button>
        ))}
        <button role="tab" aria-selected={settingsOpen} className={settingsOpen ? "on" : ""} onClick={() => setSettingsOpen(true)}>Settings</button>
      </nav>

      {settingsOpen ? <Settings /> : <>

      <div className="adm-stats">
        <div><span>New</span><b>{stats.fresh}</b></div>
        <div><span>Today</span><b>{stats.today}</b></div>
        <div><span>All time</span><b>{stats.total}</b></div>
        {kind === "order" ? <div><span>Revenue (excl. cancelled)</span><b>₹{stats.revenue.toLocaleString("en-IN")}</b></div> : null}
      </div>

      <div className="adm-bar">
        <input type="search" placeholder="Search name, phone, ref, items…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="adm-btn" onClick={exportCsv} disabled={!rows.length}>Export CSV</button>
        <span className="adm-meta">{updated ? `Updated ${updated.toLocaleTimeString("en-IN", { timeZone: IST })}` : ""}</span>
      </div>

      {error ? <p className="adm-err" role="alert">{error}</p> : null}

      <div className="adm-table">
        <table>
          <thead>
            <tr><th>Ref</th>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {!cur ? (
              <tr><td colSpan={cols.length + 1} className="adm-empty">{loading ? "Loading…" : "No data."}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={cols.length + 1} className="adm-empty">{cur.rows.length ? "Nothing matches your filters." : "Nothing here yet."}</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.Ref} className={saving === r.Ref ? "saving" : ""}>
                  <td className="mono">{r.Ref}</td>
                  {cols.map((c) => (
                    <td key={c} data-label={c}>
                      {c === "Created At" ? fmtWhen(r[c]) :
                       c === "Phone" ? (<><a href={`tel:${r[c]}`}>{r[c]}</a> <a className="adm-wa" href={waLink(r[c])} target="_blank" rel="noopener" aria-label={`WhatsApp ${r.Name}`}>WA</a></>) :
                       c === "Email" ? (r[c] ? <a href={`mailto:${r[c]}`}>{r[c]}</a> : <span className="adm-dim">—</span>) :
                       c === "Total (₹)" ? "₹" + Number(r[c]).toLocaleString("en-IN") :
                       c === "Status" ? (
                         <select className={`adm-st st-${(r.Status || "New").toLowerCase()}`} value={r.Status || "New"} onChange={(e) => patch(r, { status: e.target.value })} aria-label={`Status for ${r.Ref}`}>
                           {STATUSES.map((s) => <option key={s}>{s}</option>)}
                         </select>
                       ) :
                       c === "Notes" ? <NoteField key={r.Notes} value={r.Notes} onSave={(v) => patch(r, { notes: v })} /> :
                       r[c]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="adm-foot">Changes here are written straight to the Google Sheet, and edits made in the sheet show up here on the next refresh.</p>
      </>}
    </div>
  );
}

function NoteField({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(value);
  return (
    <input
      className="adm-note"
      value={v}
      maxLength={1000}
      placeholder="Add note…"
      onChange={(e) => setV(e.target.value)}
      onBlur={() => v !== value && onSave(v)}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      aria-label="Notes"
    />
  );
}
