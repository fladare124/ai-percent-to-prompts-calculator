# Prompt to Production

Production site: [percenttoprompts.com](https://percenttoprompts.com/)

Prompt to Production is an independent set of free tools and guides for taking apps made with AI coding tools from preview to a live deployment. The main experience checks common build-log errors in the browser, creates a focused repair prompt, and helps choose a host based on the app framework and use.

The checker does not upload logs, connect to AI-builder accounts, execute code, or guarantee a complete diagnosis. Provider terms and prices change, so guides link to official documentation and are reviewed before publishing.

## Monetization

There is no active affiliate revenue configured. The hosting finder links to providers directly unless an approved Hostinger referral URL is set in `NEXT_PUBLIC_HOSTINGER_AFFILIATE_HREF`. Do not set that variable until the relevant affiliate program has approved the site. The affiliate disclosure page changes automatically when an approved URL is configured.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The repository deploys to Vercel from the `main` branch. The site uses no backend or AI API key.

## Main files

- `src/app/page.tsx` — launch-tools homepage, build-log checker, hosting finder and guide hub.
- `src/components/DeploymentErrorHelper.tsx` and `src/lib/deploymentDiagnostics.ts` — private log-pattern checks and repair-prompt generation.
- `src/components/DeploymentFinder.tsx` — local framework detection and hosting starting-point recommendations.
- `src/app/deploy-vibe-coded-app/` — deployment troubleshooting guide.
- `src/app/lovable-to-vercel-checker/` and `src/app/bolt-deployment-failed/` — builder-specific deployment guides.
- `src/lib/partners.ts` — optional approved affiliate link configuration and disclosures.
- `src/lib/site.ts` and `src/app/sitemap.ts` — site metadata and public sitemap routes.

Old Etsy tools and AI usage calculators remain available at their original URLs but are excluded from the public sitemap and marked not to index.
