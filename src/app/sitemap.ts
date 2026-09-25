import type { MetadataRoute } from "next";
import { publicRoutes, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => {
    return {
      url: new URL(route.path, SITE_URL).toString(),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  });
}
