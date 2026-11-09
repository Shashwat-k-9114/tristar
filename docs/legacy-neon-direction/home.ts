/**
 * Homepage copy. Facts come only from the client brief: three segments; chicken biryani,
 * mutton samosa, vegetable samosa; thali varieties NOT yet confirmed. Descriptions state what
 * a dish is, never invented recipes, claims, prices or awards.
 */
export type BrandKey = "biryani" | "samosa" | "thali";

export const brands = {
  biryani: {
    key: "biryani" as const,
    name: "Biryani",
    keywords: ["Heat", "Aroma", "Fire"],
    line: "Chicken biryani, from TRISTAR on Kali Mandir Road, Jharsuguda.",
    body: "Chicken biryani: aromatic rice and chicken. Heat, aroma and fire set the mood of the first of TRISTAR’s three food worlds.",
  },
  samosa: {
    key: "samosa" as const,
    name: "Samosa",
    keywords: ["Crunch", "Energy", "Impact"],
    line: "Two varieties: mutton samosa and vegetable samosa.",
    body: "Crisp golden pastry, broken open to the filling. Two varieties at TRISTAR in Jharsuguda: mutton samosa and vegetable samosa.",
  },
  thali: {
    key: "thali" as const,
    name: "Thali",
    keywords: ["Feast", "Abundance", "Comfort"],
    line: "A complete meal, arranged on one plate.",
    body: "A thali is a complete meal arranged on one plate. TRISTAR’s thali varieties and contents will be announced here once confirmed.",
  },
} as const;

export const dishes = [
  {
    brand: "biryani" as const,
    index: "01",
    name: "Chicken biryani",
    descriptor: "Aromatic rice layered with chicken. TRISTAR’s chicken biryani in Jharsuguda.",
    shot: "B1 · Pot opening, steam, rice macro",
  },
  {
    brand: "samosa" as const,
    index: "02",
    name: "Mutton samosa",
    descriptor: "Crisp pastry parcel with a mutton filling.",
    shot: "S1 · Broken open, filling revealed",
  },
  {
    brand: "samosa" as const,
    index: "03",
    name: "Vegetable samosa",
    descriptor: "Crisp pastry parcel with a vegetable filling.",
    shot: "S2 · Stacked, golden crust close-up",
  },
  {
    brand: "thali" as const,
    index: "04",
    name: "Thali",
    descriptor: "A complete meal on one plate. Varieties and contents to be announced.",
    shot: "T1 · Overhead full thali",
  },
] as const;

export const experienceLines = [
  { word: "Heat", brand: "biryani" as const },
  { word: "Crunch", brand: "samosa" as const },
  { word: "Abundance", brand: "thali" as const },
] as const;
