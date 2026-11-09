import type { MetadataRoute } from "next";
import { isProduction, site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Previews and local builds must never be crawled.
  if (!isProduction) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
