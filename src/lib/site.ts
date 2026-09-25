export const SITE_NAME = "Percent to Prompts";

export const SITE_URL = "https://percenttoprompts.com";

export const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/etsy-tag-checker", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/affiliate-disclosure", priority: 0.2, changeFrequency: "yearly" as const },
];
