import Link from "next/link";
import { BiryaniLogo, SamosaLogo, ThaliLogo, TristarMark } from "@/components/brand/Logos";
import { addressLine, primaryNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="footer cv grain" aria-label="TRISTAR">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <TristarMark className="footer-mark" />
            <p className="footer-word">TRISTAR</p>
            <p className="footer-line">Biryani. Samosa. Thali.</p>
            <p className="footer-addr">
              Opening soon
              <br />
              {addressLine()}
            </p>
          </div>

          <ul className="footer-logos" aria-label="Our three identities">
            <li>
              <Link prefetch={false} href="/#biryani" aria-label="Biryani">
                <BiryaniLogo />
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/#samosa" aria-label="Samosa">
                <SamosaLogo />
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/#thali" aria-label="Thali">
                <ThaliLogo />
              </Link>
            </li>
          </ul>

          <nav aria-label="Footer" className="footer-nav">
            <ul>
              {primaryNav.map((n) => (
                <li key={n.href}>
                  <Link prefetch={false} href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="footer-legal">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
