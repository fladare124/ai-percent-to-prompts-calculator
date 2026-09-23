export const SITE_NAME = "Percent to Prompts";

export const SITE_URL = "https://percenttoprompts.com";

export const calculatorRoutes = [
  {
    path: "/",
    title: "AI Usage Limit Calculator: Messages & Tasks Left",
    description:
      "Estimate remaining prompts, messages, searches or coding tasks from your AI usage meter, plan and selected reset window.",
    priority: 1,
  },
  {
    path: "/codex-usage-calculator",
    title: "Codex Usage Calculator and Reset Planner",
    description:
      "Estimate remaining Codex tasks and check whether your recent usage pace may last until the next reset.",
    priority: 0.85,
  },
  {
    path: "/chatgpt-limit-calculator",
    title: "ChatGPT Limit Calculator",
    description:
      "Estimate remaining ChatGPT messages from your plan, model and usage percentage.",
    priority: 0.85,
  },
  {
    path: "/claude-usage-calculator",
    title: "Claude Usage Calculator and Reset Planner",
    description:
      "Estimate Claude messages or Claude Code tasks and compare your usage pace with the next reset.",
    priority: 0.85,
  },
  {
    path: "/gemini-usage-calculator",
    title: "Gemini Usage Calculator",
    description:
      "Estimate remaining Gemini prompts or actions from a remaining usage percentage.",
    priority: 0.8,
  },
  {
    path: "/perplexity-usage-calculator",
    title: "Perplexity Usage Calculator",
    description:
      "Estimate remaining Perplexity searches or research tasks from a remaining usage percentage.",
    priority: 0.75,
  },
  {
    path: "/cursor-usage-calculator",
    title: "Cursor Usage Calculator",
    description:
      "Estimate remaining Cursor requests or agent runs from a remaining usage percentage.",
    priority: 0.75,
  },
  {
    path: "/windsurf-devin-usage-calculator",
    title: "Windsurf / Devin Usage Calculator",
    description:
      "Estimate remaining Windsurf or Devin quota units and agent runs from a remaining usage percentage.",
    priority: 0.75,
  },
];
