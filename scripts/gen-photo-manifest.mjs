// Scans public/img/dishes/*.jpg and writes lib/dish-photos.json: { slug: { w, h } }.
// A menu item shows a photo when public/img/dishes/<slug>.jpg exists AND is listed in that manifest.
// Run:  npm run photos   (after adding/replacing a dish photo; slug = dish name lowercased, symbols -> hyphens)
import { readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "img", "dishes");
const out = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith(".jpg")).sort()) {
  const { width, height } = await sharp(join(dir, f)).metadata();
  out[f.replace(/\.jpg$/, "")] = { w: width, h: height };
}
writeFileSync(join(root, "lib", "dish-photos.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${Object.keys(out).length} photos to lib/dish-photos.json`);
