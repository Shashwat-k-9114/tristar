import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Rozha_One, Syne } from "next/font/google";
import "./globals.css";
import { TristarLockup } from "@/components/brand/Logos";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import { restaurantJsonLd, websiteJsonLd } from "@/lib/seo";

/* Font budget (docs/03-performance-budgets.md): four families, each a single weight/style
   subset, so the hero's three display faces plus body stay small. */
// Body/UI face: not preloaded (system-ui shows for a beat, size-adjusted by next/font) so it cannot compete
// with CSS and the three hero display faces on slow networks.
const parent = Bricolage_Grotesque({ variable: "--font-parent", subsets: ["latin"], display: "swap", preload: false });
const biryani = Rozha_One({ variable: "--font-biryani", subsets: ["latin"], weight: "400", display: "swap" });
const samosa = Syne({ variable: "--font-samosa", subsets: ["latin"], weight: "800", display: "swap" });
const thali = Instrument_Serif({ variable: "--font-thali", subsets: ["latin"], weight: "400", style: "italic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} Jharsuguda | Biryani, Samosa & Thali`, template: `%s | ${site.name} Jharsuguda` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0a0806", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${parent.variable} ${biryani.variable} ${samosa.variable} ${thali.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader logo={<TristarLockup className="h-7 w-auto md:h-8" />} />
        <main id="main">{children}</main>
        <SiteFooter />
        <Motion />
        <JsonLd data={[restaurantJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
