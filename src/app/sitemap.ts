import type { MetadataRoute } from "next";
import { publicRoutes, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const deploymentLanguageAlternates = {
    en: new URL("/deploy-vibe-coded-app", SITE_URL).toString(),
    es: new URL("/es/arreglar-error-despliegue", SITE_URL).toString(),
  };
  const privacyLanguageAlternates = {
    en: new URL("/privacy", SITE_URL).toString(),
    es: new URL("/es/privacidad", SITE_URL).toString(),
  };
  const lovableVercelLanguageAlternates = {
    en: new URL("/lovable-to-vercel-checker", SITE_URL).toString(),
    es: new URL("/es/publicar-lovable-en-vercel", SITE_URL).toString(),
  };

  return publicRoutes.map((route) => {
    const entry = {
      url: new URL(route.path, SITE_URL).toString(),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };

    if (route.path === "/deploy-vibe-coded-app" || route.path === "/es/arreglar-error-despliegue") {
      return { ...entry, alternates: { languages: deploymentLanguageAlternates } };
    }

    if (route.path === "/privacy" || route.path === "/es/privacidad") {
      return { ...entry, alternates: { languages: privacyLanguageAlternates } };
    }

    if (route.path === "/lovable-to-vercel-checker" || route.path === "/es/publicar-lovable-en-vercel") {
      return { ...entry, alternates: { languages: lovableVercelLanguageAlternates } };
    }

    return entry;
  });
}
