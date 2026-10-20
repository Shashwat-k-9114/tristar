/**
 * Single source of truth for verified business facts.
 * Anything `null` is UNKNOWN and must not be invented — the UI, metadata and
 * structured data all read from here and degrade honestly when a value is missing.
 */
export const site = {
  name: "TRISTAR",
  domain: "tristar1947.com",
  url: "https://tristar1947.com",
  tagline: "Biryani. Samosa. Thali.",
  description:
    "TRISTAR is opening soon on Kali Mandir Road, Jharsuguda, Odisha: three food worlds under one roof — chicken biryani, mutton and vegetable samosa, and thali.",
  locale: "en-IN",
  status: "opening-soon" as "opening-soon" | "open",
  business: {
    // Verified by the client:
    streetAddress: "Kali Mandir Road" as string | null,
    city: "Jharsuguda" as string | null,
    region: "Odisha" as string | null,
    country: "India" as string | null,
    // Not yet verified — do not invent:
    postalCode: null as string | null,
    phone: null as string | null,
    email: null as string | null,
    openingDate: null as string | null,
    hours: null as string | null,
    mapUrl: null as string | null,
    social: {} as Record<string, string>,
  },
};

export const addressLine = () =>
  [site.business.streetAddress, site.business.city, site.business.region, site.business.country].filter(Boolean).join(", ");

export type NavItem = { href: string; label: string; brand?: "biryani" | "samosa" | "thali" };

/**
 * Only anchors/routes that exist belong here. Segment links are on-page anchors until the
 * /biryani, /samosa and /thali routes are built (Phase 4); switch `href` then.
 */
export const primaryNav: NavItem[] = [
  { href: "/#biryani", label: "Biryani", brand: "biryani" },
  { href: "/#samosa", label: "Samosa", brand: "samosa" },
  { href: "/#thali", label: "Thali", brand: "thali" },
  { href: "/#the-food", label: "The Food" },
  { href: "/#visit", label: "Visit" },
];
