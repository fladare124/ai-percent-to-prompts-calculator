export const SITE_NAME = "AI Plan Finder";

export const SITE_URL = "https://percenttoprompts.com";

const contentUpdatedAt = new Date("2026-09-23T00:00:00.000Z");
const homeContentUpdatedAt = new Date("2026-09-25T03:33:00.000Z");
const usageCalculatorContentUpdatedAt = new Date("2026-09-25T03:20:00.000Z");
const codexContentUpdatedAt = new Date("2026-09-23T20:18:07.000Z");
const chatGPTContentUpdatedAt = new Date("2026-09-23T19:33:15.000Z");
const spanishCodexContentUpdatedAt = new Date("2026-09-23T20:05:53.000Z");
const claudeContentUpdatedAt = new Date("2026-09-25T04:13:48.000Z");
const perplexityContentUpdatedAt = new Date("2026-09-25T04:04:59.000Z");

export const calculatorRoutes = [
  {
    path: "/",
    title: "AI Coding Plan Finder: Compare Claude, Codex, Cursor & Copilot",
    description:
      "Compare Claude Code, Codex, Cursor and GitHub Copilot prices, usage limits and reset patterns, then find a plan that fits your coding workflow and budget.",
    lastModified: homeContentUpdatedAt,
    priority: 1,
  },
  {
    path: "/ai-usage-calculator",
    title: "AI Percentage Calculator: Estimate Prompts Left",
    description:
      "Convert the remaining percentage in an AI usage meter into estimated prompts, messages or coding tasks.",
    lastModified: usageCalculatorContentUpdatedAt,
    priority: 0.9,
  },
  {
    path: "/codex-usage-calculator",
    title: "Codex Usage Calculator: Tasks Left and Reset Pace",
    description:
      "Estimate similar Codex tasks from your own usage history, then check whether that pace could last until reset.",
    lastModified: codexContentUpdatedAt,
    priority: 0.85,
  },
  {
    path: "/es/calculadora-uso-codex",
    title: "Calculadora de uso de Codex: límite y restablecimiento",
    description:
      "Calcula si tu porcentaje de uso de Codex te durará hasta el próximo restablecimiento. Compara tu saldo actual, tu ritmo reciente y las horas que faltan.",
    lastModified: spanishCodexContentUpdatedAt,
    priority: 0.8,
  },
  {
    path: "/github-copilot-usage-calculator",
    title: "GitHub Copilot AI Credits Calculator & Planner",
    description:
      "Estimate credits per interaction and monthly Copilot usage by model, tokens, plan allowance and recent credit pace.",
    lastModified: contentUpdatedAt,
    priority: 0.85,
  },
  {
    path: "/chatgpt-limit-calculator",
    title: "ChatGPT Limit Calculator: Messages Left in 5 Hours",
    description:
      "Estimate ChatGPT Work and Codex local messages left from your plan, model and remaining usage percentage using OpenAI’s published five-hour ranges.",
    lastModified: chatGPTContentUpdatedAt,
    priority: 0.85,
  },
  {
    path: "/claude-usage-calculator",
    title: "Claude Code Usage Limit Calculator: 5-Hour & Weekly",
    description:
      "Check whether your Claude Code session or weekly allowance could last until reset. Compare both usage bars with your recent pace; no fixed prompt counts assumed.",
    lastModified: claudeContentUpdatedAt,
    priority: 0.85,
  },
  {
    path: "/gemini-usage-calculator",
    title: "Gemini Usage Calculator: 5-Hour and Weekly Limit Planner",
    description:
      "Check whether Gemini Apps usage can last until refresh using your current limit reading and recent usage pace.",
    lastModified: contentUpdatedAt,
    priority: 0.8,
  },
  {
    path: "/perplexity-usage-calculator",
    title: "Perplexity Usage Calculator: Pro Search & Research Limits",
    description:
      "Track your Perplexity Pro Search or Research balance against its reset time. See published Free and Enterprise limits and check dynamic paid-plan usage.",
    lastModified: perplexityContentUpdatedAt,
    priority: 0.75,
  },
  {
    path: "/cursor-usage-calculator",
    title: "Cursor Usage Calculator: Pool Balance and Reset Pace",
    description:
      "Check whether your Cursor Models or Other Models pool could last until reset using recent readings from your usage dashboard.",
    lastModified: contentUpdatedAt,
    priority: 0.75,
  },
  {
    path: "/windsurf-devin-usage-calculator",
    title: "Windsurf and Devin Usage Calculator: Daily and Weekly Planner",
    description:
      "Compare your Windsurf or Devin daily and weekly usage allowance with recent readings from your account.",
    lastModified: contentUpdatedAt,
    priority: 0.75,
  },
];
