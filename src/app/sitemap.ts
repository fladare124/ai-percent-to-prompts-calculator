import type { MetadataRoute } from "next";
import { calculatorRoutes, SITE_URL, siteInfoRoutes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...calculatorRoutes, ...siteInfoRoutes].map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: route.lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
