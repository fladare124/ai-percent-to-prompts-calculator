# Percent to Prompts — Etsy Listing Checkup

Production site: [percenttoprompts.com](https://percenttoprompts.com/)

The homepage is a free Etsy active-listings CSV checker. It reviews titles and tags locally in the browser, highlights patterns to review, exports a report and can create a copy-ready prompt for an AI assistant. It does not connect to Etsy, upload a file, query search volume or predict rankings.

## Privacy and analytics

- The active-listings CSV is processed in the browser and is not sent to the application server.
- Vercel Web Analytics and Speed Insights measure page use and performance.
- Custom events record audit/report/prompt/partner-link actions without sending listing text, file names, titles, tags or descriptions.
- The current eRank link is a regular outbound link. The project is not currently earning affiliate commission.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## Build and deploy

```bash
npm run build
```

The repository deploys to Vercel from the `main` branch. No backend, database, AI API key or environment variable is required for the CSV audit.

## Main files

- `src/components/EtsyCsvAuditor.tsx` — CSV parsing, local checks, report export and optional prompt creation.
- `src/app/page.tsx` — homepage content, SEO metadata, official references and visible FAQs.
- `src/app/about/page.tsx` — methodology and limits.
- `src/app/privacy/page.tsx` — file-processing and analytics notice.
- `src/app/affiliate-disclosure/page.tsx` — current outbound-link status.
- `src/lib/site.ts` and `src/app/sitemap.ts` — public site routes.

Older AI-usage calculator routes remain available as legacy pages but are marked `noindex` and are not included in the sitemap.
