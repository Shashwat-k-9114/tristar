import type { Metadata } from "next";
import { site } from "@/content/site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  /** Intentional noindex only while a page has no real content yet. */
  indexable?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({ title, description, path, indexable = true, type = "website" }: PageSeo): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "en_IN",
      type,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — Biryani, Samosa and Thali in Jharsuguda` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

/**
 * Restaurant entity for the parent brand. Only verified fields are emitted: name, URL and the
 * partial address the client supplied (street, city, region, country). No postal code, phone,
 * hours, geo or opening date until verified — see docs/08-seo-implementation-report.md.
 */
export const restaurantJsonLd = () => {
  const b = site.business;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    url: site.url,
    description: site.description,
    logo: `${site.url}/brand/tristar-logo-512.png`,
    image: `${site.url}/og.png`,
    servesCuisine: ["Indian", "Biryani", "Samosa", "Thali"],
    address: {
      "@type": "PostalAddress",
      ...(b.streetAddress ? { streetAddress: b.streetAddress } : {}),
      ...(b.city ? { addressLocality: b.city } : {}),
      ...(b.region ? { addressRegion: b.region } : {}),
      ...(b.postalCode ? { postalCode: b.postalCode } : {}),
      ...(b.country ? { addressCountry: "IN" } : {}),
    },
    ...(b.phone ? { telephone: b.phone } : {}),
    ...(Object.keys(b.social).length ? { sameAs: Object.values(b.social) } : {}),
  };
};

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  inLanguage: "en-IN",
  publisher: { "@id": `${site.url}/#restaurant` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${site.url}${it.path}`,
  })),
});
