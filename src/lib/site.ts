export const SITE_NAME = "Percent to Prompts";

export const SITE_URL = "https://percenttoprompts.com";

const contentUpdatedAt = new Date("2026-09-23T00:00:00.000Z");

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
    path: "/chatgpt-limit-calculator",
    title: "ChatGPT Limit Calculator for GPT-6 Pro",
    description:
      "Calculate GPT-6 Pro messages left in ChatGPT Pro or Business, including shared GPT-5.6 Sol Pro limits.",
    lastModified: contentUpdatedAt,
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
