import sharp from "sharp";
// Small derivatives for favicon / touch icon. The full-resolution original stays untouched in /public/brand.
for (const [file, size] of [["src/app/icon.png", 192], ["src/app/apple-icon.png", 180]]) {
  await sharp("public/brand/1947-logo.png").resize(size, size).png({ compressionLevel: 9 }).toFile(file);
}
console.log("icons written");
