export const SITE_NAME = "Prompt to Production";

export const SITE_URL = "https://percenttoprompts.com";

const reviewedAt = new Date("2026-09-25T00:00:00.000Z");

export const publicRoutes = [
  { path: "/", lastModified: reviewedAt, priority: 1, changeFrequency: "weekly" as const },
  { path: "/deploy-vibe-coded-app", lastModified: reviewedAt, priority: 0.95, changeFrequency: "monthly" as const },
  { path: "/lovable-to-vercel-checker", lastModified: reviewedAt, priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/lovable-deployment-failed", lastModified: reviewedAt, priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/bolt-deployment-failed", lastModified: reviewedAt, priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/where-to-host-lovable-app", lastModified: reviewedAt, priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/where-to-host-bolt-app", lastModified: reviewedAt, priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/hostinger-nodejs-app", lastModified: reviewedAt, priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/digitalocean-app-platform", lastModified: reviewedAt, priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/es/arreglar-error-despliegue", lastModified: reviewedAt, priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/es/publicar-lovable-en-vercel", lastModified: reviewedAt, priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/es/error-despliegue-bolt", lastModified: reviewedAt, priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/es/donde-alojar-app-lovable", lastModified: reviewedAt, priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/es/donde-alojar-app-bolt", lastModified: reviewedAt, priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/about", lastModified: reviewedAt, priority: 0.3, changeFrequency: "yearly" as const },
];
