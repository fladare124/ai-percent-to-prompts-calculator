# AI Usage Calculator

AI Usage Calculator is a frontend-only Next.js MVP that estimates how many AI prompts, messages, tasks, searches or usage units may remain from the remaining percentage shown by a platform.

It supports Codex, ChatGPT, Claude, Gemini, Perplexity, Cursor and Windsurf / Devin. Claude Fable 5 is included in the supported Claude models. The estimate is unofficial and uses plan presets, reset-window presets, task complexity and advanced multipliers.

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

## Change Presets

Edit platform plans, labels, usage units and multipliers in:

```text
src/lib/platformPresets.ts
```

The calculation logic lives in:

```text
src/lib/estimation.ts
```

Claude Fable 5 uses dynamic multipliers by task complexity. It is treated as a high-cost, high-capability model: conservative for light and normal tasks, with a slightly less severe model penalty for heavy long-horizon work. Task complexity still reduces the final estimate.

## Routes

- `/`
- `/codex-usage-calculator`
- `/chatgpt-limit-calculator`
- `/claude-usage-calculator`
- `/gemini-usage-calculator`
- `/ai-usage-calculator`

## Suggested Domains

- `aiusagecalculator.com`
- `codexusagecalculator.com`
- `chatgptlimitcalculator.com`

## Disclaimer

This tool is not affiliated with OpenAI, Anthropic, Google, Perplexity, Cursor, Windsurf or Devin. Results are unofficial estimates based on the remaining percentage and options you enter. Real limits can vary by plan, model, feature, system capacity, context length, files, task complexity and provider changes.
