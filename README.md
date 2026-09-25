# Prompt to Production

Production site: [percenttoprompts.com](https://percenttoprompts.com/)

Prompt to Production helps people decide where to deploy a website or app created with AI coding tools. The site includes a browser-based hosting finder that can detect common frameworks from a pasted package.json and practical guides to Vercel, Hostinger and DigitalOcean App Platform.

The project is independent. Provider requirements, plan terms and prices can change, so the guides link to official documentation and tell readers to confirm current details before deploying. There are currently no affiliate links or provider commissions.

## Privacy and analytics

- Hosting finder choices and package.json framework detection are processed in the browser and are not submitted to the application server.
- Vercel Web Analytics and Speed Insights measure page use and performance.
- The finder does not connect to source-code repositories, hosting accounts or payment services.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The repository deploys to Vercel from the `main` branch. No backend, database, AI API key or environment variable is required for the finder and guides.

## Main files

- `src/app/page.tsx` — hosting finder, launch checklist and FAQs.
- `src/components/DeploymentFinder.tsx` — interactive host recommendation.
- `src/app/deploy-vibe-coded-app/` — general deployment guide.
- `src/app/hostinger-nodejs-app/` — managed Node.js deployment requirements.
- `src/app/digitalocean-app-platform/` — App Platform cost guide.
- `src/lib/site.ts` and `src/app/sitemap.ts` — public route and sitemap definitions.
