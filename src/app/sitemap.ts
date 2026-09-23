import type { MetadataRoute } from "next";
import { calculatorRoutes, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return calculatorRoutes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: route.lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
