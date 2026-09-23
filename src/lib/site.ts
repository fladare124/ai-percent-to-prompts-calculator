export const SITE_NAME = "Percent to Prompts";

export const SITE_URL = "https://percenttoprompts.com";

const contentUpdatedAt = new Date("2026-09-23T00:00:00.000Z");
const chatGPTContentUpdatedAt = new Date("2026-09-23T19:33:15.000Z");
const spanishCodexContentUpdatedAt = new Date("2026-09-23T20:05:53.000Z");

export const calculatorRoutes = [
  {
    path: "/",
    title: "AI Percentage Calculator: Estimate Prompts Left",
    description:
      "Estimate prompts, messages or coding tasks from your AI usage percentage, provider, plan and reset window.",
    lastModified: contentUpdatedAt,
    priority: 1,
  },
  {
    path: "/codex-usage-calculator",
    title: "Codex Usage Calculator: Limit and Reset Planner",
    description:
      "Compare your Codex usage meter with recent readings to estimate whether the 5-hour or weekly allowance can last until reset.",
    lastModified: contentUpdatedAt,
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
    title: "Claude Usage Limit Calculator: Pace Until Reset",
    description:
      "Compare your current Claude usage meter with your recent pace and get current guidance on weekly limits and Fable credits.",
    lastModified: contentUpdatedAt,
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
    title: "Perplexity Usage Calculator",
    description:
      "Estimate remaining Perplexity searches or research tasks from a remaining usage percentage.",
    lastModified: contentUpdatedAt,
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
