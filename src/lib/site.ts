export const SITE_NAME = "AI Percent to Prompts Calculator";

export const SITE_URL = "https://ai-percent-to-prompts-calculator.vercel.app";

export const calculatorRoutes = [
  {
    path: "/",
    title: "AI Percent to Prompts Calculator",
    description:
      "Convert a remaining AI usage percentage into estimated prompts, messages or tasks left.",
    priority: 1,
  },
  {
    path: "/ai-percent-to-prompts-calculator",
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate AI prompts, messages and tasks left from your remaining usage percentage.",
    priority: 0.9,
  },
  {
    path: "/codex-usage-calculator",
    title: "Codex Usage Calculator",
    description:
      "Estimate remaining Codex tasks from a remaining usage percentage.",
    priority: 0.85,
  },
  {
    path: "/chatgpt-limit-calculator",
    title: "ChatGPT Limit Calculator",
    description:
      "Estimate remaining ChatGPT messages from a remaining usage percentage.",
    priority: 0.85,
  },
  {
    path: "/claude-usage-calculator",
    title: "Claude Usage Calculator",
    description:
      "Estimate remaining Claude messages or coding tasks from a remaining usage percentage.",
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
