import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Fraunces, Jost, Marcellus } from "next/font/google";
import "./globals.css";
import { TristarLockup } from "@/components/brand/Logos";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import { restaurantJsonLd, websiteJsonLd } from "@/lib/seo";

/* Font budget: the first paint uses only Cormorant Light (roman + italic, preloaded) and Jost. The three sub-brand
   faces are used only below the fold (and in the closed mobile menu), so the browser fetches them as those sections
   render — they never compete with the hero for bandwidth. One weight/style each. */
const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: "300", style: ["normal", "italic"], display: "swap" });
const ui = Jost({ variable: "--font-ui", subsets: ["latin"], display: "swap", preload: false });
const biryani = Bodoni_Moda({ variable: "--font-biryani", subsets: ["latin"], weight: "500", style: "italic", display: "swap", preload: false });
const samosa = Marcellus({ variable: "--font-samosa", subsets: ["latin"], weight: "400", display: "swap", preload: false });
const thali = Fraunces({ variable: "--font-thali", subsets: ["latin"], weight: "300", style: "italic", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} Jharsuguda | Biryani, Samosa & Thali`, template: `%s | ${site.name} Jharsuguda` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#17100c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={[display, ui, biryani, samosa, thali].map((f) => f.variable).join(" ")}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader logo={<TristarLockup />} />
        <main id="main">{children}</main>
        <SiteFooter />
        <Motion />
        <JsonLd data={[restaurantJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
