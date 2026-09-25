# Percent to Prompts — AI Plan Finder

Production site: [percenttoprompts.com](https://percenttoprompts.com/)

The homepage helps developers compare AI coding subscriptions by workflow, usage style and monthly budget. Supporting pages explain published plan limits and include browser-based usage planners for individual providers.

The site is independent. Prices and plan details can change, so each comparison links to provider documentation. It does not connect to provider accounts, promise a fixed number of prompts or use a paid ranking.

## Privacy and analytics

- Usage calculator inputs are processed in the browser and are not submitted to the application server.
- Shared shortlist links include only the selected workflow, budget and usage frequency.
- Vercel Web Analytics and Speed Insights measure page use and performance.
- Etsy checker routes remain available as noindex legacy pages and are not included in the sitemap.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The repository deploys to Vercel from the `main` branch. No backend, database, AI API key or environment variable is required for the comparison and usage planners.

## Main files

- `src/app/page.tsx` — plan finder, plan comparison and methodology.
- `src/components/AIPlanFinder.tsx` — interactive plan shortlist.
- `src/components/` — provider-specific usage planners.
- `src/lib/site.ts` and `src/app/sitemap.ts` — public AI comparison and tool routes.
