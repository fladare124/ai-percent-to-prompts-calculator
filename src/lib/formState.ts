import {
  defaultPlanByPlatform,
  PLATFORMS,
  platformPresets,
  RESET_WINDOWS,
  USAGE_INTENSITIES,
} from "@/lib/platformPresets";
import type {
  AdvancedOptionKey,
  PlatformName,
  ResetWindow,
  UsageIntensity,
} from "@/types";

export interface EstimatorFormState {
  platform: PlatformName;
  plan: string;
  remainingPercent: string;
  resetWindow: ResetWindow;
  hoursUntilReset: string;
  minutesUntilReset: string;
  usageIntensity: UsageIntensity;
  advancedSelections: Partial<Record<AdvancedOptionKey, string>>;
}

export const DEFAULT_PLATFORM: PlatformName = "Codex";
export const DEFAULT_REMAINING_PERCENT = "65";

function isPlatformName(value: unknown): value is PlatformName {
  return typeof value === "string" && PLATFORMS.includes(value as PlatformName);
}

function getDefaultAdvancedSelections(
  platform: PlatformName,
): Partial<Record<AdvancedOptionKey, string>> {
  if (platform === "Claude") {
    return {
      model: "claude-sonnet-5",
      mode: "Standard chat",
    };
  }

  if (platform === "ChatGPT") {
    return { model: "GPT-5.5 Instant", reasoning: "None / Instant" };
  }

  if (platform === "Codex") {
    return {
      product: "ChatGPT chat",
      model: "gpt-5.6-sol",
      reasoning: "Medium",
      mode: "standard",
      feature: "Simple chat",
    };
  }

  return {};
}

export function createDefaultEstimatorForm(
  platform: PlatformName = DEFAULT_PLATFORM,
): EstimatorFormState {
  const preset = platformPresets[platform];
  const defaultHours: Record<ResetWindow, string> = {
    "5 hours": "5",
    Daily: "24",
    Weekly: "168",
    Monthly: "720",
  };

  return {
    platform,
    plan: defaultPlanByPlatform[platform],
    remainingPercent: DEFAULT_REMAINING_PERCENT,
    resetWindow: preset.defaultResetWindow,
    hoursUntilReset: defaultHours[preset.defaultResetWindow],
    minutesUntilReset: "0",
    usageIntensity: "Normal",
    advancedSelections: getDefaultAdvancedSelections(platform),
  };
}

function normalizeRemainingPercent(value: unknown) {
  const text = String(value ?? "").trim();
  const numericValue = Number(text);

  if (
    text === "" ||
    !Number.isFinite(numericValue) ||
    numericValue < 0 ||
    numericValue > 100
  ) {
    return DEFAULT_REMAINING_PERCENT;
  }

  return text;
}

export function isFormState(value: unknown): value is EstimatorFormState {
  if (!value || typeof value !== "object") return false;
  const form = value as Partial<EstimatorFormState>;
  return Boolean(
    form.platform &&
      form.plan &&
      form.remainingPercent !== undefined &&
      form.resetWindow &&
      form.usageIntensity,
  );
}

function normalizeLegacySelections(
  platform: PlatformName,
  advancedSelections: Partial<Record<AdvancedOptionKey, string>>,
) {
  if (platform === "Codex") {
    const modelMigrations: Record<string, string> = {
      "GPT-5.6 Sol (preview)": "gpt-5.6-sol",
      "GPT-5.6 Sol": "gpt-5.6-sol",
      "GPT-5.6 Terra (preview)": "gpt-5.6-terra",
      "GPT-5.6 Luna (preview)": "gpt-5.6-luna",
      "GPT-5.5 Instant": "gpt-5.5-instant",
      "GPT-5.5": "gpt-5.5-codex",
      "GPT-5.4": "gpt-5.4",
    };
    return {
      ...advancedSelections,
      model: advancedSelections.model
        ? modelMigrations[advancedSelections.model] ?? advancedSelections.model
        : "gpt-5.6-sol",
      product: advancedSelections.product ?? "ChatGPT chat",
      mode: advancedSelections.mode ?? "standard",
      reasoning:
        advancedSelections.reasoning === "Standard"
          ? "Medium"
          : advancedSelections.reasoning ?? "Medium",
    };
  }

  if (platform === "ChatGPT") {
    return {
      ...advancedSelections,
      reasoning:
        advancedSelections.reasoning === "Standard"
          ? "Medium"
          : advancedSelections.reasoning,
    };
  }

  if (platform !== "Claude") return advancedSelections;

  const legacyModeByModel: Record<string, string> = {
    "Claude chat": "Standard chat",
    "Claude Code": "Claude Code",
    "Long context": "Long context",
    Files: "Files",
    "Research / analysis": "Research / analysis",
  };
  const legacyMode = advancedSelections.model
    ? legacyModeByModel[advancedSelections.model]
    : undefined;

  const normalized = legacyMode
    ? {
      ...advancedSelections,
      model: undefined,
      mode: advancedSelections.mode ?? legacyMode,
    }
    : { ...advancedSelections };

  const modelMigrations: Record<string, string> = {
    "Claude Fable 5": "claude-fable-5",
    "Claude Fable 5.1": "claude-fable-5-1",
    "claude-sonnet": "claude-sonnet-5",
    "Claude Sonnet": "claude-sonnet-5",
    "claude-opus": "claude-opus-4-8",
    "Claude Opus": "claude-opus-4-8",
    "claude-haiku": "claude-haiku-4-5",
    "Claude Haiku": "claude-haiku-4-5",
  };

  if (normalized.model && modelMigrations[normalized.model]) {
    normalized.model = modelMigrations[normalized.model];
  }

  return normalized;
}

export function normalizeStoredEstimatorForm(
  storedFormJson: string | null,
  platformFocus?: PlatformName,
) {
  try {
    const parsed = storedFormJson ? JSON.parse(storedFormJson) : null;
    if (!isFormState(parsed)) return null;

    const isLegacyOpenAI =
      parsed.platform === "Codex" || parsed.platform === "ChatGPT";
    const targetPlatform =
      platformFocus ??
      (isLegacyOpenAI
        ? "Codex"
        : isPlatformName(parsed.platform)
          ? parsed.platform
          : DEFAULT_PLATFORM);
    const targetPreset = platformPresets[targetPlatform];
    const migratedPlan =
      targetPlatform === "Codex" &&
      (parsed.plan === "Pro 100" || parsed.plan === "Pro 200")
        ? "Pro"
        : parsed.plan;
    const savedPlanStillExists = targetPreset.planPresets.some(
      (plan) => plan.label === migratedPlan,
    );
    const resetWindow = targetPreset.resetWindows.includes(parsed.resetWindow)
      ? parsed.resetWindow
      : targetPreset.defaultResetWindow;
    const advancedSelections =
      parsed.platform === targetPlatform ||
      (targetPlatform === "Codex" && isLegacyOpenAI)
        ? {
            ...parsed.advancedSelections,
            product:
              parsed.platform === "ChatGPT"
                ? "ChatGPT chat"
                : parsed.advancedSelections.product ?? "Codex",
          }
        : {};

    return {
      ...parsed,
      platform: targetPlatform,
      plan: savedPlanStillExists
        ? migratedPlan
        : defaultPlanByPlatform[targetPlatform],
      remainingPercent: normalizeRemainingPercent(parsed.remainingPercent),
      resetWindow,
      advancedSelections: normalizeLegacySelections(
        targetPlatform,
        advancedSelections,
      ),
    };
  } catch {
    return null;
  }
}

function normalizePlatformParam(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/%20/g, " ")
    .replace(/[+/_-]+/g, " ");
}

export function getPlatformFromSearch(search: string): PlatformName | undefined {
  const params = new URLSearchParams(search);
  const rawPlatform = params.get("platform") ?? params.get("tool");
  if (!rawPlatform) return undefined;

  const normalized = normalizePlatformParam(rawPlatform);
  if (normalized === "chatgpt" || normalized === "codex") return "Codex";
  return PLATFORMS.find(
    (platform) => normalizePlatformParam(platform) === normalized,
  );
}

export function createEstimatorFormFromSearch(
  search: string,
  platformFocus?: PlatformName,
) {
  const params = new URLSearchParams(search);
  const hasEstimatorParams = [
    "ptp",
    "platform",
    "tool",
    "plan",
    "remaining",
    "remainingPercent",
    "window",
    "reset",
    "hours",
    "minutes",
    "intensity",
    "product",
    "model",
    "mode",
    "reasoning",
    "speed",
    "workType",
    "context",
    "environment",
    "feature",
    "apiModel",
  ].some((key) => params.has(key));
  if (!hasEstimatorParams) return null;

  const platform = platformFocus ?? getPlatformFromSearch(search);
  if (!platform) return null;
  const form = createDefaultEstimatorForm(platform);
  const requested = normalizePlatformParam(
    params.get("platform") ?? params.get("tool") ?? "",
  );

  if (params.get("ptp") !== "1" && platform === "Codex" && requested === "codex") {
    return {
      ...form,
      resetWindow: "5 hours" as ResetWindow,
      hoursUntilReset: "5",
      advancedSelections: {
        ...form.advancedSelections,
        product: "Codex",
        feature: "Coding task",
      },
    };
  }

  const preset = platformPresets[platform];
  const requestedPlan = params.get("plan");
  const requestedWindow = params.get("window") ?? params.get("reset");
  const requestedIntensity = params.get("intensity");
  const requestedHours = params.get("hours");
  const requestedMinutes = params.get("minutes");
  const hours = Number(requestedHours);
  const minutes = Number(requestedMinutes);
  const advancedSelections = { ...form.advancedSelections };

  for (const group of preset.advancedGroups) {
    const requestedValue = params.get(group.key);
    if (!requestedValue) continue;

    const option = group.options.find(
      (candidate) =>
        (candidate.value ?? candidate.label) === requestedValue ||
        candidate.label === requestedValue,
    );
    if (option) advancedSelections[group.key] = option.value ?? option.label;
  }

  return {
    ...form,
    plan: preset.planPresets.some((plan) => plan.label === requestedPlan)
      ? requestedPlan!
      : form.plan,
    remainingPercent:
      params.has("remaining") || params.has("remainingPercent")
        ? normalizeRemainingPercent(
            params.get("remaining") ?? params.get("remainingPercent"),
          )
        : form.remainingPercent,
    resetWindow:
      RESET_WINDOWS.includes(requestedWindow as ResetWindow) &&
      preset.resetWindows.includes(requestedWindow as ResetWindow)
        ? (requestedWindow as ResetWindow)
        : form.resetWindow,
    hoursUntilReset:
      requestedHours !== null &&
      Number.isFinite(hours) &&
      hours >= 0 &&
      hours <= 8760
        ? String(hours)
        : form.hoursUntilReset,
    minutesUntilReset:
      requestedMinutes !== null &&
      Number.isFinite(minutes) &&
      minutes >= 0 &&
      minutes <= 59
        ? String(minutes)
        : form.minutesUntilReset,
    usageIntensity: USAGE_INTENSITIES.includes(
      requestedIntensity as UsageIntensity,
    )
      ? (requestedIntensity as UsageIntensity)
      : form.usageIntensity,
    advancedSelections,
  };
}

export function createEstimatorShareUrl(
  form: EstimatorFormState,
  currentUrl: string,
) {
  const url = new URL(currentUrl);
  const params = new URLSearchParams();
  params.set("ptp", "1");
  params.set("platform", form.platform);
  params.set("plan", form.plan);
  params.set("remaining", form.remainingPercent);
  params.set("window", form.resetWindow);
  params.set("hours", form.hoursUntilReset);
  params.set("minutes", form.minutesUntilReset);
  params.set("intensity", form.usageIntensity);

  for (const [key, value] of Object.entries(form.advancedSelections)) {
    if (value) params.set(key, value);
  }

  url.search = params.toString();
  url.hash = "";
  return url.toString();
}
