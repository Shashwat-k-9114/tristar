import sharp from "sharp";
const logo = await sharp("public/brand/1947-logo.png").resize(600, 600).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#f8f2e6" } })
  .composite([{ input: logo, left: 300, top: 15 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og.png");
console.log("og.png written");
