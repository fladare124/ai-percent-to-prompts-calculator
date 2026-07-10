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
  "3 hours",
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

function limits(values: Partial<Record<ResetWindow, number>>) {
  return values;
}

export const platformPresets: Record<PlatformName, PlatformPreset> = {
  Codex: {
    platform: "Codex",
    usageUnit: "Codex task equivalents",
    resetWindows: ["5 hours", "Weekly"],
    defaultResetWindow: "5 hours",
    limitBasis:
      "Normalized task equivalents. Current Codex billing is token/credit based, so real tasks vary substantially by model and workload.",
    planPresets: [
      { label: "Free", baseLimits: limits({ "5 hours": 20, Weekly: 100 }) },
      { label: "Plus", baseLimits: limits({ "5 hours": 100, Weekly: 700 }) },
      { label: "Pro 100", baseLimits: limits({ "5 hours": 500, Weekly: 3500 }) },
      { label: "Pro 200", baseLimits: limits({ "5 hours": 2000, Weekly: 14000 }) },
      { label: "Business", baseLimits: limits({ "5 hours": 100, Weekly: 700 }) },
      { label: "Enterprise / Edu", baseLimits: limits({ "5 hours": 100, Weekly: 700 }) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Codex model",
        options: [
          {
            label: "GPT-5.6 Sol (preview)",
            multiplier: 1,
            apiPricing: { inputPerMillion: 5, outputPerMillion: 30 },
            availabilityNote: "Limited preview; availability and limits can change.",
          },
          {
            label: "GPT-5.5",
            multiplier: 1,
            apiPricing: { inputPerMillion: 5, outputPerMillion: 30 },
            costReference: "Codex typical tasks currently use roughly 5-45 credits on GPT-5.5.",
          },
          {
            label: "GPT-5.4",
            multiplier: 2,
            apiPricing: { inputPerMillion: 2.5, outputPerMillion: 15 },
          },
          {
            label: "GPT-5.4 Mini",
            multiplier: 6,
            apiPricing: { inputPerMillion: 0.75, outputPerMillion: 4.5 },
          },
          { label: "GPT-5.3 Codex", multiplier: 2.3 },
          { label: "Auto / Not sure", multiplier: 0.85 },
        ],
      },
      {
        key: "reasoning",
        label: "Reasoning effort",
        options: [
          { label: "Low", multiplier: 1.2 },
          { label: "Medium", multiplier: 1 },
          { label: "High", multiplier: 0.75 },
          { label: "Extra High", multiplier: 0.55 },
        ],
      },
      {
        key: "workType",
        label: "Work type",
        options: [
          { label: "Simple function / script", multiplier: 1.2 },
          { label: "Bug fix", multiplier: 1.05 },
          { label: "Small feature", multiplier: 0.9 },
          { label: "Refactor", multiplier: 0.75 },
          { label: "Large feature", multiplier: 0.55 },
          { label: "Repo-wide change", multiplier: 0.4 },
          { label: "Long-running agent task", multiplier: 0.3 },
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
      {
        key: "context",
        label: "Context size",
        options: [
          { label: "Small repo / few files", multiplier: 1.1 },
          { label: "Medium repo", multiplier: 1 },
          { label: "Large repo", multiplier: 0.72 },
          { label: "Huge repo / many files", multiplier: 0.48 },
        ],
      },
      {
        key: "speed",
        label: "Speed / execution style",
        options: [
          { label: "Standard", multiplier: 1 },
          { label: "Fast", multiplier: 0.65 },
        ],
      },
    ],
  },
  ChatGPT: {
    platform: "ChatGPT",
    usageUnit: "ChatGPT messages",
    resetWindows: ["3 hours", "5 hours", "Weekly"],
    defaultResetWindow: "3 hours",
    limitBasis:
      "ChatGPT message caps where published. Plus uses the current 160 messages per 3-hour reference; Pro tiers use official 5x and 20x plan ratios.",
    planPresets: [
      { label: "Free", baseLimits: limits({ "5 hours": 10 }) },
      { label: "Plus", baseLimits: limits({ "3 hours": 160 }) },
      { label: "Pro 100", baseLimits: limits({ "3 hours": 800 }) },
      { label: "Pro 200", baseLimits: limits({ "3 hours": 3200 }) },
      { label: "Business", baseLimits: limits({ "3 hours": 300 }) },
      { label: "Enterprise / Edu", baseLimits: limits({ "3 hours": 300 }) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Model / mode",
        options: [
          {
            label: "GPT-5.6 Sol (preview)",
            multiplier: 0.55,
            apiPricing: { inputPerMillion: 5, outputPerMillion: 30 },
            availabilityNote: "Limited preview; not a generally available ChatGPT cap.",
          },
          {
            label: "GPT-5.6 Terra (preview)",
            multiplier: 0.8,
            apiPricing: { inputPerMillion: 2.5, outputPerMillion: 15 },
            availabilityNote: "Limited preview; not a generally available ChatGPT cap.",
          },
          {
            label: "GPT-5.6 Luna (preview)",
            multiplier: 1.25,
            apiPricing: { inputPerMillion: 1, outputPerMillion: 6 },
            availabilityNote: "Limited preview; not a generally available ChatGPT cap.",
          },
          {
            label: "GPT-5.5 Instant",
            multiplier: 1,
            apiPricing: { inputPerMillion: 5, outputPerMillion: 30 },
          },
          { label: "GPT-5.5 Thinking", multiplier: 0.7 },
          { label: "Legacy / Custom", multiplier: 0.8 },
          { label: "Not sure", multiplier: 0.75 },
        ],
      },
      {
        key: "reasoning",
        label: "Thinking time",
        options: [
          { label: "None / Instant", multiplier: 1 },
          { label: "Medium", multiplier: 0.9 },
          { label: "High", multiplier: 0.75 },
          { label: "Extra High", multiplier: 0.6 },
          { label: "Pro Standard", multiplier: 0.25 },
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
    usageUnit: "Claude messages / coding tasks",
    resetWindows: ["5 hours", "Weekly"],
    defaultResetWindow: "5 hours",
    limitBasis:
      "Anthropic's published 5-hour examples: roughly 45 chats on Pro, 225 on Max 5x and 900 on Max 20x. Coding prompts are usually fewer.",
    planPresets: [
      { label: "Free", baseLimits: limits({ "5 hours": 10 }) },
      { label: "Pro", baseLimits: limits({ "5 hours": 45 }) },
      { label: "Max 5x", baseLimits: limits({ "5 hours": 225 }) },
      { label: "Max 20x", baseLimits: limits({ "5 hours": 900 }) },
      { label: "Team", baseLimits: limits({ "5 hours": 45 }) },
      { label: "Enterprise", baseLimits: limits({ "5 hours": 90 }) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Claude model",
        options: [
          {
            label: "Claude Sonnet 5",
            value: "claude-sonnet-5",
            multiplier: 1,
            apiPricing: {
              inputPerMillion: 2,
              outputPerMillion: 10,
              note: "Introductory price through August 31, 2026; then $3/$15 per million tokens.",
            },
          },
          {
            label: "Claude Fable 5",
            value: "claude-fable-5",
            multiplier: 1,
            apiPricing: { inputPerMillion: 10, outputPerMillion: 50 },
          },
          {
            label: "Claude Opus 4.8",
            value: "claude-opus-4-8",
            multiplier: 0.4,
            apiPricing: { inputPerMillion: 5, outputPerMillion: 25 },
          },
          {
            label: "Claude Haiku 4.5",
            value: "claude-haiku-4-5",
            multiplier: 2,
            apiPricing: { inputPerMillion: 1, outputPerMillion: 5 },
          },
          { label: "Not sure", value: "claude-not-sure", multiplier: 0.75 },
        ],
      },
      {
        key: "mode",
        label: "Claude mode",
        options: [
          { label: "Standard chat", multiplier: 1 },
          { label: "Claude Code", multiplier: 0.55 },
          { label: "Long context", multiplier: 0.45 },
          { label: "Files", multiplier: 0.6 },
          { label: "Research / analysis", multiplier: 0.5 },
        ],
      },
      {
        key: "context",
        label: "Context",
        options: [
          { label: "Short conversation", multiplier: 1.1 },
          { label: "Normal conversation", multiplier: 1 },
          { label: "Long conversation", multiplier: 0.65 },
          { label: "Very long conversation", multiplier: 0.4 },
          { label: "Project knowledge / cached docs", multiplier: 1.1 },
          { label: "Repeated file upload", multiplier: 0.65 },
        ],
      },
      {
        key: "reasoning",
        label: "Effort level",
        options: [
          { label: "Normal", multiplier: 1 },
          { label: "High effort / extended thinking", multiplier: 0.6 },
          { label: "Very high effort", multiplier: 0.4 },
        ],
      },
    ],
  },
  Gemini: {
    platform: "Gemini",
    usageUnit: "Gemini prompts / actions",
    resetWindows: ["5 hours", "Weekly"],
    defaultResetWindow: "5 hours",
    limitBasis:
      "Compute-based prompt equivalents using Google's published plan ratios. Actual usage depends on model, context, feature and task complexity.",
    planPresets: [
      { label: "No AI plan", baseLimits: limits({ "5 hours": 50, Weekly: 300 }) },
      { label: "AI Plus", baseLimits: limits({ "5 hours": 100, Weekly: 600 }) },
      { label: "AI Pro", baseLimits: limits({ "5 hours": 200, Weekly: 1200 }) },
      { label: "AI Ultra 5x", baseLimits: limits({ "5 hours": 1000, Weekly: 6000 }) },
      { label: "AI Ultra 20x", baseLimits: limits({ "5 hours": 4000, Weekly: 24000 }) },
      { label: "Workspace", baseLimits: limits({ "5 hours": 200, Weekly: 1200 }) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Gemini model",
        options: [
          { label: "Gemini 3 Flash-Lite", multiplier: 1.4 },
          { label: "Gemini 3 Flash", multiplier: 1 },
          { label: "Gemini 3 Pro", multiplier: 0.5 },
          {
            label: "Gemini 3.5 Flash (API)",
            multiplier: 0.8,
            apiPricing: { inputPerMillion: 1.5, outputPerMillion: 9 },
          },
          {
            label: "Gemini 3.1 Flash-Lite (API)",
            multiplier: 2,
            apiPricing: { inputPerMillion: 0.25, outputPerMillion: 1.5 },
          },
          {
            label: "Gemini 3.1 Pro Preview (API)",
            multiplier: 0.45,
            apiPricing: {
              inputPerMillion: 2,
              outputPerMillion: 12,
              note: "Pricing shown for prompts up to 200K tokens.",
            },
          },
          { label: "Not sure", multiplier: 0.75 },
        ],
      },
      {
        key: "reasoning",
        label: "Thinking level",
        options: [
          { label: "Standard thinking", multiplier: 1 },
          { label: "Extended thinking", multiplier: 0.7 },
          { label: "Deep Think", multiplier: 0.35 },
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
    resetWindows: ["Daily", "Weekly", "Monthly"],
    defaultResetWindow: "Weekly",
    limitBasis:
      "Published search allowances where available; consumer Pro and Max figures are conservative estimates because exact dynamic caps are not public.",
    planPresets: [
      { label: "Free", baseLimits: limits({ Daily: 3, Weekly: 21, Monthly: 90 }) },
      { label: "Pro", baseLimits: limits({ Weekly: 300, Monthly: 1200 }) },
      { label: "Education Pro", baseLimits: limits({ Weekly: 300, Monthly: 1200 }) },
      { label: "Max", baseLimits: limits({ Weekly: 1200, Monthly: 4800 }) },
      { label: "Enterprise Pro", baseLimits: limits({ Weekly: 400, Monthly: 1600 }) },
      { label: "Enterprise Max", baseLimits: limits({ Weekly: 4000, Monthly: 16000 }) },
    ],
    advancedGroups: [
      {
        key: "mode",
        label: "Search mode",
        options: [
          { label: "Quick / Best search", multiplier: 1.2 },
          { label: "Pro Search", multiplier: 0.85 },
          { label: "Reasoning", multiplier: 0.55 },
          { label: "Deep Research", multiplier: 0.2 },
          { label: "Create files and apps", multiplier: 0.15 },
          { label: "File analysis", multiplier: 0.6 },
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
    resetWindows: ["Monthly"],
    defaultResetWindow: "Monthly",
    limitBasis:
      "Monthly included API usage converted to request equivalents. Cursor publishes approximate model-specific request counts, so model choice matters.",
    planPresets: [
      { label: "Hobby", baseLimits: limits({ Monthly: 25 }) },
      { label: "Pro", baseLimits: limits({ Monthly: 500 }) },
      { label: "Pro+", baseLimits: limits({ Monthly: 1500 }) },
      { label: "Ultra", baseLimits: limits({ Monthly: 10000 }) },
      { label: "Teams", baseLimits: limits({ Monthly: 500 }) },
      { label: "Enterprise", baseLimits: limits({ Monthly: 500 }) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Model",
        options: [
          { label: "Cursor Auto", multiplier: 1.3 },
          { label: "GPT-5 / GPT-5.5", multiplier: 1 },
          { label: "GPT-5.6 Sol (preview)", multiplier: 1 },
          { label: "Claude Sonnet 5", multiplier: 0.45 },
          { label: "Claude Opus 4.8", multiplier: 0.2 },
          { label: "Claude Fable 5", multiplier: 0.55 },
          { label: "Gemini 3.5 Flash", multiplier: 1.1 },
          { label: "Not sure", multiplier: 0.8 },
        ],
      },
      {
        key: "mode",
        label: "Mode",
        options: [
          { label: "Tab completion", multiplier: 2 },
          { label: "Ask / Chat", multiplier: 1 },
          { label: "Edit", multiplier: 0.9 },
          { label: "Agent", multiplier: 0.65 },
          { label: "Multi-file edit", multiplier: 0.5 },
          { label: "Background Agent", multiplier: 0.35 },
        ],
      },
      {
        key: "context",
        label: "Context size",
        options: [
          { label: "Single file", multiplier: 1.15 },
          { label: "Few files", multiplier: 1 },
          { label: "Many files", multiplier: 0.65 },
          { label: "Whole repo", multiplier: 0.4 },
        ],
      },
    ],
  },
  "Windsurf / Devin": {
    platform: "Windsurf / Devin",
    usageUnit: "prompt credits / agent usage",
    resetWindows: ["Monthly"],
    defaultResetWindow: "Monthly",
    limitBasis:
      "Windsurf monthly prompt credits where published. Devin sessions use a separate complexity-based quota, so Devin estimates have lower confidence.",
    planPresets: [
      { label: "Free", baseLimits: limits({ Monthly: 25 }) },
      { label: "Pro", baseLimits: limits({ Monthly: 500 }) },
      { label: "Teams", baseLimits: limits({ Monthly: 500 }) },
      { label: "Enterprise", baseLimits: limits({ Monthly: 1000 }) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Model",
        options: [
          { label: "Adaptive", multiplier: 1 },
          { label: "SWE-1.6", multiplier: 1.5, costReference: "Currently listed as a promotional zero-credit model; this can change." },
          { label: "Claude Opus 4.6", multiplier: 1 / 6, costReference: "6 prompt credits per message." },
          { label: "Claude Opus 4.7 Low", multiplier: 1 / 20, costReference: "20 prompt credits per message." },
          { label: "Claude Opus 4.7 Medium", multiplier: 1 / 40, costReference: "40 prompt credits per message." },
          { label: "Not sure", multiplier: 0.75 },
        ],
      },
      {
        key: "mode",
        label: "Product / mode",
        options: [
          { label: "Cascade chat", multiplier: 1 },
          { label: "Cascade tool calling", multiplier: 0.7 },
          { label: "Cascade auto-continue", multiplier: 0.55 },
          { label: "Repo-wide task", multiplier: 0.4 },
          { label: "Cloud agent", multiplier: 0.35 },
          { label: "Devin session", multiplier: 0.25 },
        ],
      },
    ],
  },
  Other: {
    platform: "Other",
    usageUnit: "AI usage units",
    resetWindows: RESET_WINDOWS,
    defaultResetWindow: "5 hours",
    limitBasis: "Generic internal preset; provider-specific reliability is unavailable.",
    planPresets: [
      { label: "Standard", baseLimits: limits({ "5 hours": 100, Daily: 250, Weekly: 700, Monthly: 2800 }) },
    ],
    advancedGroups: [],
  },
};
