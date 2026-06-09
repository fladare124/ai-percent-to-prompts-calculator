"use client";

import AdvancedOptions from "@/components/AdvancedOptions";
import {
  PLATFORMS,
  RESET_WINDOWS,
  USAGE_INTENSITIES,
  platformPresets,
} from "@/lib/platformPresets";
import {
  createDefaultEstimatorForm,
  type EstimatorFormState,
} from "@/lib/formState";
import type {
  AdvancedOptionGroup,
  AdvancedOptionKey,
  MultiplierOption,
  PlatformName,
  PlatformPreset,
  ResetWindow,
  UsageIntensity,
} from "@/types";

interface EstimatorFormProps {
  form: EstimatorFormState;
  preset: PlatformPreset;
  advancedOpen: boolean;
  inlineErrors: string[];
  onChange: (next: EstimatorFormState) => void;
  onAdvancedToggle: () => void;
}

const inputClass =
  "h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

const labelClass = "text-sm font-medium text-zinc-800 dark:text-zinc-200";

export default function EstimatorForm({
  form,
  preset,
  advancedOpen,
  inlineErrors,
  onChange,
  onAdvancedToggle,
}: EstimatorFormProps) {
  const update = <K extends keyof EstimatorFormState>(
    key: K,
    value: EstimatorFormState[K],
  ) => {
    onChange({ ...form, [key]: value });
  };

  const handlePlatformChange = (platform: PlatformName) => {
    const platformDefaults = createDefaultEstimatorForm(platform);

    onChange({
      ...form,
      platform,
      plan: platformDefaults.plan,
      advancedSelections: platformDefaults.advancedSelections,
    });
  };

  const handleAdvancedChange = (key: AdvancedOptionKey, value: string) => {
    const nextSelections = {
      ...form.advancedSelections,
      [key]: value || undefined,
    };

    if (form.platform === "ChatGPT" && key === "model") {
      nextSelections.reasoning =
        value === "GPT-5.5 Thinking" ? "Standard" : "None / Instant";
    }

    onChange({
      ...form,
      advancedSelections: nextSelections,
    });
  };

  const criticalFields = getCriticalFields(form, preset);
  const hiddenAdvancedKeys = getHiddenAdvancedKeys(form, criticalFields);

  return (
    <form className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Platform</span>
          <select
            value={form.platform}
            onChange={(event) =>
              handlePlatformChange(event.target.value as PlatformName)
            }
            className={inputClass}
          >
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Plan</span>
          <select
            value={form.plan}
            onChange={(event) => update("plan", event.target.value)}
            className={inputClass}
          >
            {(platformPresets[form.platform] ?? preset).planPresets.map(
              (plan) => (
                <option key={plan.label} value={plan.label}>
                  {plan.label}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>
          Remaining percentage shown by the platform
        </span>
        <input
          value={form.remainingPercent}
          onChange={(event) => update("remainingPercent", event.target.value)}
          type="number"
          inputMode="decimal"
          min="0"
          max="100"
          className={inputClass}
          aria-describedby="remaining-help"
        />
        <span
          id="remaining-help"
          className="text-sm text-zinc-600 dark:text-zinc-400"
        >
          Enter the remaining percentage, not the percentage already used.
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Reset window</span>
          <select
            value={form.resetWindow}
            onChange={(event) =>
              update("resetWindow", event.target.value as ResetWindow)
            }
            className={inputClass}
          >
            {RESET_WINDOWS.map((window) => (
              <option key={window} value={window}>
                {window}
              </option>
            ))}
          </select>
          {form.platform === "Codex" ? (
            <span className="text-sm leading-5 text-zinc-600 dark:text-zinc-400">
              Choose the same window shown by Codex, usually 5 hours or weekly.
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>How demanding is your task?</span>
          <select
            value={form.usageIntensity}
            onChange={(event) =>
              update("usageIntensity", event.target.value as UsageIntensity)
            }
            className={inputClass}
          >
            {USAGE_INTENSITIES.map((intensity) => (
              <option key={intensity} value={intensity}>
                {intensity}
              </option>
            ))}
          </select>
          <span className="text-sm leading-5 text-zinc-600 dark:text-zinc-400">
            Choose based on what you ask the AI to do, not the model itself.
          </span>
        </label>
      </div>

      {criticalFields.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {criticalFields.map((field) => (
            <ImportantAdvancedField
              key={field.group.key}
              field={field}
              value={form.advancedSelections[field.group.key]}
              onChange={handleAdvancedChange}
            />
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Hours</span>
          <input
            value={form.hoursUntilReset}
            onChange={(event) => update("hoursUntilReset", event.target.value)}
            type="number"
            inputMode="numeric"
            min="0"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Minutes</span>
          <input
            value={form.minutesUntilReset}
            onChange={(event) => update("minutesUntilReset", event.target.value)}
            type="number"
            inputMode="numeric"
            min="0"
            className={inputClass}
          />
        </label>
      </div>

      {inlineErrors.length > 0 ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {inlineErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      <AdvancedOptions
        preset={preset}
        values={form.advancedSelections}
        hiddenKeys={hiddenAdvancedKeys}
        isOpen={advancedOpen}
        onToggle={onAdvancedToggle}
        onChange={handleAdvancedChange}
      />
    </form>
  );
}

interface CriticalField {
  group: AdvancedOptionGroup;
  options: MultiplierOption[];
  fallbackValue: string;
  helpText: string;
}

function getGroup(preset: PlatformPreset, key: AdvancedOptionKey) {
  return preset.advancedGroups.find((group) => group.key === key);
}

function getCriticalFields(
  form: EstimatorFormState,
  preset: PlatformPreset,
): CriticalField[] {
  const fields: CriticalField[] = [];
  const model = form.advancedSelections.model;
  const mode = form.advancedSelections.mode;
  const reasoning = form.advancedSelections.reasoning;

  if (form.platform === "Codex") {
    const group = getGroup(preset, "reasoning");
    if (group) {
      fields.push({
        group,
        options: group.options,
        fallbackValue: "Medium",
        helpText:
          "Higher reasoning effort usually means fewer tasks left, but better reasoning for complex coding work.",
      });
    }
  }

  if (form.platform === "ChatGPT") {
    const group = getGroup(preset, "model");
    if (group) {
      fields.push({
        group,
        options: group.options,
        fallbackValue: "GPT-5.5 Instant",
        helpText:
          "Choose the ChatGPT mode closest to what you are using for this window.",
      });
    }
  }

  if (form.platform === "ChatGPT" && model === "GPT-5.5 Thinking") {
    const group = getGroup(preset, "reasoning");
    if (group) {
      fields.push({
        group,
        options: group.options.filter(
          (option) => option.label !== "None / Instant",
        ),
        fallbackValue: "Standard",
        helpText: "Longer thinking time may reduce the number of messages left.",
      });
    }
  }

  if (form.platform === "Claude") {
    const group = getGroup(preset, "model");
    if (group) {
      fields.push({
        group,
        options: group.options,
        fallbackValue: "claude-fable-5",
        helpText:
          "Choose the Claude model closest to what you are using for this window.",
      });
    }
  }

  if (
    form.platform === "Gemini" &&
    (model === "Gemini 3 Pro" || reasoning === "Deep Think")
  ) {
    const group = getGroup(preset, "reasoning");
    if (group) {
      fields.push({
        group,
        options: group.options,
        fallbackValue: "Standard thinking",
        helpText: "Higher thinking levels can use more of your limit.",
      });
    }
  }

  if (form.platform === "Claude" && mode === "Claude Code") {
    const group = getGroup(preset, "reasoning");
    if (group) {
      fields.push({
        group,
        options: group.options,
        fallbackValue: "Normal",
        helpText:
          "Higher effort or long coding sessions may consume more of your usage.",
      });
    }
  }

  return fields;
}

function getHiddenAdvancedKeys(
  form: EstimatorFormState,
  criticalFields: CriticalField[],
): AdvancedOptionKey[] {
  const keys = criticalFields.map((field) => field.group.key);

  if (form.platform === "ChatGPT") {
    keys.push("model");
    keys.push("reasoning");
  }

  return Array.from(new Set(keys));
}

function ImportantAdvancedField({
  field,
  value,
  onChange,
}: {
  field: CriticalField;
  value?: string;
  onChange: (key: AdvancedOptionKey, value: string) => void;
}) {
  const selectedValue =
    value &&
    field.options.some((option) => (option.value ?? option.label) === value)
      ? value
      : field.fallbackValue;

  return (
    <label className="flex flex-col gap-2">
      <span className={labelClass}>{field.group.label}</span>
      <select
        value={selectedValue}
        onChange={(event) => onChange(field.group.key, event.target.value)}
        className={inputClass}
      >
        {field.options.map((option) => (
          <option key={option.value ?? option.label} value={option.value ?? option.label}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="text-sm leading-5 text-zinc-600 dark:text-zinc-400">
        {field.helpText}
      </span>
    </label>
  );
}
