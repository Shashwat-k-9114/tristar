export type Diet = "n" | "v" | "vg";

export const DIET_LABEL: Record<Diet, string> = {
  n: "Non-vegetarian",
  v: "Vegetarian",
  vg: "Vegan",
};

export type CatId = "thalis" | "pulao" | "biryani" | "podas" | "singada" | "sweets" | "drinks";

export interface Category {
  id: CatId;
  name: string;
  intro: string;
}

export const CATS: Category[] = [
  { id: "thalis", name: "Thalis", intro: "Served with authentic accompaniments, scented rice, signature dal and traditional local side dishes." },
  { id: "pulao", name: "Pulao", intro: "Fragrant aromatic rice infused with traditional spices, pure ghee and rich fresh ingredients." },
  { id: "biryani", name: "Biryani", intro: "Layered Utkal-style biryanis, dum-cooked to perfection with signature spice blends." },
  { id: "podas", name: "Podas", intro: "Burnt and slow-roasted specialties, infused with natural wood smoke and spice marinades. These need preparation time — kindly order in advance." },
  { id: "singada", name: "Singada", intro: "Crispy golden triangular pastries with spiced fillings, served with fresh mint and tamarind chutney. Hand-crafted daily with unrefined cold-pressed oils and local whole spices." },
  { id: "sweets", name: "Misanna", intro: "Sweets from the Odia table." },
  { id: "drinks", name: "Beverages", intro: "Beverages and hydration." },
];

export interface MenuItem {
  id: number;
  cat: CatId;
  name: string;
  price: number | null;
  d: Diet;
  desc: string;
  group?: string;
  tag?: string;
}

let _id = 100;
const I = (
  cat: CatId,
  name: string,
  price: number | null,
  d: Diet,
  desc: string,
  extra: { group?: string; tag?: string } = {},
): MenuItem => ({ id: ++_id, cat, name, price, d, desc, ...extra });

// IDs are assigned in this exact order (101…) — they are the keys of saved carts, do not reorder.
export const MENU: MenuItem[] = [
  I("thalis", "Mutton Thali", 400, "n", "Slow-cooked tender mutton curry served with aromatic rice, dal and authentic sides."),
  I("thalis", "Desi Chicken Thali", 350, "n", "Country chicken prepared in traditional spices, served with a complete meal spread."),
  I("thalis", "Chicken Thali (Normal)", 300, "n", "Classic home-style chicken curry served with steamed rice, dal and seasonal sides."),
  I("thalis", "Machha Thali (Fish Thali)", 250, "n", "Fresh river fish cooked in mustard gravy, served with a complete traditional meal platter."),
  I("thalis", "Egg Thali", 200, "n", "Spiced egg curry served with steamed rice, dal, bhaja and authentic condiments."),
  I("thalis", "Veg Thali", 200, "v", "Pure vegetarian platter featuring dalma, ghanta, steamed rice and authentic bhaja."),
  I("thalis", "Vegan Thali", 200, "vg", "100% plant-based meal cooked without ghee or dairy products."),
  I("pulao", "Mutton Pulao", 500, "n", "Succulent mutton pieces tossed with ghee-infused fragrant long-grain rice."),
  I("pulao", "Desi Chicken Pulao", 400, "n", "Rich country chicken flavours embedded into spiced aromatic rice."),
  I("pulao", "Chicken Pulao (Normal)", 300, "n", "Classic chicken pulao prepared with delicate Odia spice blends."),
  I("pulao", "Vegan Pulao", 250, "vg", "Fragrant rice cooked with garden-fresh vegetables and cold-pressed oil."),
  I("pulao", "Paneer Pulao", 250, "v", "Fresh cottage cheese cubes tossed with fragrant spiced rice."),
  I("biryani", "Mutton Biryani", 350, "n", "Tender mutton dum-cooked with long-grain rice and secret heritage spices."),
  I("biryani", "Desi Chicken Biryani", 300, "n", "Country chicken dum biryani infused with natural herbs and aromatic ghee."),
  I("biryani", "Chicken Biryani (Normal)", 50, "n", "Delicious Utkal-style chicken biryani cooked with fragrant herbs."),
  I("biryani", "Prawn Biryani", 200, "n", "Coastal fresh prawns layered with aromatic spiced biryani rice."),
  I("biryani", "Mushroom Biryani", 200, "v", "Fresh straw mushrooms slow-cooked with aromatic biryani spices."),
  I("biryani", "Vegan Biryani", 200, "vg", "Made with fresh tofu, aromatic herbs and premium long-grain rice."),
  I("biryani", "Paneer Biryani", 200, "v", "Soft marinated paneer cubes layered with fragrant spices and long-grain rice."),
  I("podas", "Chicken Baus Poda", 300, "n", "Slow-roasted inside green bamboo stalks over wood embers. Order in advance.", { group: "Bamboo & earthen pot — Baus Poda & Handi" }),
  I("podas", "Desi Chicken Baus Poda", 400, "n", "Country chicken marinated in raw spices, roasted in hollow bamboo. Order in advance."),
  I("podas", "Mutton Baus Poda", 400, "n", "Mutton slow-roasted inside green bamboo stalks over wood embers. Order in advance."),
  I("podas", "Handi Chicken", 300, "n", "Slow-simmered in a sealed clay pot with whole traditional spices. Order in advance."),
  I("podas", "Handi Desi Chicken", 400, "n", "Country chicken slow-simmered in a sealed clay pot with whole traditional spices. Order in advance."),
  I("podas", "Handi Mutton", 400, "n", "Mutton slow-simmered in a sealed clay pot with whole traditional spices. Order in advance."),
  I("podas", "Desi Chicken Patra Poda", 400, "n", "Country chicken wrapped in banana or sal leaf with mustard-garlic paste and roasted over embers. Order in advance.", { group: "Leaf-wrapped — Patra Poda" }),
  I("podas", "Mutton Patra Poda", 400, "n", "Mutton wrapped in banana or sal leaf with mustard-garlic paste and roasted over embers. Order in advance."),
  I("podas", "Mushroom Patra Poda / Paneer Patra Poda", null, "v", "Fresh mushrooms or cottage cheese wrapped in leaves and fire-roasted.", { tag: "On order" }),
  I("podas", "Tofu Patra Poda", null, "vg", "Plant-based fresh tofu marinated in mustard-herb paste and leaf-roasted.", { tag: "On order" }),
  I("singada", "Aaloo Singada (Classic)", 30, "v", "Traditional Odia pastry filled with spiced potato, peanuts and roasted cumin-chilli spices."),
  I("singada", "Chicken Singada", 60, "n", "Golden crisp pastry stuffed with minced spiced chicken and roasted garlic herbs."),
  I("singada", "Mutton Keema Singada", 80, "n", "Flaky crust stuffed with slow-cooked spiced mutton keema."),
  I("singada", "Paneer Singada", 50, "v", "Crispy fried crust loaded with spiced cottage cheese and green peas."),
  I("singada", "Mushroom Singada", 50, "v", "Local paddy-straw mushrooms tossed with mustard and Odia spices in a crispy shell."),
  I("singada", "Tofu Singada (Vegan)", 50, "vg", "Fresh tofu cubes seasoned with native roasted herbs in a light crispy pastry."),
  I("sweets", "Chhena Poda", null, "v", "Complimentary 100g serving per guest. Additional takeaway at ₹1,000 / kg in premium leak-proof packaging.", { tag: "Complimentary*" }),
  I("sweets", "Pahala Rasgulla", null, "v", "Traditional caramel-tinted soft rasgullas prepared in authentic Pahala style.", { tag: "Market price" }),
  I("drinks", "Fresh Coconut Water", null, "vg", "First serving complimentary per guest; further servings at ₹200 each.", { tag: "1st free · ₹200" }),
  I("drinks", "Chilled Water", null, "vg", "Fresh chilled drinking water, served on the house.", { tag: "Complimentary" }),
  I("drinks", "Hot Water", null, "vg", "Warm or hot drinking water, on request.", { tag: "Complimentary" }),
  I("drinks", "Packaged Drinking Water", null, "vg", "Sourced from trusted independent producers.", { tag: "MRP" }),
];

export const slug = (n: string) =>
  n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const rupee = (n: number) => "₹" + n.toLocaleString("en-IN");

export const KALINGA_CATS: CatId[] = ["thalis", "pulao", "podas", "singada", "sweets", "drinks"];
export const UTKAL_CATS: CatId[] = ["biryani"];
