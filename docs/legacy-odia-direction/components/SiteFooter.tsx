import Image from "next/image";
import Link from "next/link";
import { primaryNav, site } from "@/content/site";
import { Lotus, PatternBand } from "./art/Ornaments";

/** ACT VI — THE SIGNATURE */
export function SiteFooter() {
  return (
    <footer className="grain grain-dark relative overflow-hidden bg-cocoa text-ivory" aria-labelledby="footer-title">
      <div className="wrap relative z-10 pt-20 md:pt-28">
        <PatternBand id="footer-band" className="text-saffron/50" />

        <div className="mt-16 grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p className="t-eyebrow text-saffron">A Culinary Ode to Odisha</p>
            <h2 id="footer-title" className="t-display mt-6 !text-[clamp(4.5rem,3rem+10vw,13rem)] text-ivory">
              1947
            </h2>
            <p lang="or" className="mt-4 text-2xl text-saffron-soft md:text-3xl">
              ସ୍ୱାଗତ
            </p>
            <p className="mt-6 max-w-md text-ivory/75">
              1947 – The Odia Diner is a restaurant celebrating the food, craft and hospitality of Odisha.
              {site.status === "opening-soon" ? " Opening soon; location and date to be announced here first." : ""}
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h3 className="t-eyebrow text-saffron">Explore</h3>
            <ul className="mt-5 space-y-3">
              {primaryNav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-11 items-center text-ivory/85 hover:text-saffron">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-6 md:col-span-2 md:items-end">
            <Image
              src="/brand/1947-logo.png"
              alt="1947 – The Odia Diner emblem"
              width={120}
              height={120}
              className="h-28 w-28 rounded-full"
            />
            <Lotus className="h-10 w-14 text-terracotta" />
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-ivory/15 py-8 text-sm text-ivory/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} 1947 – The Odia Diner. All rights reserved.</p>
          <p>Odisha, India</p>
        </div>
      </div>
    </footer>
  );
}
