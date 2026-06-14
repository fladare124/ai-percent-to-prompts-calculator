import type { MetadataRoute } from "next";
import { calculatorRoutes, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return calculatorRoutes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
