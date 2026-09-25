# Listing Checkup

Production site: [percenttoprompts.com](https://percenttoprompts.com/)

Listing Checkup is an independent set of free Etsy seller tools: a local active-listings CSV audit, a single-listing tag checker, a sales-by-product report, an inventory restock planner, and a US fee and profit estimate with reverse pricing for a target profit.

The CSV tools and calculator run in the browser. The project does not connect to Etsy accounts, upload shop data, or claim access to Etsy search volume or rankings. Fee assumptions link to Etsy's current seller documentation and should be reviewed when policies change.

The eRank links are regular links unless `NEXT_PUBLIC_ERANK_AFFILIATE_HREF` is configured after affiliate approval. The site is not currently enrolled and does not earn commissions from eRank.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The repository deploys to Vercel from the `main` branch. The site uses no backend, database, or AI API key.

## Main files

- `src/app/page.tsx` — Etsy seller tools hub and shop-wide CSV audit.
- `src/components/EtsyCsvAuditor.tsx` — private CSV parsing, title/tag checks, and report export.
- `src/components/EtsyRestockPlanner.tsx` — local matching of active listings and order exports for stock coverage estimates.
- `src/app/etsy-fee-calculator/` and `src/components/EtsyFeeCalculator.tsx` — US fee estimator and target-price calculation.
- `src/app/etsy-tag-checker/` — single-listing tag checker.
- `src/app/etsy-restock-planner/` — Etsy CSV inventory restock planner.
- `src/app/etsy-listing-csv-guide/` — Etsy active-listings export instructions.
- `src/lib/site.ts` and `src/app/sitemap.ts` — public route and sitemap definitions.

Legacy AI deployment and usage-calculator routes remain available to direct visitors but are archived, excluded from the sitemap, and not intended for search indexing.
