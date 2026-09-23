import type {
  PlatformName,
  PlatformPreset,
  ResetWindow,
  UsageIntensity,
} from "@/types";

export const PLATFORMS: PlatformName[] = [
  "Codex",
  "Claude",
  "Gemini",
  "Perplexity",
  "Cursor",
  "Windsurf / Devin",
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

function limits(values: Partial<Record<ResetWindow, number>>) {
  return values;
}

export const platformPresets: Record<PlatformName, PlatformPreset> = {
  Codex: {
    platform: "Codex",
    usageUnit: "ChatGPT messages / Codex tasks",
    resetWindows: ["5 hours", "Daily", "Weekly", "Monthly"],
    defaultResetWindow: "5 hours",
    limitBasis:
      "Codex usage is account-specific and depends on the model, task, context, reasoning and tools. Use the current account meter and recent readings instead of a fixed task allowance.",
    planPresets: [
      { label: "Free", baseLimits: limits({}) },
      { label: "Go", baseLimits: limits({}) },
      { label: "Plus", baseLimits: limits({}) },
      { label: "Pro", baseLimits: limits({}) },
      { label: "Business", baseLimits: limits({}) },
      { label: "Enterprise / Edu", baseLimits: limits({}) },
    ],
    advancedGroups: [
      {
        key: "product",
        label: "OpenAI product",
        options: [
          { label: "ChatGPT chat", multiplier: 1 },
          { label: "Codex", multiplier: 1 },
          { label: "Work / workspace agents", multiplier: 0.75 },
        ],
      },
      {
        key: "model",
        label: "OpenAI model",
        options: [
          {
            label: "GPT-5.6 Sol",
            value: "gpt-5.6-sol",
            multiplier: 0.55,
            apiPricing: { inputPerMillion: 4, outputPerMillion: 20 },
            availabilityNote: "GPT-5.6 access depends on your plan and account.",
          },
          {
            label: "GPT-5.6 Sol Pro",
            value: "gpt-5.6-sol-pro",
            multiplier: 0.25,
            availabilityNote: "Sol Pro is available only on eligible plans and products.",
          },
          {
            label: "GPT-5.6 Terra",
            value: "gpt-5.6-terra",
            multiplier: 0.8,
            apiPricing: { inputPerMillion: 2, outputPerMillion: 12 },
          },
          {
            label: "GPT-5.6 Luna",
            value: "gpt-5.6-luna",
            multiplier: 1.25,
            apiPricing: { inputPerMillion: 0.2, outputPerMillion: 1.2 },
          },
          {
            label: "GPT-5.5 Instant",
            value: "gpt-5.5-instant",
            multiplier: 1,
            apiPricing: { inputPerMillion: 5, outputPerMillion: 30 },
          },
          {
            label: "GPT-5.5 (Codex)",
            value: "gpt-5.5-codex",
            multiplier: 0.25,
            apiPricing: { inputPerMillion: 5, outputPerMillion: 30 },
            costReference: "A legacy-rate Codex local task averaged about 56 credits with GPT-5.5.",
          },
          {
            label: "GPT-5.4",
            value: "gpt-5.4",
            multiplier: 1,
            apiPricing: { inputPerMillion: 2.5, outputPerMillion: 15 },
          },
          { label: "Auto / Not sure", value: "openai-auto", multiplier: 0.8 },
        ],
      },
      {
        key: "reasoning",
        label: "Thinking / reasoning",
        options: [
          { label: "None / Instant", multiplier: 1 },
          { label: "Medium", multiplier: 1 },
          { label: "High", multiplier: 0.75 },
          { label: "Extra High", multiplier: 0.6 },
          {
            label: "Max",
            multiplier: 0.45,
            availabilityNote:
              "Max is a higher reasoning effort for demanding Codex or Work tasks, not a fixed message allowance.",
          },
          { label: "Pro", multiplier: 0.25 },
        ],
      },
      {
        key: "mode",
        label: "Agent execution",
        options: [
          { label: "Standard", value: "standard", multiplier: 1 },
          {
            label: "Max",
            value: "max",
            multiplier: 0.8,
            availabilityNote:
              "Max execution gives the agent more room for difficult work and can consume more of the shared pool.",
          },
          {
            label: "Ultra",
            value: "ultra",
            multiplier: 0.55,
            availabilityNote:
              "Ultra can orchestrate multiple agents for larger tasks, so it is the most conservative estimate.",
          },
        ],
      },
      {
        key: "feature",
        label: "Tool / feature",
        options: [
          { label: "Simple chat", multiplier: 1 },
          { label: "Web search", multiplier: 0.85 },
          { label: "Data or file analysis", multiplier: 0.62 },
          { label: "Image analysis", multiplier: 0.7 },
          { label: "Image generation", multiplier: 0.4 },
          { label: "Deep research", multiplier: 0.25 },
          { label: "Agent mode", multiplier: 0.3 },
          { label: "Coding task", multiplier: 1 },
          { label: "Repo-wide coding task", multiplier: 0.4 },
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
    resetWindows: ["5 hours", "Daily", "Weekly", "Monthly"],
    defaultResetWindow: "5 hours",
    limitBasis:
      "ChatGPT message caps are dynamic. These normalized windows are planning references, not guaranteed limits for every model or feature.",
    planPresets: [
      { label: "Free", baseLimits: limits({ "5 hours": 10 }) },
      { label: "Plus", baseLimits: limits({ "5 hours": 100, Daily: 250, Weekly: 700, Monthly: 2800 }) },
      { label: "Pro 100", baseLimits: limits({ "5 hours": 500, Daily: 1250, Weekly: 3500, Monthly: 14000 }) },
      { label: "Pro 200", baseLimits: limits({ "5 hours": 2000, Daily: 5000, Weekly: 14000, Monthly: 56000 }) },
      { label: "Business", baseLimits: limits({ "5 hours": 300, Daily: 750, Weekly: 2100, Monthly: 8400 }) },
      { label: "Enterprise / Edu", baseLimits: limits({ "5 hours": 300, Daily: 750, Weekly: 2100, Monthly: 8400 }) },
    ],
    advancedGroups: [
      {
        key: "model",
        label: "Model / mode",
        options: [
          {
            label: "GPT-5.6 Sol (preview)",
            multiplier: 0.55,
            apiPricing: { inputPerMillion: 4, outputPerMillion: 20 },
            availabilityNote: "Model access and message limits depend on your plan.",
          },
          {
            label: "GPT-5.6 Terra (preview)",
            multiplier: 0.8,
            apiPricing: { inputPerMillion: 2, outputPerMillion: 12 },
            availabilityNote: "Model access and message limits depend on your plan.",
          },
          {
            label: "GPT-5.6 Luna (preview)",
            multiplier: 1.25,
            apiPricing: { inputPerMillion: 0.2, outputPerMillion: 1.2 },
            availabilityNote: "Model access and message limits depend on your plan.",
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
            label: "Claude Fable 5",
            value: "claude-fable-5",
            multiplier: 1,
            availabilityNote:
              "Fable 5 uses plan limits only on Max and eligible premium organization seats. On Pro and standard seats, it uses pay-as-you-go usage credits.",
          },
          {
            label: "Claude Fable 5.1",
            value: "claude-fable-5-1",
            multiplier: 1,
            availabilityNote:
              "Fable 5.1 uses plan limits only on Max and eligible premium organization seats. On Pro and standard seats, it uses pay-as-you-go usage credits.",
          },
          {
            label: "Claude Sonnet 5",
            value: "claude-sonnet-5",
            multiplier: 1,
            apiPricing: {
              inputPerMillion: 2,
              outputPerMillion: 10,
              note: "Anthropic API pricing is separate from Claude subscription usage.",
            },
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
    usageUnit: "Gemini usage units",
    resetWindows: ["5 hours", "Weekly"],
    defaultResetWindow: "5 hours",
    limitBasis:
      "Gemini Apps limits are compute-based and change with the model, prompt, feature, chat length and account capacity. Use the current Usage Limits reading and reset time.",
    planPresets: [
      { label: "No AI plan", baseLimits: limits({}) },
      { label: "AI Plus", baseLimits: limits({}) },
      { label: "AI Pro", baseLimits: limits({}) },
      { label: "AI Ultra", baseLimits: limits({}) },
      { label: "Workspace / school account", baseLimits: limits({}) },
    ],
    advancedGroups: [],
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
          { label: "Computer / agent", multiplier: 0.2 },
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
    usageUnit: "usage pool balance",
    resetWindows: ["Monthly"],
    defaultResetWindow: "Monthly",
    limitBasis:
      "Cursor shows separate monthly usage pools. Compare readings from your own account in the pool planner; this selector does not assume a fixed request count.",
    planPresets: [
      { label: "Hobby", baseLimits: limits({}) },
      { label: "Start (India)", baseLimits: limits({}) },
      { label: "Pro", baseLimits: limits({}) },
      { label: "Pro+", baseLimits: limits({}) },
      { label: "Ultra", baseLimits: limits({}) },
      { label: "Teams", baseLimits: limits({}) },
      { label: "Enterprise", baseLimits: limits({}) },
    ],
    advancedGroups: [],
  },
  "Windsurf / Devin": {
    platform: "Windsurf / Devin",
    usageUnit: "usage allowance units",
    resetWindows: ["Daily", "Weekly"],
    defaultResetWindow: "Daily",
    limitBasis:
      "Devin and Windsurf plans provide usage allowances that refresh daily and weekly. Consumption depends on the model, task size and reasoning; use the readings in your account.",
    planPresets: [
      { label: "Free", baseLimits: limits({}) },
      { label: "Pro", baseLimits: limits({}) },
      { label: "Max", baseLimits: limits({}) },
      { label: "Teams", baseLimits: limits({}) },
      { label: "Enterprise", baseLimits: limits({}) },
    ],
    advancedGroups: [],
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
