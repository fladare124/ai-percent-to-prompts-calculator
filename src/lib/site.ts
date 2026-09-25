export const SITE_NAME = "Prompt to Production";

export const SITE_URL = "https://percenttoprompts.com";

const reviewedAt = new Date("2026-09-25T00:00:00.000Z");

export const publicRoutes = [
  { path: "/", lastModified: reviewedAt, changeFrequency: "weekly" as const, priority: 1 },
  { path: "/deploy-vibe-coded-app", lastModified: reviewedAt, changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/hostinger-nodejs-app", lastModified: reviewedAt, changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/digitalocean-app-platform", lastModified: reviewedAt, changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", lastModified: reviewedAt, changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/privacy", lastModified: reviewedAt, changeFrequency: "yearly" as const, priority: 0.2 },
  { path: "/affiliate-disclosure", lastModified: reviewedAt, changeFrequency: "yearly" as const, priority: 0.2 },
];
