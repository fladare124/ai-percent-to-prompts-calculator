export type PlatformName =
  | "Codex"
  | "ChatGPT"
  | "Claude"
  | "Gemini"
  | "Perplexity"
  | "Cursor"
  | "Windsurf / Devin"
  | "Other";

export type UsageIntensity = "Light" | "Normal" | "Heavy" | "Very heavy";

export type ResetWindow =
  | "3 hours"
  | "5 hours"
  | "Daily"
  | "Weekly"
  | "Monthly";

export type AdvancedOptionKey =
  | "model"
  | "mode"
  | "reasoning"
  | "speed"
  | "workType"
  | "context"
  | "environment"
  | "feature"
  | "apiModel";

export type StatusLevel =
  | "Comfortable"
  | "Normal"
  | "Caution"
  | "High risk"
  | "Critical";

export type ReliabilityLevel =
  | "High"
  | "Medium-high"
  | "Medium"
  | "Medium-low"
  | "Low";

export interface MultiplierOption {
  label: string;
  value?: string;
  multiplier: number;
  apiPricing?: {
    inputPerMillion: number;
    outputPerMillion: number;
    note?: string;
  };
  costReference?: string;
  availabilityNote?: string;
}

export interface AdvancedOptionGroup {
  key: AdvancedOptionKey;
  label: string;
  options: MultiplierOption[];
}

export interface PlanPreset {
  label: string;
  baseLimits: Partial<Record<ResetWindow, number>>;
}

export interface PlatformPreset {
  platform: PlatformName;
  usageUnit: string;
  resetWindows: ResetWindow[];
  defaultResetWindow: ResetWindow;
  limitBasis: string;
  planPresets: PlanPreset[];
  advancedGroups: AdvancedOptionGroup[];
}

export interface EstimateInput {
  platform: PlatformName;
  plan: string;
  remainingPercent: number;
  resetWindow: ResetWindow;
  hoursUntilReset: number;
  minutesUntilReset: number;
  usageIntensity: UsageIntensity;
  advancedSelections: Partial<Record<AdvancedOptionKey, string>>;
}

export interface SafeRateEstimate {
  low: number;
  mid: number;
  high: number;
  hoursRemaining: number;
}

export interface EstimateResult {
  isValid: boolean;
  errors: string[];
  platform: PlatformName;
  plan: string;
  resetWindow: ResetWindow;
  usageIntensity: UsageIntensity;
  usageUnit: string;
  limitBasis: string;
  remainingPercent: number;
  usedPercent: number;
  baseLimit?: number;
  baseLimitFallback: boolean;
  estimatedLow: number;
  estimatedMid: number;
  estimatedHigh: number;
  safeRate?: SafeRateEstimate;
  status: StatusLevel;
  statusMessage: string;
  reliability: ReliabilityLevel;
  uncertainty: {
    low: number;
    high: number;
  };
  factors: string[];
  notes: string[];
  apiCostEstimate?: {
    low: number;
    mid: number;
    high: number;
    modelLabel: string;
    pricingNote?: string;
  };
  costReference?: string;
}
