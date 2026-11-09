"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryNav, site } from "@/content/site";

const brandColor = { biryani: "var(--ember)", samosa: "var(--coral)", thali: "var(--lime)" } as const;
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        open ? "bg-[var(--ink)]" : scrolled ? "bg-[var(--ink)]/92 shadow-[0_1px_0_var(--line)]" : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link href="/" aria-label={`${site.name} — home`} onClick={() => setOpen(false)} className="block">
          {logo}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`group relative inline-flex min-h-11 items-center text-[0.78rem] font-bold uppercase tracking-[0.18em] ${n.brand ? brandFont[n.brand] : ""}`}
                  style={{ ["--c" as string]: n.brand ? brandColor[n.brand] : "var(--bone)" }}
                >
                  <span className="transition-colors group-hover:text-[var(--c)]">{n.label}</span>
                  <span className="absolute inset-x-0 bottom-1.5 h-0.5 origin-left scale-x-0 bg-[var(--c)] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {site.status === "opening-soon" && (
            <span className="eyebrow hidden border border-[var(--lime)] px-3 py-1.5 text-[var(--lime)] lg:inline">Opening soon</span>
          )}
          <button
            ref={toggleRef}
            type="button"
            className="relative -mr-2 flex h-12 w-12 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-6" aria-hidden="true">
              <span className={`absolute left-0 h-0.5 w-full bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-full bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={panelRef} hidden={!open} className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-[var(--ink)] md:hidden">
        <nav aria-label="Mobile" className="wrap flex min-h-full flex-col justify-between py-8">
          <ul>
            {primaryNav.map((n) => (
              <li key={n.href} className="border-b border-[var(--line)]">
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-20 items-center justify-between gap-3 text-5xl uppercase [&.f-samosa]:text-[2.35rem] ${n.brand ? brandFont[n.brand] : "font-extrabold tracking-tight"}`}
                  style={{ color: n.brand ? brandColor[n.brand] : "var(--bone)" }}
                >
                  <span className={n.brand === "thali" ? "normal-case italic" : ""}>{n.label}</span>
                  <span aria-hidden="true" className="text-2xl">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-[var(--bone-dim)]">
            <span className="eyebrow block text-[var(--lime)]">Opening soon</span>
            <span className="mt-2 block">Kali Mandir Road, Jharsuguda, Odisha</span>
          </p>
        </nav>
      </div>
    </header>
  );
}
