/**
 * Homepage copy. Facts come only from the client brief: three food segments; chicken biryani,
 * mutton samosa, vegetable samosa; thali varieties NOT yet confirmed. Descriptions state what a dish
 * is — never invented recipes, claims, prices, awards, history or "authenticity".
 *
 * `odia` — the segment name in Odia script as a design flourish. DRAFT: to be proof-read by a native
 * Odia reader before launch (see docs/09-odia-heritage-direction.md, open items).
 */
export type BrandKey = "biryani" | "samosa" | "thali";

export const brands = {
  biryani: {
    key: "biryani" as const,
    numeral: "I",
    name: "Biryani",
    odia: "ବିରିୟାନୀ",
    keywords: ["Clay pot", "Aroma", "Steam"],
    headline: "Chicken biryani in Jharsuguda",
    body: "Chicken biryani: aromatic rice and chicken, served at TRISTAR in a terracotta mood — a clay handi, a lifted lid, a rise of steam.",
    shot: "B1 · Handi opening, steam, rice macro",
  },
  samosa: {
    key: "samosa" as const,
    numeral: "II",
    name: "Samosa",
    odia: "ସମୋସା",
    keywords: ["Crisp", "Golden", "Folded"],
    headline: "Mutton and vegetable samosa in Jharsuguda",
    body: "Crisp golden pastry, folded and filled. Two varieties at TRISTAR: mutton samosa and vegetable samosa, served on brass under an indigo-and-gold identity of its own.",
    shot: "S1 · Broken open, filling revealed",
  },
  thali: {
    key: "thali" as const,
    numeral: "III",
    name: "Thali",
    odia: "ଥାଳି",
    keywords: ["Abundance", "Balance", "Comfort"],
    headline: "Thali in Jharsuguda",
    body: "A thali is a complete meal arranged on one plate, bowl by bowl. TRISTAR’s varieties and contents will be announced here once they are confirmed.",
    shot: "T1 · Overhead full thali",
  },
} as const;

export const dishes = [
  { brand: "biryani" as const, index: "i", name: "Chicken biryani", descriptor: "Aromatic rice layered with chicken. TRISTAR’s chicken biryani in Jharsuguda.", shot: "B1" },
  { brand: "samosa" as const, index: "ii", name: "Mutton samosa", descriptor: "A crisp pastry parcel with a mutton filling.", shot: "S1" },
  { brand: "samosa" as const, index: "iii", name: "Vegetable samosa", descriptor: "A crisp pastry parcel with a vegetable filling.", shot: "S2" },
  { brand: "thali" as const, index: "iv", name: "Thali", descriptor: "A complete meal on one plate. Varieties and contents to be announced.", shot: "T1" },
] as const;
