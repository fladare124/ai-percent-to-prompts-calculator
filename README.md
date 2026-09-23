# AI Percent to Prompts Calculator

AI Percent to Prompts Calculator is a frontend-only Next.js MVP that converts a remaining AI usage percentage into an unofficial estimate of how many prompts, messages, tasks, searches or usage units may remain.

Production site: [Percent to Prompts — AI usage percentage calculator](https://percenttoprompts.com/)

It includes separate guides and calculators for [ChatGPT Work and Codex message ranges](https://percenttoprompts.com/chatgpt-limit-calculator), Claude, Gemini, Perplexity, GitHub Copilot, Cursor and Windsurf / Devin. The [GitHub Copilot AI credits calculator](https://percenttoprompts.com/github-copilot-usage-calculator) estimates token-based model costs and monthly credit use. The OpenAI selector separates ChatGPT chat from Codex and Work so message windows are not confused with the shared agentic credit pool. Presets are estimates rather than live provider limits.

Spanish-speaking Codex users can use the [Codex usage calculator in Spanish](https://percenttoprompts.com/es/calculadora-uso-codex) to forecast whether their current usage pace may last until reset.

Each provider calculator links to the public documentation behind its guidance. Usage rules and API prices can change; API prices shown in the calculator refer to token use, not subscription charges.

The result includes an optional personal calibration tool. Compare two usage readings from the same reset window and estimate remaining work from your own recent usage rate. The Codex page also compares a recent usage pace with the time left until reset; these entered values stay in the browser.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## Build

```bash
npm run build
```

Useful checks:

```bash
npm run test
npm run typecheck
npm run lint
```

## Deploy on Vercel

1. Push this folder to a Git repository.
2. Import the repository in Vercel.
3. Keep the framework preset as Next.js.
4. Use the default build command: `npm run build`.
5. Deploy.

No backend, database or environment variables are required.

The app includes Vercel Web Analytics and Speed Insights. It also generates
`/robots.txt` and `/sitemap.xml` from the canonical calculator routes. Older
duplicate calculator paths permanently redirect to the homepage.

## Change Presets

Edit platform plans, labels, usage units and multipliers in:

```text
src/lib/platformPresets.ts
```

The calculation logic lives in:

```text
src/lib/estimation.ts
```

The app keeps subscription quotas, provider credits and API prices separate. API cost ranges are shown only when an official per-token price is available and are illustrative per-task references, not subscription charges. Unsupported reset windows are time-scaled from the nearest known preset and automatically receive lower reliability.

## Routes

- `/`
- `/codex-usage-calculator`
- `/es/calculadora-uso-codex`
- `/chatgpt-limit-calculator`
- `/claude-usage-calculator`
- `/gemini-usage-calculator`
- `/github-copilot-usage-calculator`
- `/perplexity-usage-calculator`
- `/cursor-usage-calculator`
- `/windsurf-devin-usage-calculator`
- Older duplicate paths redirect to `/`.

## Disclaimer

This tool is not affiliated with OpenAI, Anthropic, Google, Perplexity, Cursor, Windsurf or Devin. Results are unofficial estimates based on the remaining percentage and options you enter. Real limits can vary by plan, model, feature, system capacity, context length, files, task complexity and provider changes. API cost references are not subscription charges.
