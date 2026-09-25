import type { MetadataRoute } from "next";
import { publicRoutes, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: new Date("2026-09-25T00:00:00.000Z"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
