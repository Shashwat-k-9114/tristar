import { Badge } from "@/components/brand/Badges";
import { addressLine, primaryNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="footer cv" aria-label="TRISTAR">
      <div className="band" aria-hidden="true" />
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Badge kind="tristar" className="footer-badge" />
            <p className="footer-addr">
              Opening soon
              <br />
              {addressLine()}
            </p>
          </div>

          <ul className="footer-badges" aria-label="Our three identities">
            {(["biryani", "samosa", "thali"] as const).map((k) => (
              <li key={k}>
                <a href={`/#${k}`} aria-label={k[0].toUpperCase() + k.slice(1)}>
                  <Badge kind={k} className="badge-sm" />
                </a>
              </li>
            ))}
          </ul>

          <nav aria-label="Footer" className="footer-nav">
            <ul>
              {primaryNav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>
                    {n.label}
                  </a>
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
