import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { IconSprite } from "@/components/Icon";
import { ShopProvider } from "@/components/Shop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const TITLE = "TriStar 1947 — Utkal Biryani House · The Kalinga Kitchen · Chilika Banquet";
const DESCRIPTION =
  "TriStar 1947: three houses, one Odia table. Utkal Biryani House, The Kalinga Kitchen and Chilika Banquet.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "TriStar 1947",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/img/building-night.jpg", width: 1082, height: 1003, alt: "TriStar 1947 building in the evening" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <noscript>
          <style>{".rv{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <IconSprite />
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
