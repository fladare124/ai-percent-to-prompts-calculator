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
  const boltDeploymentLanguageAlternates = {
    en: new URL("/bolt-deployment-failed", SITE_URL).toString(),
    es: new URL("/es/error-despliegue-bolt", SITE_URL).toString(),
  };
  const lovableHostingLanguageAlternates = {
    en: new URL("/where-to-host-lovable-app", SITE_URL).toString(),
    es: new URL("/es/donde-alojar-app-lovable", SITE_URL).toString(),
  };
  const boltHostingLanguageAlternates = {
    en: new URL("/where-to-host-bolt-app", SITE_URL).toString(),
    es: new URL("/es/donde-alojar-app-bolt", SITE_URL).toString(),
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

    if (route.path === "/bolt-deployment-failed" || route.path === "/es/error-despliegue-bolt") {
      return { ...entry, alternates: { languages: boltDeploymentLanguageAlternates } };
    }

    if (route.path === "/where-to-host-lovable-app" || route.path === "/es/donde-alojar-app-lovable") {
      return { ...entry, alternates: { languages: lovableHostingLanguageAlternates } };
    }

    if (route.path === "/where-to-host-bolt-app" || route.path === "/es/donde-alojar-app-bolt") {
      return { ...entry, alternates: { languages: boltHostingLanguageAlternates } };
    }

    return entry;
  });
}
