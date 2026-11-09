/**
 * Single source of truth for verified business facts.
 * Anything `null` is UNKNOWN and must not be invented — the UI, metadata and
 * structured data all read from here and degrade honestly when a value is missing.
 */
export const site = {
  name: "1947 – The Odia Diner",
  shortName: "1947",
  domain: "tristar1947.com",
  url: "https://tristar1947.com",
  tagline: "A Culinary Ode to Odisha",
  description:
    "1947 – The Odia Diner is a restaurant celebrating the food, craft and hospitality of Odisha. Opening soon.",
  locale: "en-IN",
  status: "opening-soon" as "opening-soon" | "open",
  region: "Odisha, India",
  business: {
    city: null as string | null,
    streetAddress: null as string | null,
    postalCode: null as string | null,
    phone: null as string | null,
    email: null as string | null,
    openingDate: null as string | null,
    hours: null as string | null,
    mapUrl: null as string | null,
    social: {} as Record<string, string>,
  },
};

export const hasVerifiedAddress = () =>
  Boolean(site.business.city && site.business.streetAddress);

export type NavItem = { href: string; label: string };

/** Only routes that exist and have real content belong here. */
export const primaryNav: NavItem[] = [
  { href: "/#the-land", label: "The Land" },
  { href: "/#the-flavours", label: "The Flavours" },
  { href: "/#the-experience", label: "The Experience" },
  { href: "/#the-invitation", label: "Visit" },
];
