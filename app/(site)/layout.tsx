import { ShopProvider } from "@/components/Shop";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <ShopProvider>{children}</ShopProvider>;
}
