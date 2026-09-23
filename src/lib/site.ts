export const SITE_NAME = "Percent to Prompts";

export const SITE_URL = "https://percenttoprompts.com";

const contentUpdatedAt = new Date("2026-09-23T00:00:00.000Z");

export const calculatorRoutes = [
  {
    path: "/",
    title: "AI Usage Limit Calculator: Messages & Tasks Left",
    description:
      "Estimate remaining prompts, messages, searches or coding tasks from your AI usage meter, plan and selected reset window.",
    lastModified: contentUpdatedAt,
    priority: 1,
  },
  {
    path: "/codex-usage-calculator",
    title: "Codex Usage Calculator and Reset Planner",
    description:
      "Estimate remaining Codex tasks and check whether your recent usage pace may last until the next reset.",
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
