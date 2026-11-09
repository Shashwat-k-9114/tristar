"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryNav, site } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
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
      className={`fixed inset-x-0 top-0 z-50 text-ivory transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        // No backdrop-filter while the menu is open: it would become the containing block of the fixed panel.
        open
          ? "bg-cocoa"
          : scrolled
            ? "bg-cocoa/90 shadow-[0_1px_0_rgba(248,242,230,0.1)] backdrop-blur-md"
            : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} — home`} onClick={() => setOpen(false)}>
          <Image
            src="/brand/1947-logo.png"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 rounded-full md:h-11 md:w-11"
          />
          <span className="font-display text-2xl font-semibold leading-none tracking-wide">
            1947
            <span className="ml-2 hidden text-[0.7rem] font-sans font-semibold uppercase tracking-[0.26em] text-saffron sm:inline">
              The Odia Diner
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {primaryNav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="group relative py-2 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ivory/90 hover:text-saffron"
                >
                  {n.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-saffron transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {site.status === "opening-soon" && (
            <span className="hidden rounded-full border border-saffron/60 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-saffron lg:inline">
              Opening Soon
            </span>
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
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-cocoa md:hidden"
      >
        <nav aria-label="Mobile" className="wrap flex min-h-full flex-col justify-between py-10">
          <ul>
            {primaryNav.map((n) => (
              <li key={n.href} className="border-b border-ivory/10">
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-16 items-center justify-between font-display text-4xl text-ivory"
                >
                  {n.label}
                  <span aria-hidden="true" className="text-saffron">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-sm text-ivory/70">
            <span className="t-eyebrow block text-saffron">Opening Soon</span>
            <span lang="or" className="mt-3 block text-2xl text-ivory">ଓଡ଼ିଶାର ସ୍ୱାଦ</span>
            <span className="mt-1 block">A Culinary Ode to Odisha</span>
          </p>
        </nav>
      </div>
    </header>
  );
}
