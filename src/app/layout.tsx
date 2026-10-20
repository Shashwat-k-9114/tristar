import type { Metadata, Viewport } from "next";
import { Fraunces, Hind, Noto_Sans_Oriya, Rozha_One } from "next/font/google";
import "./globals.css";
import { BadgeSprite, TristarLockup } from "@/components/brand/Badges";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import { restaurantJsonLd, websiteJsonLd } from "@/lib/seo";

/* Font budget: the first paint needs Fraunces (headlines + badge lettering) and Hind (text). Rozha One (Samosa
   headings) and Noto Sans Oriya (the Odia script flourish) are used only below the fold, so they load as those
   sections render and never compete with the hero. One weight each. */
const display = Fraunces({ variable: "--font-display", subsets: ["latin"], weight: "600", display: "swap" });
const ui = Hind({ variable: "--font-ui", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const samosa = Rozha_One({ variable: "--font-samosa", subsets: ["latin"], weight: "400", display: "swap", preload: false });
const odia = Noto_Sans_Oriya({ variable: "--font-odia", subsets: ["oriya"], weight: "500", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} Jharsuguda | Biryani, Samosa & Thali`, template: `%s | ${site.name} Jharsuguda` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#f7efdf", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={[display, ui, samosa, odia].map((f) => f.variable).join(" ")}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <BadgeSprite />
        <SiteHeader logo={<TristarLockup />} />
        <main id="main">{children}</main>
        <SiteFooter />
        <Motion />
        <JsonLd data={[restaurantJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
