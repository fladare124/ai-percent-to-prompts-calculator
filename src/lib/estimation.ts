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
  "This tool is not affiliated with OpenAI, Anthropic, Google, Perplexity, Cursor, Windsurf or Devin. Results are unofficial estimates based on the remaining percentage and options you enter. Real limits can vary by plan, model, feature, system capacity, context length, files, task complexity and provider changes.";

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

const claudeFable5Multipliers = {
  Light: 0.26,
  Normal: 0.3,
  Heavy: 0.38,
  "Very heavy": 0.5,
} satisfies Record<EstimateInput["usageIntensity"], number>;

export function getClaudeFable5Multiplier(
  taskComplexity: EstimateInput["usageIntensity"],
) {
  return claudeFable5Multipliers[taskComplexity];
}

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
  if (input.platform === "ChatGPT") {
    if (input.plan === "Pro 100" || input.plan === "Pro 200") {
      return { low: 0.5, high: 1.8 };
    }

    return { low: 0.8, high: 1.2 };
  }

  const map: Record<PlatformName, { low: number; high: number }> = {
    Codex: { low: 0.55, high: 1.45 },
    ChatGPT: { low: 0.8, high: 1.2 },
    Claude: { low: 0.6, high: 1.4 },
    Gemini: { low: 0.7, high: 1.3 },
    Perplexity: { low: 0.55, high: 1.45 },
    Cursor: { low: 0.65, high: 1.35 },
    "Windsurf / Devin": { low: 0.65, high: 1.35 },
    Other: { low: 0.5, high: 1.5 },
  };

  return map[input.platform];
}

function getReliability(input: EstimateInput, baseLimitFallback: boolean) {
  let reliability: ReliabilityLevel;

  if (
    input.platform === "ChatGPT" &&
    (input.plan === "Pro 100" || input.plan === "Pro 200")
  ) {
    reliability = "Medium-low";
  } else {
    const base: Record<PlatformName, ReliabilityLevel> = {
      Codex: "Medium-low",
      ChatGPT: "Medium",
      Claude: "Medium",
      Gemini: "Medium-high",
      Perplexity: "Medium",
      Cursor: "Medium",
      "Windsurf / Devin": "Medium",
      Other: "Low",
    };

    reliability = base[input.platform];
  }

  if (input.platform === "Codex") {
    const maxCodexIndex = reliabilityOrder.indexOf("Medium");
    const currentIndex = reliabilityOrder.indexOf(reliability);
    reliability = reliabilityOrder[Math.min(currentIndex, maxCodexIndex)];
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

function getFallbackWindow(resetWindow: ResetWindow): ResetWindow {
  if (resetWindow === "Weekly") return "Daily";
  if (resetWindow === "Monthly") return "Weekly";
  return "5 hours";
}

function getBaseLimit(planPreset?: PlanPreset, resetWindow?: ResetWindow) {
  if (!planPreset || !resetWindow) {
    return { baseLimit: undefined, baseLimitFallback: true };
  }

  const exactLimit = planPreset.baseLimits[resetWindow];
  if (exactLimit !== undefined) {
    return { baseLimit: exactLimit, baseLimitFallback: false };
  }

  const fallbackLimit =
    planPreset.baseLimits[getFallbackWindow(resetWindow)] ??
    planPreset.baseLimits["5 hours"] ??
    Object.values(planPreset.baseLimits).find((value) => value !== undefined);

  return { baseLimit: fallbackLimit, baseLimitFallback: true };
}

export function estimateUsage(input: EstimateInput): EstimateResult {
  const preset = platformPresets[input.platform];
  const planPreset = preset.planPresets.find((plan) => plan.label === input.plan);
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
      notes: getNotes(input, baseLimitFallback),
    };
  }

  const factors = [`${input.platform}`, `${input.plan} plan`, input.resetWindow];
  let multiplier = usageIntensityMultipliers[input.usageIntensity] ?? 1;

  if (input.usageIntensity !== "Normal") {
    factors.push(`${input.usageIntensity} task complexity`);
  }

  for (const group of preset.advancedGroups) {
    const selected = getSelectedOption(group, input.advancedSelections[group.key]);
    if (!selected) continue;

    if (
      input.platform === "Claude" &&
      group.key === "model" &&
      getOptionValue(selected) === "claude-fable-5"
    ) {
      // Claude Fable 5 has higher per-token cost than Opus/Sonnet/Haiku,
      // but may be more efficient on long-horizon coding and agentic tasks.
      // We use a dynamic model multiplier, then still apply task complexity above.
      multiplier *= getClaudeFable5Multiplier(input.usageIntensity);
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

  return {
    isValid: true,
    errors: [],
    platform: input.platform,
    plan: input.plan,
    resetWindow: input.resetWindow,
    usageIntensity: input.usageIntensity,
    usageUnit: preset.usageUnit,
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
    notes: getNotes(input, baseLimitFallback),
  };
}

function getNotes(input: EstimateInput, baseLimitFallback: boolean) {
  const notes: string[] = [];

  if (
    input.platform === "ChatGPT" &&
    input.plan === "Plus" &&
    input.resetWindow === "5 hours"
  ) {
    notes.push(
      "For ChatGPT Plus, 160 is treated as a rough short-window reference when applicable, not a guaranteed limit for every model or feature.",
    );
  }

  if (input.platform === "ChatGPT" && input.resetWindow !== "5 hours") {
    notes.push(
      "Some ChatGPT limits may use different reset windows depending on model and plan.",
    );
  }

  if (
    input.platform === "ChatGPT" &&
    (input.plan === "Pro 100" || input.plan === "Pro 200")
  ) {
    notes.push(
      "ChatGPT Pro-style usage is especially variable, so this estimate uses a wider uncertainty range.",
    );
  }

  if (baseLimitFallback) {
    notes.push(
      "This plan does not have a specific preset for the selected reset window, so a nearby preset was used and reliability was lowered.",
    );
  }

  return notes;
}

export function roundUsage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}
