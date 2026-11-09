import "server-only";
import { rupee } from "../../menu";
import { EMAIL, OPENING, PHONE_HREF, PHONE_TEXT, WA_NUMBER } from "../../site";
import { SITE_URL } from "../../siteUrl";
import type { Kind, OrderLine } from "../records";

/* ------------------------------------------------------------------ types */

export interface NotifyData {
  kind: Kind;
  ref: string;
  at: string;
  name: string;
  phone: string;
  email: string;
  order?: { lines: OrderLine[]; total: number };
  reservation?: { date: string; time: string; guests: string; seating: string };
  enquiry?: { type: string; date: string; guests: number };
}
export interface Rendered { subject: string; html: string; text: string }

/* ----------------------------------------------------------------- tokens */

const C = {
  black: "#000000", hero: "#170b05", card: "#111113", panel: "#1c1c1e", line: "#2c2c2e",
  ink: "#f5f5f7", mute: "#a1a1a6", orange: "#ff9f0a", blue: "#0071e3", green: "#34c759", red: "#ff6961",
};
const FONT = `-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Segoe UI',Inter,'Helvetica Neue',Helvetica,Arial,sans-serif`;
const ADDRESS = "First Floor, TriStar Building (HDFC Bank Building), Kalimandir Road, Jharsuguda – 768202";
const HOURS = ["Mon – Thu · 11:30 – 22:30", "Fri – Sun · 11:00 – 23:00"];

const img = (p: string) => `${SITE_URL}${p}`;
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const fmtWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
const waLink = (phone: string, text = "") => {
  let d = phone.replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  else if (d.length === 11 && d.startsWith("0")) d = "91" + d.slice(1);
  return `https://wa.me/${d}${text ? "?text=" + encodeURIComponent(text) : ""}`;
};

/** Google Calendar "add event" link for a reservation (IST, 90 minutes). */
function calendarLink(r: NonNullable<NotifyData["reservation"]>, ref: string) {
  const m = r.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return "";
  let h = +m[1] % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  const start = new Date(Date.UTC(+r.date.slice(0, 4), +r.date.slice(5, 7) - 1, +r.date.slice(8, 10), h, +m[2]));
  const end = new Date(start.getTime() + 90 * 60_000);
  const f = (d: Date) => d.toISOString().slice(0, 19).replace(/[-:]/g, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `Table at ${r.seating} · TriStar 1947`,
    dates: `${f(start)}/${f(end)}`,
    ctz: "Asia/Kolkata",
    details: `${r.guests} · Booking ref ${ref}\nWe will call to confirm.`,
    location: ADDRESS,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/* ------------------------------------------------------------- primitives */

const button = (href: string, label: string, kind: "primary" | "ghost" | "wa" = "primary") => {
  const s = {
    primary: { bg: C.blue, fg: "#ffffff", border: C.blue },
    wa: { bg: "#25d366", fg: "#04210f", border: "#25d366" },
    ghost: { bg: "transparent", fg: C.ink, border: "#48484a" },
  }[kind];
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:4px 6px 4px 0"><tr><td bgcolor="${s.bg}" style="border-radius:999px;border:1px solid ${s.border}"><a href="${esc(href)}" target="_blank" style="display:block;padding:13px 24px;font:600 15px/1 ${FONT};color:${s.fg};text-decoration:none;border-radius:999px">${esc(label)}</a></td></tr></table>`;
};

const detailRow = (label: string, value: string, strong = false) =>
  `<tr><td style="padding:13px 0;border-bottom:1px solid ${C.line};font:600 11px/1.3 ${FONT};letter-spacing:.09em;text-transform:uppercase;color:${C.mute};width:38%;vertical-align:top">${esc(label)}</td><td style="padding:13px 0;border-bottom:1px solid ${C.line};font:${strong ? 600 : 500} 15px/1.45 ${FONT};color:${C.ink};text-align:right;vertical-align:top">${value}</td></tr>`;

const card = (inner: string, extra = "") =>
  `<tr><td class="px" style="padding:0 36px 20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.panel};border-radius:20px;${extra}"><tr><td style="padding:8px 24px 10px">${inner}</td></tr></table></td></tr>`;

const sectionTitle = (t: string) =>
  `<tr><td class="px" style="padding:10px 36px 12px;font:600 13px/1 ${FONT};letter-spacing:.1em;text-transform:uppercase;color:${C.orange}">${esc(t)}</td></tr>`;

const steps = (items: [string, string][]) =>
  `<tr><td class="px" style="padding:0 36px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items
    .map(
      ([t, d], i) =>
        `<tr><td width="44" valign="top" style="padding:8px 0"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="32" height="32" align="center" valign="middle" style="background:${C.orange};border-radius:16px;font:700 14px/32px ${FONT};color:#000">${i + 1}</td></tr></table></td><td style="padding:8px 0 10px"><div style="font:600 16px/1.3 ${FONT};color:${C.ink}">${esc(t)}</div><div style="font:400 14px/1.5 ${FONT};color:${C.mute};margin-top:2px">${esc(d)}</div></td></tr>`,
    )
    .join("")}</table></td></tr>`;

/* ------------------------------------------------------------------ shell */

interface ShellOpts {
  preheader: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** "guest": full brand hero with dancers + tick; "staff": compact hero with an accent. */
  variant: "guest" | "staff";
  ref: string;
  body: string;
  footerNote: string;
}

function shell(o: ShellOpts) {
  const guest = o.variant === "guest";
  const dancers = guest
    ? `<td width="112" valign="bottom" align="left" class="dancer" style="padding-left:6px"><img src="${img("/img/dancer-left.png")}" width="96" alt="" style="display:block;border:0;height:auto"></td>`
    : "";
  const dancersR = guest
    ? `<td width="112" valign="bottom" align="right" class="dancer" style="padding-right:6px"><img src="${img("/img/dancer-right.png")}" width="64" alt="" style="display:block;border:0;height:auto"></td>`
    : "";
  const wheel = guest ? 132 : 84;

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(o.title)}</title>
<style>
  body{margin:0;padding:0;background:${C.black};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  img{-ms-interpolation-mode:bicubic}
  a{color:${C.orange}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  @keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(255,159,10,0)}50%{box-shadow:0 0 26px 3px rgba(255,159,10,.42)}}
  @keyframes sweep{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  .fu{animation:fadeUp .9s cubic-bezier(.2,.7,.2,1) both}
  .fu2{animation:fadeUp .9s .18s cubic-bezier(.2,.7,.2,1) both}
  .fu3{animation:fadeUp .9s .36s cubic-bezier(.2,.7,.2,1) both}
  .glow{animation:glow 2.8s ease-in-out infinite}
  .float{animation:floaty 5s ease-in-out infinite}
  .sweep{background-image:linear-gradient(90deg,rgba(255,159,10,0),#ff9f0a,#ffd479,#ff9f0a,rgba(255,159,10,0));background-size:200% 100%;animation:sweep 4.5s linear infinite}
  @media only screen and (max-width:620px){
    .w{width:100%!important}
    .px{padding-left:20px!important;padding-right:20px!important}
    .h1{font-size:30px!important;line-height:1.1!important}
    .dancer{display:none!important}
    .stack{display:block!important;width:100%!important;text-align:left!important}
  }
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.black}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${C.black}">${esc(o.preheader)}${"&nbsp;&zwnj;".repeat(30)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.black}" style="background:${C.black}"><tr><td align="center" style="padding:24px 12px 40px">
<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${C.card};border-radius:28px;overflow:hidden;border:1px solid ${C.line}">

  <!-- brand bar -->
  <tr><td bgcolor="${C.hero}" style="background:${C.hero};padding:20px 28px 0;font:700 18px/1 ${FONT};letter-spacing:-.03em;color:${C.ink}">TriStar <span style="color:${C.mute};font-weight:600">1947</span><span style="float:right;font:600 11px/1 ${FONT};letter-spacing:.14em;color:${C.orange};text-transform:uppercase;padding-top:4px">${esc(o.eyebrow)}</span></td></tr>

  <!-- hero -->
  <tr><td bgcolor="${C.hero}" align="center" style="background:${C.hero};padding:14px 20px 8px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      ${dancers}
      <td align="center" valign="middle"><img class="float" src="${img("/email/wheel.gif")}" width="${wheel}" height="${wheel}" alt="" style="display:block;border:0;margin:0 auto;border-radius:50%"></td>
      ${dancersR}
    </tr></table>
  </td></tr>
  <tr><td bgcolor="${C.hero}" align="center" class="px" style="background:${C.hero};padding:4px 36px ${guest ? 8 : 26}px">
    ${guest ? `<img src="${img("/email/tick.gif")}" width="72" height="72" alt="" style="display:block;border:0;margin:6px auto 8px;border-radius:50%">` : ""}
    <h1 class="h1 fu" style="margin:6px 0 10px;font:700 40px/1.05 ${FONT};letter-spacing:-.04em;color:${C.ink}">${o.title}</h1>
    <p class="fu2" style="margin:0 auto;max-width:440px;font:500 17px/1.45 ${FONT};color:#d1d1d6">${o.subtitle}</p>
  </td></tr>
  ${
    guest
      ? `<tr><td bgcolor="${C.hero}" align="center" style="background:${C.hero};padding:18px 20px 34px">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td class="glow" align="center" style="background:rgba(255,159,10,.12);border:1px solid rgba(255,159,10,.55);border-radius:999px;padding:9px 22px;font:600 13px/1 ${FONT};letter-spacing:.08em;color:${C.orange}"><span style="color:${C.mute};font-weight:500;letter-spacing:.04em">REFERENCE&nbsp;&nbsp;</span><span style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:15px;letter-spacing:.14em">${esc(o.ref)}</span></td></tr></table>
  </td></tr>`
      : `<tr><td height="3" class="sweep" style="height:3px;line-height:3px;font-size:0;background:${C.orange}">&nbsp;</td></tr>`
  }
  ${guest ? `<tr><td height="3" class="sweep" style="height:3px;line-height:3px;font-size:0;background:${C.orange}">&nbsp;</td></tr>` : ""}

  <tr><td style="height:26px;line-height:26px;font-size:0">&nbsp;</td></tr>
  ${o.body}

  ${
    guest
      ? `<!-- house photo -->
  <tr><td style="padding:14px 0 0"><img src="${img("/email/building-banner.jpg")}" width="600" alt="TriStar 1947, Jharsuguda" style="display:block;width:100%;height:auto;border:0"></td></tr>`
      : ""
  }

  <!-- footer -->
  <tr><td bgcolor="#0a0a0b" class="px" style="background:#0a0a0b;padding:28px 36px 30px;border-top:1px solid ${C.line}">
    <div style="font:700 15px/1 ${FONT};letter-spacing:-.03em;color:${C.ink}">TriStar <span style="color:${C.mute};font-weight:600">1947</span></div>
    <div style="font:500 13px/1.6 ${FONT};color:${C.orange};margin:6px 0 14px">Three legacies, united. One Odia table.</div>
    <div style="font:400 13px/1.6 ${FONT};color:${C.mute}">${esc(ADDRESS)}</div>
    <div style="font:400 13px/1.6 ${FONT};color:${C.mute}">${HOURS.map(esc).join(" &nbsp;·&nbsp; ")}</div>
    <div style="font:400 13px/1.9 ${FONT};margin-top:8px"><a href="${PHONE_HREF}" style="color:${C.ink};text-decoration:none">${esc(PHONE_TEXT)}</a> &nbsp;·&nbsp; <a href="mailto:${EMAIL}" style="color:${C.ink};text-decoration:none">${esc(EMAIL)}</a> &nbsp;·&nbsp; <a href="${SITE_URL}" style="color:${C.orange};text-decoration:none">Visit the website</a></div>
    <div style="font:400 12px/1.6 ${FONT};color:#6e6e73;margin-top:18px;border-top:1px solid ${C.line};padding-top:14px">${o.footerNote}<br>© ${new Date().getFullYear()} TriStar 1947 · Tristar Foods LLP</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

/* ---------------------------------------------------------- shared blocks */

const KIND_LABEL: Record<Kind, string> = { order: "order", reservation: "table reservation", enquiry: "banquet enquiry" };

function itemsTable(o: NonNullable<NotifyData["order"]>) {
  const rows = o.lines
    .map(
      (l) =>
        `<tr><td style="padding:12px 0;border-bottom:1px solid ${C.line};font:500 15px/1.4 ${FONT};color:${C.ink}">${esc(l.name)}<div style="font:400 13px/1.3 ${FONT};color:${C.mute};margin-top:2px">${l.qty} × ${rupee(l.price)}</div></td><td align="right" valign="top" style="padding:12px 0;border-bottom:1px solid ${C.line};font:600 15px/1.4 ${FONT};color:${C.ink};white-space:nowrap">${rupee(l.qty * l.price)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}<tr><td style="padding:16px 0 8px;font:600 13px/1 ${FONT};letter-spacing:.09em;text-transform:uppercase;color:${C.mute}">Total</td><td align="right" style="padding:16px 0 8px;font:700 28px/1 ${FONT};letter-spacing:-.03em;color:${C.orange}">${rupee(o.total)}</td></tr></table><div style="font:400 12px/1.5 ${FONT};color:${C.mute};padding-bottom:10px">Taxes extra as applicable.</div>`;
}

function detailsFor(d: NotifyData) {
  if (d.kind === "order" && d.order) return itemsTable(d.order);
  if (d.kind === "reservation" && d.reservation) {
    const r = d.reservation;
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRow("House", esc(r.seating), true)}${detailRow("Date", esc(fmtDate(r.date)), true)}${detailRow("Time", esc(r.time))}${detailRow("Guests", esc(r.guests))}</table>`;
  }
  if (d.kind === "enquiry" && d.enquiry) {
    const e = d.enquiry;
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRow("Event", esc(e.type), true)}${detailRow("Date", esc(fmtDate(e.date)), true)}${detailRow("Guests", String(e.guests))}${detailRow("Venue", "Chilika Banquet")}</table>`;
  }
  return "";
}

function detailsText(d: NotifyData) {
  if (d.kind === "order" && d.order) return d.order.lines.map((l) => `  ${l.qty} x ${l.name} — ${rupee(l.qty * l.price)}`).join("\n") + `\n  Total: ${rupee(d.order.total)}`;
  if (d.kind === "reservation" && d.reservation) return `  ${d.reservation.seating}\n  ${fmtDate(d.reservation.date)}, ${d.reservation.time}\n  ${d.reservation.guests}`;
  if (d.kind === "enquiry" && d.enquiry) return `  ${d.enquiry.type}\n  ${fmtDate(d.enquiry.date)}\n  ${d.enquiry.guests} guests`;
  return "";
}

/* ------------------------------------------------------------- guest email */

export function customerEmail(d: NotifyData): Rendered {
  const first = d.name.split(/\s+/)[0];
  const wa = waLink(WA_NUMBER, `Hello TriStar 1947, ${KIND_LABEL[d.kind]} ${d.ref} — ${d.name}, ${d.phone}`);

  let title = "", subtitle = "", subject = "", nextSteps: [string, string][] = [], note = "", extraBtn = "";
  if (d.kind === "order") {
    title = "Order received.";
    subtitle = `Thank you, ${esc(first)}. Your order is with our kitchen team and we&rsquo;ll call you shortly to confirm it.`;
    subject = `Order received · ${d.ref} — TriStar 1947`;
    nextSteps = [
      ["We call to confirm", `A member of our team will ring ${d.phone} to confirm your order and timing.`],
      ["Prepared fresh", "Everything is cooked fresh. Slow-roasted poda dishes need preparation time, so we may suggest a pickup time."],
      ["Enjoy the Odia table", "Hygienically packed, leak-proof and ready to follow you home."],
    ];
  } else if (d.kind === "reservation" && d.reservation) {
    const r = d.reservation;
    const opens = (OPENING as Record<string, string>)[r.seating];
    title = "Your table is requested.";
    subtitle = `${esc(first)}, we&rsquo;ve noted ${esc(r.guests.toLowerCase())} at ${esc(r.seating)} on ${esc(fmtDate(r.date))}. We&rsquo;ll call to confirm.`;
    subject = `Your table request · ${d.ref} — TriStar 1947`;
    nextSteps = [
      ["We call to confirm", `Our team will ring ${d.phone} to confirm your booking.`],
      ["Arrive a little early", r.seating === "Utkal Biryani House" ? "Open terrace dining is available 7 – 10 PM. We’ll keep your table ready." : "We’ll keep your table ready on the first floor."],
      ["Savour the evening", opens && r.date === opens ? `${r.seating} opens on ${fmtDate(opens)} — you’re among our very first guests.` : "Heritage Odia cooking, from her recipes to your table."],
    ];
    const cal = calendarLink(r, d.ref);
    extraBtn = cal ? button(cal, "Add to calendar", "ghost") : "";
    note = "Your booking is confirmed once our team has called you.";
  } else if (d.kind === "enquiry" && d.enquiry) {
    title = "Enquiry received.";
    subtitle = `Thank you, ${esc(first)}. We&rsquo;re delighted you&rsquo;re considering Chilika Banquet for your ${esc(d.enquiry.type.toLowerCase())}.`;
    subject = `We've got your banquet enquiry · ${d.ref} — TriStar 1947`;
    nextSteps = [
      ["We call you", `Our team will ring ${d.phone} with availability for ${fmtDate(d.enquiry.date)} and a quote.`],
      ["Shape the celebration", "Tell us about your guests, menu preferences and live cooking counters."],
      ["Celebrate with Odia grace", "A banquet for 50 – 100 guests, with in-house Odia and Mughlai catering and valet parking."],
    ];
  }
  const body =
    sectionTitle(d.kind === "order" ? "Your order" : d.kind === "reservation" ? "Your reservation" : "Your event") +
    card(detailsFor(d), "") +
    sectionTitle("What happens next") +
    steps(nextSteps) +
    `<tr><td class="px" style="padding:18px 36px 6px">${button(wa, "Confirm on WhatsApp", "wa")}${extraBtn}${button(PHONE_HREF, "Call us", "ghost")}</td></tr>` +
    (note ? `<tr><td class="px" style="padding:8px 36px 0;font:400 13px/1.5 ${FONT};color:${C.mute}">${esc(note)}</td></tr>` : "");

  const html = shell({
    preheader: `${title.replace(/\.$/, "")} — reference ${d.ref}. We'll call to confirm.`,
    eyebrow: "Jharsuguda",
    title,
    subtitle,
    variant: "guest",
    ref: d.ref,
    body,
    footerNote: `You&rsquo;re receiving this because ${esc(d.email)} was entered on the TriStar 1947 website on ${esc(fmtWhen(d.at))}. If that wasn&rsquo;t you, you can ignore this email.`,
  });

  const text = [
    `${title} (${d.ref})`,
    "",
    subtitle.replace(/&rsquo;/g, "'").replace(/&amp;/g, "&"),
    "",
    detailsText(d),
    "",
    "What happens next:",
    ...nextSteps.map(([a, b], i) => `${i + 1}. ${a} — ${b}`),
    "",
    `WhatsApp: ${wa}`,
    `Call: ${PHONE_TEXT}`,
    `${ADDRESS}`,
    "",
    "TriStar 1947 — Three legacies, united. One Odia table.",
  ].join("\n");

  return { subject, html, text };
}

/* ------------------------------------------------------------- staff email */

export function adminEmail(d: NotifyData): Rendered {
  const dash = `${SITE_URL}/admin`;
  const heading =
    d.kind === "order" && d.order ? `New order · ${rupee(d.order.total)}` : d.kind === "reservation" ? "New table reservation" : "New banquet enquiry";
  const sub =
    d.kind === "order"
      ? `${esc(d.name)} just placed an order on the website.`
      : d.kind === "reservation" && d.reservation
        ? `${esc(d.name)} · ${esc(d.reservation.guests)} · ${esc(d.reservation.seating)}`
        : d.enquiry
          ? `${esc(d.name)} · ${esc(d.enquiry.type)} · ${d.enquiry.guests} guests`
          : "";
  const subject =
    d.kind === "order" && d.order
      ? `New order ${d.ref} · ${rupee(d.order.total)} — ${d.name}`
      : d.kind === "reservation" && d.reservation
        ? `New reservation ${d.ref} · ${d.reservation.date} ${d.reservation.time} — ${d.name}`
        : `New banquet enquiry ${d.ref} — ${d.name}`;

  const contact = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRow("Guest", esc(d.name), true)}${detailRow("Phone", `<a href="tel:${esc(d.phone)}" style="color:${C.ink};text-decoration:none">${esc(d.phone)}</a>`)}${detailRow("Email", d.email ? `<a href="mailto:${esc(d.email)}" style="color:${C.orange};text-decoration:none">${esc(d.email)}</a>` : `<span style="color:${C.mute}">not provided</span>`)}${detailRow("Received", esc(fmtWhen(d.at)))}${detailRow("Status", `<span style="display:inline-block;background:rgba(255,159,10,.16);color:${C.orange};border-radius:999px;padding:3px 12px;font:600 13px/1.4 ${FONT}">New</span>`)}</table>`;

  const body =
    sectionTitle("Guest") +
    card(contact) +
    sectionTitle(d.kind === "order" ? "Items" : "Details") +
    card(detailsFor(d)) +
    `<tr><td class="px" style="padding:14px 36px 8px">${button(dash, "Open dashboard", "primary")}${button(`tel:${d.phone}`, "Call guest", "ghost")}${button(waLink(d.phone, `Hello ${d.name}, this is TriStar 1947 regarding your ${KIND_LABEL[d.kind]} ${d.ref}.`), "WhatsApp guest", "wa")}</td></tr>`;

  const html = shell({
    preheader: `${d.name} · ${d.phone} · ${d.ref}`,
    eyebrow: d.ref,
    title: heading,
    subtitle: sub,
    variant: "staff",
    ref: d.ref,
    body,
    footerNote: `You&rsquo;re receiving this staff notification because your address is listed under <b>Staff notifications</b> in the TriStar 1947 admin portal. Manage recipients at <a href="${dash}" style="color:${C.orange}">${dash.replace(/^https?:\/\//, "")}</a>.`,
  });

  const text = [
    `${heading} (${d.ref})`,
    `Guest: ${d.name} · ${d.phone}${d.email ? " · " + d.email : ""}`,
    `Received: ${fmtWhen(d.at)}`,
    "",
    detailsText(d),
    "",
    `Dashboard: ${dash}`,
  ].join("\n");

  return { subject, html, text };
}

/* --------------------------------------------------------- test / previews */

export function testEmail(to: string): Rendered {
  const body =
    sectionTitle("All set") +
    card(`<div style="padding:14px 0;font:500 16px/1.55 ${FONT};color:${C.ink}">This is a test message from the TriStar 1947 admin portal. If you&rsquo;re reading it, <b style="color:${C.orange}">${esc(to)}</b> will receive a notification whenever a guest places an order, reserves a table or sends a banquet enquiry.</div>`) +
    `<tr><td class="px" style="padding:6px 36px 8px">${button(`${SITE_URL}/admin`, "Open dashboard", "primary")}</td></tr>`;
  return {
    subject: "Test notification — TriStar 1947 admin",
    html: shell({
      preheader: "Staff notifications are working.",
      eyebrow: "Test",
      title: "Notifications are working.",
      subtitle: "Your staff email is connected to the TriStar 1947 website.",
      variant: "staff",
      ref: "TEST",
      body,
      footerNote: "Sent from Settings → Staff notifications in the admin portal.",
    }),
    text: `This is a test message from the TriStar 1947 admin portal. ${to} will receive notifications for new orders, reservations and enquiries.\n${SITE_URL}/admin`,
  };
}

export function sampleData(kind: Kind): NotifyData {
  const base = { kind, ref: kind === "order" ? "ORD-7K3MQX" : kind === "reservation" ? "RES-4NH8TD" : "BNQ-9XW2PA", at: new Date().toISOString(), name: "Asha Mohanty", phone: "9876543210", email: "asha@example.com" };
  if (kind === "order")
    return { ...base, order: { total: 1160, lines: [{ name: "Mutton Thali", qty: 2, price: 400 }, { name: "Chicken Singada", qty: 2, price: 60 }, { name: "Paneer Biryani", qty: 1, price: 200 }] } };
  if (kind === "reservation")
    return { ...base, reservation: { date: "2027-02-20", time: "08:00 PM (Dinner)", guests: "4 Guests", seating: "Utkal Biryani House" } };
  return { ...base, enquiry: { type: "Wedding Reception", date: "2027-11-14", guests: 85 } };
}
