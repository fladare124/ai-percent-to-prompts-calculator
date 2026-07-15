# AI Percent to Prompts Calculator

AI Percent to Prompts Calculator is a frontend-only Next.js MVP that converts a remaining AI usage percentage into an unofficial estimate of how many prompts, messages, tasks, searches or usage units may remain.

Production: `https://percenttoprompts.com`

It supports ChatGPT / Codex as one OpenAI platform, plus Claude, Gemini, Perplexity, Cursor and Windsurf / Devin. The OpenAI selector separates ChatGPT chat from Codex and Work so message windows are not confused with the shared agentic credit pool. Current model references include GPT-5.6 Sol, Terra and Luna, GPT-5.5, Claude Fable 5, Sonnet 5, Opus 4.8, Haiku 4.5 and current Gemini 3.5/3.1 API models.

Presets and public price references were reviewed on July 10, 2026.

GPT-5.6 Sol and Claude Fable 5 are visible in the main form because model choice has a large effect on the result. Codex also exposes Extra High, Max and Ultra controls when the selected product supports them. Less important context, feature and execution controls remain under Advanced options.

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
`/robots.txt` and `/sitemap.xml` from the canonical calculator routes.

## Change Presets

Edit platform plans, labels, usage units and multipliers in:

```text
src/lib/platformPresets.ts
```

The calculation logic lives in:

```text
src/lib/estimation.ts
```

Claude Fable 5 uses dynamic multipliers by task complexity. It is treated as a high-cost, high-capability model: conservative for light and normal tasks, with a less severe model penalty for heavy long-horizon work where fewer iterations may help.

OpenAI's Max and Ultra execution modes are treated as higher-cost agentic paths, while Extra High is a reasoning-effort option. Claude Max 5x/20x, Gemini AI Ultra and Cursor Ultra are represented as separate plan presets. Availability and limits vary by account, rollout, context and provider capacity.

The app keeps subscription quotas, provider credits and API prices separate. API cost ranges are shown only when an official per-token price is available and are illustrative per-task references, not subscription charges. Unsupported reset windows are time-scaled from the nearest known preset and automatically receive lower reliability.

## Routes

- `/`
- `/ai-percent-to-prompts-calculator`
- `/percent-to-prompts-calculator`
- `/codex-usage-calculator`
- `/chatgpt-limit-calculator`
- `/claude-usage-calculator`
- `/gemini-usage-calculator`
- `/perplexity-usage-calculator`
- `/cursor-usage-calculator`
- `/windsurf-devin-usage-calculator`
- `/ai-usage-calculator`

## Suggested Domains

- `percenttoprompts.com`
- `aipercenttoprompts.com`
- `promptpercent.com`
- `promptsleft.com`
- `percenttoprompts.ai`
- `promptsleft.ai`

## Disclaimer

This tool is not affiliated with OpenAI, Anthropic, Google, Perplexity, Cursor, Windsurf or Devin. Results are unofficial estimates based on the remaining percentage and options you enter. Real limits can vary by plan, model, feature, system capacity, context length, files, task complexity and provider changes. API cost references are not subscription charges.
