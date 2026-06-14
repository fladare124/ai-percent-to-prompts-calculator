import {
  defaultPlanByPlatform,
  PLATFORMS,
  platformPresets,
  RESET_WINDOWS,
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

function isPlatformName(value: unknown): value is PlatformName {
  return typeof value === "string" && PLATFORMS.includes(value as PlatformName);
}

function getDefaultAdvancedSelections(
  platform: PlatformName,
): Partial<Record<AdvancedOptionKey, string>> {
  if (platform === "Claude") {
    return {
      model: "claude-sonnet",
      mode: "Standard chat",
    };
  }

  return {};
}

export function createDefaultEstimatorForm(
  platform: PlatformName = DEFAULT_PLATFORM,
): EstimatorFormState {
  return {
    platform,
    plan: defaultPlanByPlatform[platform],
    remainingPercent: "65",
    resetWindow: "5 hours",
    hoursUntilReset: "5",
    minutesUntilReset: "0",
    usageIntensity: "Normal",
    advancedSelections: getDefaultAdvancedSelections(platform),
  };
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

  if (legacyMode) {
    return {
      ...advancedSelections,
      model: undefined,
      mode: advancedSelections.mode ?? legacyMode,
    };
  }

  return advancedSelections;
}

export function normalizeStoredEstimatorForm(
  storedFormJson: string | null,
  platformFocus?: PlatformName,
) {
  try {
    const parsed = storedFormJson ? JSON.parse(storedFormJson) : null;
    if (!isFormState(parsed)) return null;

    const targetPlatform =
      platformFocus ??
      (isPlatformName(parsed.platform) ? parsed.platform : DEFAULT_PLATFORM);
    const targetPreset = platformPresets[targetPlatform];
    const savedPlanStillExists = targetPreset.planPresets.some(
      (plan) => plan.label === parsed.plan,
    );
    const resetWindow = RESET_WINDOWS.includes(parsed.resetWindow)
      ? parsed.resetWindow
      : "5 hours";
    const advancedSelections =
      parsed.platform === targetPlatform ? { ...parsed.advancedSelections } : {};

    return {
      ...parsed,
      platform: targetPlatform,
      plan: savedPlanStillExists
        ? parsed.plan
        : defaultPlanByPlatform[targetPlatform],
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
  return PLATFORMS.find(
    (platform) => normalizePlatformParam(platform) === normalized,
  );
}

export function createEstimatorFormFromSearch(
  search: string,
  platformFocus?: PlatformName,
) {
  const platform = platformFocus ?? getPlatformFromSearch(search);
  return platform ? createDefaultEstimatorForm(platform) : null;
}
