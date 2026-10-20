import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Lists only pages that exist AND are indexable. Add routes here as they gain real content. */
const routes: { path: string; priority: number }[] = [{ path: "/", priority: 1 }];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${site.url}${r.path}`,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
