"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryNav, site } from "@/content/site";

const brandFont = { biryani: "f-biryani", samosa: "f-samosa", thali: "f-thali" } as const;

/** `logo` is rendered on the server and passed in, so logo geometry never ships in the client bundle. */
export function SiteHeader({ logo }: { logo: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu: Escape closes, focus is trapped while open, page scroll is locked.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []).concat(
        toggleRef.current ? [toggleRef.current] : [],
      );
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const els = focusables();
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={`site-header${open ? " is-open" : scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap site-header-bar">
        <Link prefetch={false} href="/" aria-label={`${site.name} — home`} onClick={() => setOpen(false)} className="site-logo">
          {logo}
        </Link>

        <nav aria-label="Primary" className="site-nav">
          <ul>
            {primaryNav.map((n) => (
              <li key={n.href}>
                <Link prefetch={false} href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-end">
          {site.status === "opening-soon" && <span className="badge">Opening soon</span>}
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-bars" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={panelRef} hidden={!open} className="mobile-menu">
        <nav aria-label="Mobile" className="wrap mobile-menu-inner">
          <ul>
            {primaryNav.map((n) => (
              <li key={n.href}>
                <Link prefetch={false} href={n.href} onClick={() => setOpen(false)} className={n.brand ? brandFont[n.brand] : "f-display"}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mobile-menu-foot">
            <span className="eyebrow">Opening soon</span>
            <span>Kali Mandir Road, Jharsuguda, Odisha</span>
          </p>
        </nav>
      </div>
    </header>
  );
}
