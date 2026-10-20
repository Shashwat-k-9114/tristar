import Link from "next/link";
import { BiryaniLogo, SamosaLogo, ThaliLogo, TristarWordmark } from "@/components/brand/Logos";
import { addressLine, primaryNav, site } from "@/content/site";

/** SCENE 06 — THE SIGNATURE */
export function SiteFooter() {
  return (
    <footer className="signature grain" aria-labelledby="footer-title">
      <div className="wrap relative z-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="footer-title" className="h-section">
              Three worlds.
              <br />
              One destination.
            </h2>
            <p className="lead mt-6">
              {site.name} is opening soon at {addressLine()}.
            </p>
          </div>

          <ul className="flex flex-wrap items-end gap-x-10 gap-y-8 lg:col-span-5 lg:col-start-5 lg:justify-center" aria-label="Our three food worlds">
            <li>
              <Link href="/#biryani" aria-label="Biryani" className="block">
                <BiryaniLogo className="h-20 w-auto" />
              </Link>
            </li>
            <li>
              <Link href="/#samosa" aria-label="Samosa" className="block">
                <SamosaLogo className="h-auto w-[min(100%,15rem)]" />
              </Link>
            </li>
            <li>
              <Link href="/#thali" aria-label="Thali" className="block">
                <ThaliLogo className="h-20 w-auto" />
              </Link>
            </li>
          </ul>

          <nav aria-label="Footer" className="sig-links lg:col-span-2 lg:col-start-11">
            <h3 className="eyebrow text-[var(--bone-dim)]">Explore</h3>
            <ul className="mt-3">
              {primaryNav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <TristarWordmark neon className="big-sign" />

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--line)] py-8 text-sm text-[var(--bone-dim)] md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>{addressLine()}</p>
        </div>
      </div>
    </footer>
  );
}
