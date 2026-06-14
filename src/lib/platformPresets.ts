import type {
  PlatformName,
  PlatformPreset,
  ResetWindow,
  UsageIntensity,
} from "@/types";

export const PLATFORMS: PlatformName[] = [
  "Codex",
  "ChatGPT",
  "Claude",
  "Gemini",
  "Perplexity",
  "Cursor",
  "Windsurf / Devin",
  "Other",
];

export const RESET_WINDOWS: ResetWindow[] = [
  "5 hours",
  "Daily",
  "Weekly",
  "Monthly",
];

export const USAGE_INTENSITIES: UsageIntensity[] = [
  "Light",
  "Normal",
  "Heavy",
  "Very heavy",
];

export const usageIntensityMultipliers: Record<UsageIntensity, number> = {
  Light: 1.2,
  Normal: 1,
  Heavy: 0.7,
  "Very heavy": 0.45,
};

export const defaultPlanByPlatform: Record<PlatformName, string> = {
  Codex: "Plus",
  ChatGPT: "Plus",
  Claude: "Pro",
  Gemini: "AI Pro",
  Perplexity: "Pro",
  Cursor: "Pro",
  "Windsurf / Devin": "Pro",
  Other: "Standard",
};

function limits(
  fiveHours: number,
  daily: number,
  weekly: number,
  monthly: number,
) {
  return {
    "5 hours": fiveHours,
    Daily: daily,
    Weekly: weekly,
    Monthly: monthly,
  };
}

export const platformPresets: Record<PlatformName, PlatformPreset> = {
  Codex: {
    platform: "Codex",
    usageUnit: "Codex tasks / local messages / cloud tasks",
    planPresets: [
      { label: "Free", baseLimits: limits(25, 60, 150, 600) },
      { label: "Plus", baseLimits: limits(100, 250, 700, 2800) },
      { label: "Pro 100", baseLimits: limits(500, 1250, 3500, 14000) },
      { label: "Pro 200", baseLimits: limits(2000, 5000, 14000, 56000) },
      { label: "Business", baseLimits: limits(300, 750, 2100, 8400) },
      {
        label: "Enterprise / Edu",
        baseLimits: limits(300, 750, 2100, 8400),
      },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Model / client",
        options: [
          { label: "Codex Web", multiplier: 1 },
          { label: "Codex CLI", multiplier: 1 },
          { label: "Codex IDE extension", multiplier: 1 },
          { label: "Codex mobile", multiplier: 1 },
          { label: "Not sure", multiplier: 0.9 },
        ],
      },
      {
        key: "reasoning",
        label: "Reasoning effort",
        options: [
          { label: "Low", multiplier: 1.15 },
          { label: "Medium", multiplier: 1 },
          { label: "High", multiplier: 0.65 },
          { label: "Extra High", multiplier: 0.35 },
        ],
      },
      {
        key: "speed",
        label: "Speed / execution style",
        options: [
          { label: "Standard", multiplier: 1 },
          { label: "Fast", multiplier: 0.95 },
        ],
      },
      {
        key: "workType",
        label: "Work type",
        options: [
          { label: "Simple function / script", multiplier: 1.25 },
          { label: "Bug fix", multiplier: 1.1 },
          { label: "Small feature", multiplier: 0.9 },
          { label: "Refactor", multiplier: 0.7 },
          { label: "Large feature", multiplier: 0.5 },
          { label: "Repo-wide change", multiplier: 0.35 },
          { label: "Long-running agent task", multiplier: 0.25 },
        ],
      },
      {
        key: "context",
        label: "Context size",
        options: [
          { label: "Small repo / few files", multiplier: 1.1 },
          { label: "Medium repo", multiplier: 1 },
          { label: "Large repo", multiplier: 0.7 },
          { label: "Huge repo / many files", multiplier: 0.45 },
        ],
      },
      {
        key: "environment",
        label: "Execution environment",
        options: [
          { label: "Local", multiplier: 1 },
          { label: "Cloud / delegated", multiplier: 0.8 },
          { label: "Not sure", multiplier: 0.9 },
        ],
      },
    ],
  },
  ChatGPT: {
    platform: "ChatGPT",
    usageUnit: "messages / prompts",
    planPresets: [
      { label: "Free", baseLimits: limits(25, 60, 160, 640) },
      { label: "Plus", baseLimits: limits(160, 380, 1100, 4400) },
      { label: "Pro 100", baseLimits: limits(800, 1900, 5600, 22400) },
      { label: "Pro 200", baseLimits: limits(3200, 7600, 22400, 89600) },
      { label: "Business", baseLimits: limits(300, 720, 2100, 8400) },
      {
        label: "Enterprise / Edu",
        baseLimits: limits(300, 720, 2100, 8400),
      },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Model / mode",
        options: [
          { label: "GPT-5.5 Instant", multiplier: 1 },
          { label: "GPT-5.5 Thinking", multiplier: 0.65 },
          { label: "Legacy / Custom", multiplier: 0.85 },
          { label: "Not sure", multiplier: 0.8 },
        ],
      },
      {
        key: "reasoning",
        label: "Thinking time",
        options: [
          { label: "None / Instant", multiplier: 1 },
          { label: "Light", multiplier: 0.85 },
          { label: "Standard", multiplier: 0.65 },
          { label: "Extended", multiplier: 0.45 },
          { label: "Heavy", multiplier: 0.3 },
        ],
      },
      {
        key: "feature",
        label: "Tool / feature",
        options: [
          { label: "Simple chat", multiplier: 1 },
          { label: "Web search", multiplier: 0.85 },
          { label: "Data analysis", multiplier: 0.65 },
          { label: "File analysis", multiplier: 0.6 },
          { label: "Image analysis", multiplier: 0.7 },
          { label: "Image generation", multiplier: 0.4 },
          { label: "Canvas", multiplier: 0.75 },
          { label: "Deep research", multiplier: 0.25 },
          { label: "Agent mode", multiplier: 0.3 },
        ],
      },
    ],
  },
  Claude: {
    platform: "Claude",
    usageUnit: "messages / coding tasks",
    planPresets: [
      { label: "Free", baseLimits: limits(25, 50, 150, 600) },
      { label: "Pro", baseLimits: limits(100, 240, 700, 2800) },
      { label: "Max 5x", baseLimits: limits(500, 1200, 3500, 14000) },
      { label: "Max 20x", baseLimits: limits(2000, 4800, 14000, 56000) },
      { label: "Team", baseLimits: limits(300, 720, 2100, 8400) },
      { label: "Enterprise", baseLimits: limits(300, 720, 2100, 8400) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Claude model",
        options: [
          { label: "Claude Fable 5", value: "claude-fable-5", multiplier: 1 },
          { label: "Claude Opus", value: "claude-opus", multiplier: 0.6 },
          { label: "Claude Sonnet", value: "claude-sonnet", multiplier: 1 },
          { label: "Claude Haiku", value: "claude-haiku", multiplier: 1.6 },
          { label: "Not sure", value: "not-sure", multiplier: 0.75 },
        ],
      },
      {
        key: "mode",
        label: "Claude mode",
        options: [
          { label: "Standard chat", multiplier: 1 },
          { label: "Claude Code", multiplier: 0.4 },
          { label: "Long context", multiplier: 0.45 },
          { label: "Files", multiplier: 0.5 },
          { label: "Research / analysis", multiplier: 0.6 },
        ],
      },
      {
        key: "context",
        label: "Context size",
        options: [
          { label: "Short conversation", multiplier: 1.15 },
          { label: "Normal conversation", multiplier: 1 },
          { label: "Long conversation", multiplier: 0.6 },
          { label: "Very long conversation", multiplier: 0.35 },
          { label: "Project knowledge / cached docs", multiplier: 1.2 },
          { label: "Repeated file upload", multiplier: 0.65 },
        ],
      },
      {
        key: "reasoning",
        label: "Effort level",
        options: [
          { label: "Normal", multiplier: 1 },
          { label: "High effort / extended thinking", multiplier: 0.55 },
          { label: "Very high effort", multiplier: 0.35 },
        ],
      },
    ],
  },
  Gemini: {
    platform: "Gemini",
    usageUnit: "prompts / actions",
    planPresets: [
      { label: "No AI plan", baseLimits: limits(50, 100, 300, 1200) },
      { label: "AI Plus", baseLimits: limits(100, 240, 700, 2800) },
      { label: "AI Pro", baseLimits: limits(200, 480, 1400, 5600) },
      { label: "AI Ultra", baseLimits: limits(1000, 2400, 7000, 28000) },
      { label: "Workspace", baseLimits: limits(200, 480, 1400, 5600) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Model",
        options: [
          { label: "Gemini 3 Flash-Lite", multiplier: 1.25 },
          { label: "Gemini 3 Flash", multiplier: 1 },
          { label: "Gemini 3 Pro", multiplier: 0.55 },
          { label: "Not sure", multiplier: 0.8 },
        ],
      },
      {
        key: "reasoning",
        label: "Thinking level",
        options: [
          { label: "Standard thinking", multiplier: 1 },
          { label: "Extended thinking", multiplier: 0.6 },
          { label: "Deep Think", multiplier: 0.25 },
        ],
      },
      {
        key: "feature",
        label: "Feature",
        options: [
          { label: "Standard chat", multiplier: 1 },
          { label: "Canvas", multiplier: 0.85 },
          { label: "Gems", multiplier: 0.9 },
          { label: "Storybook", multiplier: 0.7 },
          { label: "Connected Apps", multiplier: 0.75 },
          { label: "Quizzes & flashcards", multiplier: 0.85 },
          { label: "Audio overviews", multiplier: 0.65 },
          { label: "Screen automation", multiplier: 0.45 },
          { label: "Slide generation", multiplier: 0.45 },
          { label: "Deep Research", multiplier: 0.3 },
          { label: "Daily brief", multiplier: 0.8 },
          { label: "Gemini Spark", multiplier: 0.35 },
          { label: "Image generation", multiplier: 0.4 },
          { label: "Redo images", multiplier: 0.35 },
          { label: "Video generation", multiplier: 0.15 },
          { label: "Music generation", multiplier: 0.35 },
          { label: "Scheduled actions", multiplier: 0.55 },
        ],
      },
    ],
  },
  Perplexity: {
    platform: "Perplexity",
    usageUnit: "searches / research tasks",
    planPresets: [
      { label: "Free", baseLimits: limits(30, 70, 200, 800) },
      { label: "Pro", baseLimits: limits(100, 240, 700, 2800) },
      { label: "Max", baseLimits: limits(500, 1200, 3500, 14000) },
      { label: "Enterprise", baseLimits: limits(300, 720, 2100, 8400) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Mode",
        options: [
          { label: "Quick search", multiplier: 1.2 },
          { label: "Pro Search", multiplier: 0.85 },
          { label: "Deep Research", multiplier: 0.25 },
          { label: "Labs", multiplier: 0.3 },
          { label: "File analysis", multiplier: 0.55 },
        ],
      },
      {
        key: "apiModel",
        label: "Advanced / API model",
        options: [
          { label: "Sonar", multiplier: 1 },
          { label: "Sonar Pro", multiplier: 0.75 },
          { label: "Sonar Reasoning Pro", multiplier: 0.5 },
          { label: "Sonar Deep Research", multiplier: 0.25 },
          { label: "Agent API", multiplier: 0.45 },
          { label: "Search API", multiplier: 1 },
          { label: "Not using API", multiplier: 1 },
        ],
      },
    ],
  },
  Cursor: {
    platform: "Cursor",
    usageUnit: "requests / agent runs",
    planPresets: [
      { label: "Free", baseLimits: limits(25, 60, 160, 640) },
      { label: "Pro", baseLimits: limits(100, 240, 700, 2800) },
      { label: "Business", baseLimits: limits(300, 720, 2100, 8400) },
      { label: "Ultra", baseLimits: limits(1000, 2400, 7000, 28000) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Mode",
        options: [
          { label: "Tab completion", multiplier: 1.4 },
          { label: "Chat", multiplier: 1 },
          { label: "Edit", multiplier: 0.85 },
          { label: "Agent", multiplier: 0.45 },
          { label: "Multi-file edit", multiplier: 0.4 },
          { label: "Manual premium model", multiplier: 0.5 },
          { label: "Auto mode", multiplier: 0.9 },
        ],
      },
      {
        key: "context",
        label: "Context size",
        options: [
          { label: "Single file", multiplier: 1.15 },
          { label: "Few files", multiplier: 1 },
          { label: "Many files", multiplier: 0.65 },
          { label: "Whole repo", multiplier: 0.35 },
        ],
      },
    ],
  },
  "Windsurf / Devin": {
    platform: "Windsurf / Devin",
    usageUnit: "requests / agent runs / quota units",
    planPresets: [
      { label: "Free", baseLimits: limits(25, 60, 160, 640) },
      { label: "Pro", baseLimits: limits(100, 240, 700, 2800) },
      { label: "Teams", baseLimits: limits(300, 720, 2100, 8400) },
      { label: "Enterprise", baseLimits: limits(300, 720, 2100, 8400) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Product / mode",
        options: [
          { label: "Cascade chat", multiplier: 1 },
          { label: "Cascade tool calling", multiplier: 0.6 },
          { label: "Cascade auto-continue", multiplier: 0.45 },
          { label: "Repo-wide task", multiplier: 0.3 },
          { label: "Cloud agent", multiplier: 0.35 },
          { label: "Devin CLI", multiplier: 0.7 },
          { label: "Devin Local", multiplier: 0.8 },
        ],
      },
      {
        key: "apiModel",
        label: "Model",
        options: [
          { label: "Adaptive", multiplier: 0.95 },
          { label: "SWE-1.6", multiplier: 0.65 },
          { label: "SWE-1.6 Fast", multiplier: 0.5 },
          { label: "SWE-1.5", multiplier: 0.75 },
          { label: "SWE-1", multiplier: 0.9 },
          { label: "SWE-1-mini", multiplier: 1.4 },
          { label: "swe-grep", multiplier: 1.3 },
          { label: "BYOK model", multiplier: 1 },
          { label: "Not sure", multiplier: 0.8 },
        ],
      },
    ],
  },
  Other: {
    platform: "Other",
    usageUnit: "AI usage units",
    planPresets: [
      { label: "Free", baseLimits: limits(25, 60, 160, 640) },
      { label: "Standard", baseLimits: limits(100, 240, 700, 2800) },
      { label: "Team", baseLimits: limits(300, 720, 2100, 8400) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Mode",
        options: [
          { label: "Standard chat", multiplier: 1 },
          { label: "Files or tools", multiplier: 0.65 },
          { label: "Agentic work", multiplier: 0.45 },
          { label: "Not sure", multiplier: 0.8 },
        ],
      },
    ],
  },
};
