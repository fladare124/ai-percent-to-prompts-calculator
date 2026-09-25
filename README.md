# Prompt to Production

Production site: [percenttoprompts.com](https://percenttoprompts.com/)

Prompt to Production helps people troubleshoot failed builds and choose where to deploy a website or app created with AI coding tools. The site includes a browser-based build-log checker, a hosting finder that can detect common frameworks from a pasted package.json, and practical deployment and provider guides.

The project is independent. Provider requirements, plan terms and prices can change, so the guides link to official documentation and tell readers to confirm current details before deploying. There are currently no affiliate links or provider commissions.

## Privacy and analytics

- Build-log diagnosis, hosting finder choices and package.json framework detection are processed in the browser and are not submitted to the application server.
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

- `src/app/page.tsx` — deployment troubleshooting, hosting finder, launch checklist and FAQs.
- `src/components/DeploymentFinder.tsx` — interactive host recommendation.
- `src/components/DeploymentErrorHelper.tsx` and `src/lib/deploymentDiagnostics.ts` — local build-log checks and troubleshooting suggestions.
- `src/app/deploy-vibe-coded-app/` — AI app deployment troubleshooting guide.
- `src/app/es/arreglar-error-despliegue/` — Spanish troubleshooting guide and translated browser-based checker.
- `src/app/hostinger-nodejs-app/` — managed Node.js deployment requirements.
- `src/app/digitalocean-app-platform/` — App Platform cost guide.
- `src/lib/site.ts` and `src/app/sitemap.ts` — public route and sitemap definitions.
