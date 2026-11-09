/**
 * Homepage copy. Facts come only from the client brief: three food identities; chicken biryani,
 * mutton samosa, vegetable samosa; thali varieties NOT yet confirmed. Descriptions state what a dish
 * is — never invented recipes, claims, prices, awards or history.
 */
export type BrandKey = "biryani" | "samosa" | "thali";

export const brands = {
  biryani: {
    key: "biryani" as const,
    numeral: "I",
    name: "Biryani",
    keywords: ["Aroma", "Steam", "Warmth"],
    headline: "Chicken biryani in Jharsuguda",
    body: "Chicken biryani: aromatic rice and chicken, served at TRISTAR on Kali Mandir Road. The first chapter of the table is lit like a pot being opened — warm, low and quiet.",
    shot: "B1 · Pot opening, steam, rice macro",
  },
  samosa: {
    key: "samosa" as const,
    numeral: "II",
    name: "Samosa",
    keywords: ["Gold", "Crisp", "Fold"],
    headline: "Mutton and vegetable samosa in Jharsuguda",
    body: "Crisp pastry, folded and filled. Two varieties at TRISTAR: mutton samosa and vegetable samosa. The second chapter is all edges and gold — precise, bright and brief.",
    shot: "S1 · Broken open, filling revealed",
  },
  thali: {
    key: "thali" as const,
    numeral: "III",
    name: "Thali",
    keywords: ["Plenty", "Balance", "Comfort"],
    headline: "Thali in Jharsuguda",
    body: "A thali is a complete meal arranged on one plate. The third chapter is round and unhurried. TRISTAR’s varieties and contents will be announced here once they are confirmed.",
    shot: "T1 · Overhead full thali",
  },
} as const;

export const dishes = [
  { brand: "biryani" as const, index: "i", name: "Chicken biryani", descriptor: "Aromatic rice layered with chicken. TRISTAR’s chicken biryani in Jharsuguda.", shot: "B1" },
  { brand: "samosa" as const, index: "ii", name: "Mutton samosa", descriptor: "A crisp pastry parcel with a mutton filling.", shot: "S1" },
  { brand: "samosa" as const, index: "iii", name: "Vegetable samosa", descriptor: "A crisp pastry parcel with a vegetable filling.", shot: "S2" },
  { brand: "thali" as const, index: "iv", name: "Thali", descriptor: "A complete meal on one plate. Varieties and contents to be announced.", shot: "T1" },
] as const;
