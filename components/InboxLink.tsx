"use client";

import { useState } from "react";
import { useShop } from "./Shop";
import { rupee } from "@/lib/menu";
import { INBOX_KEY, store } from "@/lib/store";

type Row = Record<string, string | number | undefined>;
const COLS = ["ref", "kind", "at", "name", "phone", "type", "date", "time", "guests", "seating", "items", "total"];

function Inbox() {
  const { closeModal } = useShop();
  const [all] = useState<Row[]>(() => store.get<Row[]>(INBOX_KEY, []));

  const csv = () => {
    const body = [COLS.join(",")]
      .concat(all.map((r) => COLS.map((c) => '"' + String(r[c] == null ? "" : r[c]).replace(/"/g, '""') + '"').join(",")))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = "tristar-inbox.csv";
    a.click();
  };
  const clear = () => {
    if (confirm("Clear all saved submissions?")) {
      store.set(INBOX_KEY, []);
      closeModal();
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h3>Staff inbox</h3>
      <p>Submissions made on this device (stored in this browser).</p>
      {all.length ? (
        <table>
          <thead><tr><th>Ref</th><th>Type</th><th>When</th><th>Guest</th><th>Details</th></tr></thead>
          <tbody>
            {all.map((r, i) => (
              <tr key={i}>
                <td>{r.ref}</td>
                <td>{r.kind}</td>
                <td>{new Date(r.at as string).toLocaleString()}</td>
                <td>{r.name}<br />{r.phone}</td>
                <td>{[r.type, r.date, r.time, r.guests, r.seating, r.items, r.total ? rupee(r.total as number) : ""].filter(Boolean).join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ padding: "24px 0" }}>Nothing yet.</p>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        {all.length ? (
          <>
            <button className="pill out" id="csv" style={{ width: "auto", margin: 0 }} onClick={csv}>Download CSV</button>
            <button className="pill out" id="clr" style={{ width: "auto", margin: 0 }} onClick={clear}>Clear</button>
          </>
        ) : null}
        <button className="pill" data-close style={{ width: "auto", margin: 0 }}>Close</button>
      </div>
    </div>
  );
}

export function InboxLink() {
  const { showModal } = useShop();
  const open = () => showModal(<Inbox />, true);
  return (
    <a
      id="adminLink"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      Staff inbox
    </a>
  );
}
