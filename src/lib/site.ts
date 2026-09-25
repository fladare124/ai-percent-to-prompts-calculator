export const SITE_NAME = "Listing Checkup";

export const SITE_URL = "https://percenttoprompts.com";

const reviewedAt = new Date("2026-09-25T00:00:00.000Z");

export const publicRoutes = [
  { path: "/", lastModified: reviewedAt, priority: 1, changeFrequency: "weekly" as const },
  { path: "/es/comprobador-csv-etsy", lastModified: reviewedAt, priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/es/comprobador-etiquetas-etsy", lastModified: reviewedAt, priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/etsy-sales-csv-analyzer", lastModified: reviewedAt, priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/etsy-fee-calculator", lastModified: reviewedAt, priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/etsy-tag-checker", lastModified: reviewedAt, priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/etsy-listing-csv-guide", lastModified: reviewedAt, priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", lastModified: reviewedAt, priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy", lastModified: reviewedAt, priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/affiliate-disclosure", lastModified: reviewedAt, priority: 0.2, changeFrequency: "yearly" as const },
];
