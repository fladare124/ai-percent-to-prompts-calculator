import {
  platformPresets,
  usageIntensityMultipliers,
} from "@/lib/platformPresets";
import type {
  AdvancedOptionGroup,
  EstimateInput,
  EstimateResult,
  MultiplierOption,
  PlatformName,
  PlanPreset,
  ReliabilityLevel,
  ResetWindow,
  StatusLevel,
} from "@/types";

export const DISCLAIMER =
  "This tool is independent and does not connect to your provider account. Results are unofficial planning estimates, not live limits or guaranteed prompt counts. Actual usage varies by plan, model, context, features, task complexity and provider changes. API cost references are not subscription charges.";

const statusMessages: Record<StatusLevel, string> = {
  Comfortable: "You have plenty of estimated usage left.",
  Normal: "You still have reasonable margin, but avoid wasting usage.",
  Caution: "Consider saving usage for important tasks.",
  "High risk": "Avoid heavy tasks until reset.",
  Critical: "You are close to running out.",
};

const reliabilityOrder: ReliabilityLevel[] = [
  "Low",
  "Medium-low",
  "Medium",
  "Medium-high",
  "High",
];

const windowHours: Record<ResetWindow, number> = {
  "5 hours": 5,
  Daily: 24,
  Weekly: 168,
  Monthly: 720,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function shiftReliability(
  reliability: ReliabilityLevel,
  steps: number,
): ReliabilityLevel {
  const index = reliabilityOrder.indexOf(reliability);
  return reliabilityOrder[clamp(index + steps, 0, reliabilityOrder.length - 1)];
}

function getStatus(remainingPercent: number): StatusLevel {
  if (remainingPercent >= 70) return "Comfortable";
  if (remainingPercent >= 40) return "Normal";
  if (remainingPercent >= 20) return "Caution";
  if (remainingPercent >= 10) return "High risk";
  return "Critical";
}

function getUncertainty(input: EstimateInput) {
  if (
    input.platform === "Codex" &&
    input.advancedSelections.product === "ChatGPT chat"
  ) {
    if (input.plan === "Pro") return { low: 0.5, high: 1.8 };
    return input.resetWindow === "5 hours"
      ? { low: 0.7, high: 1.3 }
      : { low: 0.55, high: 1.55 };
  }

  if (input.platform === "ChatGPT") {
    if (input.plan === "Pro 100" || input.plan === "Pro 200") {
      return { low: 0.5, high: 1.8 };
    }
    return input.resetWindow === "5 hours"
      ? { low: 0.7, high: 1.3 }
      : { low: 0.55, high: 1.55 };
  }

  const map: Record<PlatformName, { low: number; high: number }> = {
    Codex: { low: 0.45, high: 1.55 },
    ChatGPT: { low: 0.55, high: 1.55 },
    Claude: { low: 0.6, high: 1.4 },
    Gemini: { low: 0.55, high: 1.45 },
    Perplexity: { low: 0.5, high: 1.6 },
    Cursor: { low: 0.75, high: 1.25 },
    "Windsurf / Devin": { low: 0.75, high: 1.3 },
    Other: { low: 0.5, high: 1.5 },
  };

  return map[input.platform];
}

function getReliability(input: EstimateInput, baseLimitFallback: boolean) {
  const base: Record<PlatformName, ReliabilityLevel> = {
    Codex: "Medium-low",
    ChatGPT: "Medium",
    Claude: "Medium-high",
    Gemini: "Medium-low",
    Perplexity: "Medium-low",
    Cursor: "Medium-high",
    "Windsurf / Devin": "Medium-high",
    Other: "Low",
  };
  let reliability = base[input.platform];

  if (
    input.platform === "Codex" &&
    input.advancedSelections.product === "ChatGPT chat"
  ) {
    reliability = input.resetWindow === "5 hours" ? "Medium" : "Medium-low";
  }

  if (
    input.platform === "ChatGPT" &&
    (input.plan === "Pro 100" || input.plan === "Pro 200")
  ) {
    reliability = "Medium-low";
  }

  if (input.advancedSelections.model?.includes("preview")) {
    reliability = shiftReliability(reliability, -1);
  }

  if (
    input.platform === "Windsurf / Devin" &&
    input.advancedSelections.mode === "Devin session"
  ) {
    reliability = "Low";
  }

  if (
    input.platform === "Codex" &&
    ["max", "ultra"].includes(input.advancedSelections.mode ?? "")
  ) {
    reliability = shiftReliability(reliability, -1);
  }

  if (baseLimitFallback) {
    reliability = shiftReliability(reliability, -1);
  }

  return reliability;
}

export function getOptionValue(option: MultiplierOption) {
  return option.value ?? option.label;
}

function getSelectedOption(group: AdvancedOptionGroup, value?: string) {
  if (!value) return undefined;
  return group.options.find(
    (option) => option.label === value || getOptionValue(option) === value,
  );
}

function getBaseLimit(planPreset?: PlanPreset, resetWindow?: ResetWindow) {
  if (!planPreset || !resetWindow) {
    return { baseLimit: undefined, baseLimitFallback: true };
  }

  const exactLimit = planPreset.baseLimits[resetWindow];
  if (exactLimit !== undefined) {
    return { baseLimit: exactLimit, baseLimitFallback: false };
  }

  const source = Object.entries(planPreset.baseLimits).find(
    (entry): entry is [ResetWindow, number] => entry[1] !== undefined,
  );
  if (!source) return { baseLimit: undefined, baseLimitFallback: true };

  const [sourceWindow, sourceLimit] = source;
  const scaledLimit =
    sourceLimit * (windowHours[resetWindow] / windowHours[sourceWindow]);
  return { baseLimit: scaledLimit, baseLimitFallback: true };
}

function getTypicalTokenProfile(intensity: EstimateInput["usageIntensity"]) {
  return {
    Light: { input: 2_000, output: 500 },
    Normal: { input: 8_000, output: 1_500 },
    Heavy: { input: 30_000, output: 5_000 },
    "Very heavy": { input: 100_000, output: 15_000 },
  }[intensity];
}

function getOpenAIModelMultiplier(
  product: string | undefined,
  model: MultiplierOption,
) {
  if (product === "ChatGPT chat") return model.multiplier;

  const codexRates: Record<string, number> = {
    "gpt-5.6-sol": 1,
    "gpt-5.6-sol-pro": 0.5,
    "gpt-5.6-terra": 2,
    "gpt-5.6-luna": 4.67,
    "gpt-5.5-codex": 0.25,
    "gpt-5.4": 1,
    "openai-auto": 0.8,
  };

  return codexRates[getOptionValue(model)] ?? model.multiplier;
}

function getApiCostEstimate(
  model: MultiplierOption | undefined,
  intensity: EstimateInput["usageIntensity"],
) {
  if (!model?.apiPricing) return undefined;
  const tokens = getTypicalTokenProfile(intensity);
  const mid =
    (tokens.input / 1_000_000) * model.apiPricing.inputPerMillion +
    (tokens.output / 1_000_000) * model.apiPricing.outputPerMillion;

  return {
    low: mid * 0.35,
    mid,
    high: mid * 2.5,
    modelLabel: model.label,
    pricingNote: model.apiPricing.note,
  };
}

export function estimateUsage(input: EstimateInput): EstimateResult {
  const preset = platformPresets[input.platform];
  const planPreset = preset.planPresets.find((plan) => plan.label === input.plan);
  const limitBasis =
    input.platform === "Codex" &&
    input.advancedSelections.product === "ChatGPT chat"
      ? "ChatGPT chat uses model-specific message limits. This normalized reference is not a live account cap; actual limits vary by plan, model, feature and capacity."
      : preset.limitBasis;
  const errors: string[] = [];

  if (!Number.isFinite(input.remainingPercent)) {
    errors.push("Remaining percentage must be a number between 0 and 100.");
  } else if (input.remainingPercent < 0 || input.remainingPercent > 100) {
    errors.push("Remaining percentage must be between 0 and 100.");
  }

  if (input.hoursUntilReset < 0 || input.minutesUntilReset < 0) {
    errors.push("Hours and minutes until reset must not be negative.");
  }

  if (!planPreset) {
    errors.push("No base limit preset was found for this platform and plan.");
  }

  if (
    input.platform === "Claude" &&
    ["claude-fable-5", "claude-fable-5-1"].includes(
      input.advancedSelections.model ?? "",
    )
  ) {
    errors.push(
      "A fixed message estimate does not apply to Claude Fable 5 or 5.1. On Pro and standard organization seats, Fable uses pay-as-you-go credits; on Max and eligible premium seats, it draws from the weekly allowance. Use the Claude usage pace planner with readings from your account.",
    );
  }

  if (input.platform === "Cursor") {
    errors.push(
      "Cursor tracks separate monthly pools, and request cost depends on the model and routed task. Use the Cursor pool planner to compare your recent usage readings.",
    );
  }

  const safeRemainingPercent = Number.isFinite(input.remainingPercent)
    ? clamp(input.remainingPercent, 0, 100)
    : 0;
  const status = getStatus(safeRemainingPercent);
  const { baseLimit, baseLimitFallback } = getBaseLimit(
    planPreset,
    input.resetWindow,
  );
  const uncertainty = getUncertainty(input);
  const reliability = getReliability(input, baseLimitFallback);
  const usedPercent = 100 - safeRemainingPercent;

  if (errors.length > 0 || baseLimit === undefined) {
    return {
      isValid: false,
      errors,
      platform: input.platform,
      plan: input.plan,
      resetWindow: input.resetWindow,
      usageIntensity: input.usageIntensity,
      usageUnit: preset.usageUnit,
      limitBasis,
      remainingPercent: safeRemainingPercent,
      usedPercent,
      baseLimit,
      baseLimitFallback,
      estimatedLow: 0,
      estimatedMid: 0,
      estimatedHigh: 0,
      status,
      statusMessage: statusMessages[status],
      reliability,
      uncertainty,
      factors: [],
      notes: getNotes(input, baseLimitFallback, []),
    };
  }

  const factors = [`${input.platform}`, `${input.plan} plan`, input.resetWindow];
  const selectedOptions: MultiplierOption[] = [];
  let multiplier = usageIntensityMultipliers[input.usageIntensity] ?? 1;

  if (input.usageIntensity !== "Normal") {
    factors.push(`${input.usageIntensity} task complexity`);
  }

  for (const group of preset.advancedGroups) {
    const selected = getSelectedOption(group, input.advancedSelections[group.key]);
    if (!selected) continue;
    selectedOptions.push(selected);

    if (input.platform === "Codex" && group.key === "model") {
      multiplier *= getOpenAIModelMultiplier(
        input.advancedSelections.product,
        selected,
      );
    } else {
      multiplier *= selected.multiplier;
    }

    factors.push(`${selected.label} ${group.label.toLowerCase()}`);
  }

  const estimatedMid =
    safeRemainingPercent === 0
      ? 0
      : baseLimit * (safeRemainingPercent / 100) * multiplier;
  const estimatedLow = estimatedMid * uncertainty.low;
  const estimatedHigh = estimatedMid * uncertainty.high;
  const hoursRemaining =
    Number(input.hoursUntilReset || 0) + Number(input.minutesUntilReset || 0) / 60;
  const safeRate =
    hoursRemaining > 0
      ? {
          low: estimatedLow / hoursRemaining,
          mid: estimatedMid / hoursRemaining,
          high: estimatedHigh / hoursRemaining,
          hoursRemaining,
        }
      : undefined;
  const selectedModel = selectedOptions.find((option) => option.apiPricing);
  const costReference = selectedOptions.find((option) => option.costReference)
    ?.costReference;

  return {
    isValid: true,
    errors: [],
    platform: input.platform,
    plan: input.plan,
    resetWindow: input.resetWindow,
    usageIntensity: input.usageIntensity,
    usageUnit: preset.usageUnit,
    limitBasis,
    remainingPercent: safeRemainingPercent,
    usedPercent,
    baseLimit,
    baseLimitFallback,
    estimatedLow,
    estimatedMid,
    estimatedHigh,
    safeRate,
    status,
    statusMessage: statusMessages[status],
    reliability,
    uncertainty,
    factors,
    notes: getNotes(input, baseLimitFallback, selectedOptions),
    apiCostEstimate: getApiCostEstimate(selectedModel, input.usageIntensity),
    costReference,
  };
}

function getNotes(
  input: EstimateInput,
  baseLimitFallback: boolean,
  selectedOptions: MultiplierOption[],
) {
  const notes: string[] = [];

  if (
    input.platform === "ChatGPT" &&
    input.plan === "Plus" &&
    input.resetWindow === "5 hours"
  ) {
    notes.push(
      "ChatGPT Plus is shown against a normalized 5-hour reference; real message windows can be shorter or vary by model and feature.",
    );
  }

  if (input.platform === "Codex") {
    if (input.advancedSelections.product === "ChatGPT chat") {
      if (input.plan === "Plus" && input.resetWindow === "5 hours") {
        notes.push(
          "ChatGPT message access can use separate dynamic allowances for reasoning, tools and agent features, so this is a planning estimate rather than a cap.",
        );
      }
    } else {
      notes.push(
        "Codex, ChatGPT Work and workspace agents draw from the same agentic usage and credit pool when available on your plan.",
      );
      notes.push(
        "Agentic usage is token-based. Task counts are normalized equivalents, not a fixed message cap.",
      );
      if (input.advancedSelections.mode === "max") {
        notes.push(
          "Max execution gives the agent more reasoning room, so the estimate is lower than standard execution.",
        );
      }
      if (input.advancedSelections.mode === "ultra") {
        notes.push(
          "Ultra is treated as a multi-agent or long-horizon mode; real consumption can vary widely by task.",
        );
      }
    }
  }

  if (input.platform === "Gemini") {
    notes.push(
      "Gemini app limits are compute-based; prompts can consume different amounts depending on model, feature, context and complexity.",
    );
  }

  if (input.platform === "Cursor") {
    notes.push(
      "Cursor tracks separate monthly usage pools, and consumption varies by model and task. Use the pool planner with readings from your account.",
    );
  }

  if (input.platform === "Windsurf / Devin") {
    notes.push(
      "Windsurf prompt credits are more predictable than Devin agent sessions, which use complexity-based quota.",
    );
  }

  for (const option of selectedOptions) {
    if (option.availabilityNote && !notes.includes(option.availabilityNote)) {
      notes.push(option.availabilityNote);
    }
  }

  if (baseLimitFallback) {
    notes.push(
      "No published preset exists for this exact window. The nearest known limit was time-scaled, so reliability was lowered.",
    );
  }

  return notes;
}

export function roundUsage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}
