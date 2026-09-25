"use client";

import Link from "next/link";
import AdvancedOptions from "@/components/AdvancedOptions";
import {
  PLATFORMS,
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
      resetWindow: platformDefaults.resetWindow,
      hoursUntilReset: platformDefaults.hoursUntilReset,
      minutesUntilReset: platformDefaults.minutesUntilReset,
      advancedSelections: platformDefaults.advancedSelections,
    });
  };

  const handleResetWindowChange = (resetWindow: ResetWindow) => {
    const hoursByWindow: Record<ResetWindow, string> = {
      "5 hours": "5",
      Daily: "24",
      Weekly: "168",
      Monthly: "720",
    };
    onChange({
      ...form,
      resetWindow,
      hoursUntilReset: hoursByWindow[resetWindow],
      minutesUntilReset: "0",
    });
  };

  const handleAdvancedChange = (key: AdvancedOptionKey, value: string) => {
    const nextSelections = {
      ...form.advancedSelections,
      [key]: value || undefined,
    };

    if (form.platform === "Codex" && key === "product") {
      const productDefaults = {
        "ChatGPT chat": {
          model: "gpt-5.6-sol",
          reasoning: "Medium",
          mode: "standard",
          feature: "Simple chat",
          resetWindow: "5 hours" as ResetWindow,
          hours: "5",
        },
        Codex: {
          model: "gpt-5.6-sol",
          reasoning: "Medium",
          mode: "standard",
          feature: "Coding task",
          resetWindow: "5 hours" as ResetWindow,
          hours: "5",
        },
        "Work / workspace agents": {
          model: "gpt-5.6-sol",
          reasoning: "High",
          mode: "standard",
          feature: "Agent mode",
          resetWindow: "5 hours" as ResetWindow,
          hours: "5",
        },
      }[value];

      if (productDefaults) {
        onChange({
          ...form,
          resetWindow: productDefaults.resetWindow,
          hoursUntilReset: productDefaults.hours,
          minutesUntilReset: "0",
          advancedSelections: {
            ...nextSelections,
            model: productDefaults.model,
            reasoning: productDefaults.reasoning,
            feature: productDefaults.feature,
          },
        });
        return;
      }
    }

    if (form.platform === "Codex" && key === "model") {
      nextSelections.reasoning =
        value === "gpt-5.5-instant"
          ? "None / Instant"
          : value === "gpt-5.6-sol-pro"
            ? "Pro"
            : nextSelections.reasoning === "None / Instant" ||
                nextSelections.reasoning === "Pro"
              ? "Medium"
              : nextSelections.reasoning;
    }

    if (form.platform === "ChatGPT" && key === "model") {
      nextSelections.reasoning =
        value === "GPT-5.5 Thinking" ? "Medium" : "None / Instant";
    }

    onChange({
      ...form,
      advancedSelections: nextSelections,
    });
  };

  const criticalFields = getCriticalFields(form, preset);
  const hiddenAdvancedKeys = getHiddenAdvancedKeys(form, criticalFields);
  const isCursor = form.platform === "Cursor";
  const isGemini = form.platform === "Gemini";
  const isPerplexity = form.platform === "Perplexity";
  const isWindsurfDevin = form.platform === "Windsurf / Devin";
  const hasDedicatedPlanner =
    isCursor || isGemini || isPerplexity || isWindsurfDevin;

  return (
    <form className="space-y-7" noValidate>
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
            Usage setup
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {isCursor
              ? "Cursor usage is tracked in separate monthly pools."
              : isGemini
                ? "Gemini usage depends on the limit and reset time shown in your account."
                : isPerplexity
                  ? "Perplexity tracks Pro Search and Research separately. Use the matching pace planner."
                  : isWindsurfDevin
                    ? "Devin and Windsurf plans have daily and weekly usage allowances."
                    : "Match what your provider shows before reading the estimate."}
          </p>
        </div>
        <span className="rounded-md border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200">
          {hasDedicatedPlanner ? "Usage pace planner" : "Live estimate"}
        </span>
      </div>

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
                {platform === "Codex" ? "ChatGPT / Codex" : platform}
              </option>
            ))}
          </select>
        </label>

        {hasDedicatedPlanner ? null : (
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
        )}
      </div>

      {hasDedicatedPlanner ? (
        <div className="rounded-md border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100">
          <p>
            {isCursor
              ? "Cursor does not have one fixed request count across models and tasks. Compare your recent readings from each pool against the time left in your billing cycle."
              : isGemini
                ? "Gemini limits refresh every 5 hours until the weekly limit is reached. Use the limit reading and refresh time shown in Gemini Settings."
                : isPerplexity
                  ? "Pro Search and Research have separate allowances and reset windows. Use the account readings in the matching planner; Perplexity limits are not one fixed prompt count."
                  : "Devin and Windsurf usage refreshes daily and weekly. Use the allowance reading and reset time shown in your account."}
          </p>
          <Link
            href={
              isCursor
                ? "/cursor-usage-calculator"
                : isGemini
                  ? "/gemini-usage-calculator"
                  : isPerplexity
                    ? "/perplexity-usage-calculator"
                    : "/windsurf-devin-usage-calculator"
            }
            className="mt-2 inline-block font-semibold underline underline-offset-2"
          >
            {isCursor
              ? "Open the Cursor Models and Other Models planners"
              : isGemini
                ? "Open the Gemini 5-hour and weekly planner"
                : isPerplexity
                  ? "Open the Perplexity Pro Search and Research planners"
                  : "Open the Devin and Windsurf daily and weekly planners"}
          </Link>
        </div>
      ) : (
        <>
      {criticalFields.length > 0 ? (
        <div className="space-y-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">
              Choose your setup
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Start with the product and model, then add effort or agent mode when it matters.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {criticalFields.map((field) => (
              <div
                key={field.group.key}
                className={field.wide ? "sm:col-span-2" : ""}
              >
                <ImportantAdvancedField
                  field={field}
                  value={form.advancedSelections[field.group.key]}
                  onChange={handleAdvancedChange}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
          Remaining allowance
        </p>
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
              handleResetWindowChange(event.target.value as ResetWindow)
            }
            className={inputClass}
          >
            {preset.resetWindows.map((window) => (
              <option key={window} value={window}>
                {window}
              </option>
            ))}
          </select>
          {form.platform === "Codex" ? (
            <span className="text-sm leading-5 text-zinc-600 dark:text-zinc-400">
              {form.advancedSelections.product === "ChatGPT chat"
                ? "Use the closest window shown in ChatGPT. Limits can vary by model and feature."
                : "Use the same agentic window shown by Codex or Work, usually 5 hours or weekly."}
            </span>
          ) : null}
          {form.platform === "ChatGPT" ? (
            <span className="text-sm leading-5 text-zinc-600 dark:text-zinc-400">
              Choose the closest window shown in ChatGPT. Limits can vary by model and feature.
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

      <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
          Time until reset
        </p>
      </div>
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
        </>
      )}
    </form>
  );
}

interface CriticalField {
  group: AdvancedOptionGroup;
  options: MultiplierOption[];
  fallbackValue: string;
  helpText: string;
  emphasized?: boolean;
  wide?: boolean;
}

function getGroup(preset: PlatformPreset, key: AdvancedOptionKey) {
  return preset.advancedGroups.find((group) => group.key === key);
}

function getOpenAIModelOptions(
  options: MultiplierOption[],
  product?: string,
) {
  const allowedByProduct: Record<string, string[]> = {
    "ChatGPT chat": [
      "gpt-5.6-sol",
      "gpt-5.6-sol-pro",
      "gpt-5.5-instant",
      "openai-auto",
    ],
    Codex: [
      "gpt-5.6-sol",
      "gpt-5.6-terra",
      "gpt-5.6-luna",
      "gpt-5.5-codex",
      "gpt-5.4",
      "openai-auto",
    ],
    "Work / workspace agents": [
      "gpt-5.6-sol",
      "gpt-5.6-sol-pro",
      "gpt-5.6-terra",
      "gpt-5.6-luna",
      "openai-auto",
    ],
  };
  const allowed = allowedByProduct[product ?? "ChatGPT chat"];
  return options.filter((option) =>
    allowed.includes(option.value ?? option.label),
  );
}

function getOpenAIReasoningOptions(
  options: MultiplierOption[],
  model?: string,
  product?: string,
) {
  if (model === "gpt-5.5-instant") {
    return options.filter((option) => option.label === "None / Instant");
  }

  if (model === "gpt-5.6-sol-pro") {
    return options.filter((option) => option.label === "Pro");
  }

  const effortOptions = options.filter(
    (option) =>
      option.label !== "None / Instant" && option.label !== "Pro",
  );

  if (product !== "ChatGPT chat") return effortOptions;

  return effortOptions.filter((option) => option.label !== "Max");
}

function getOpenAIExecutionModeOptions(
  options: MultiplierOption[],
  product?: string,
  plan?: string,
) {
  if (product === "ChatGPT chat") return [];

  const ultraPlans = ["Plus", "Pro", "Business", "Enterprise / Edu"];
  return options.filter(
    (option) =>
      option.value !== "ultra" || ultraPlans.includes(plan ?? ""),
  );
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
    const productGroup = getGroup(preset, "product");
    const modelGroup = getGroup(preset, "model");
    const reasoningGroup = getGroup(preset, "reasoning");
    const product = form.advancedSelections.product ?? "ChatGPT chat";

    if (productGroup) {
      fields.push({
        group: productGroup,
        options: productGroup.options,
        fallbackValue: "ChatGPT chat",
        helpText:
          "ChatGPT chat uses message limits. Codex and Work use the shared agentic usage pool.",
        wide: true,
      });
    }

    if (modelGroup) {
      fields.push({
        group: modelGroup,
        options: getOpenAIModelOptions(modelGroup.options, product),
        fallbackValue: "gpt-5.6-sol",
        helpText:
          product === "ChatGPT chat"
            ? "GPT-5.6 Sol powers Medium, High and Extra High reasoning on eligible plans."
            : "Sol is the flagship; Terra is the lower-cost balance and Luna is the fast, efficient option.",
        emphasized: true,
      });
    }

    const executionModeGroup = getGroup(preset, "mode");
    const executionModeOptions = executionModeGroup
      ? getOpenAIExecutionModeOptions(
          executionModeGroup.options,
          product,
          form.plan,
        )
      : [];
    if (executionModeGroup && executionModeOptions.length > 0) {
      fields.push({
        group: executionModeGroup,
        options: executionModeOptions,
        fallbackValue: "standard",
        helpText:
          "Standard is best for everyday work. Max and Ultra can use more agentic effort and consume more of the shared pool.",
      });
    }

    if (reasoningGroup) {
      const reasoningOptions = getOpenAIReasoningOptions(
        reasoningGroup.options,
        model,
        product,
      );
      fields.push({
        group: reasoningGroup,
        options: reasoningOptions,
        fallbackValue:
          model === "gpt-5.5-instant"
            ? "None / Instant"
            : model === "gpt-5.6-sol-pro"
              ? "Pro"
              : "Medium",
        helpText:
          "More reasoning usually means fewer messages or tasks, with more work done per response.",
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
        fallbackValue: "Medium",
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
        fallbackValue: "claude-sonnet-5",
        helpText:
          "Fable 5 and 5.1 use different allowance rules by plan. The estimate cannot convert Fable usage credits into messages.",
        emphasized: true,
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

  if (form.platform === "ChatGPT" || form.platform === "Codex") {
    keys.push("product");
    keys.push("model");
    keys.push("reasoning");
    keys.push("mode");
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
  const selectedOption = field.options.find(
    (option) => (option.value ?? option.label) === selectedValue,
  );

  return (
    <label
      className={`flex flex-col gap-2 ${
        field.emphasized
          ? "rounded-md border border-cyan-200 bg-cyan-50/60 p-3 dark:border-cyan-900/60 dark:bg-cyan-950/20"
          : ""
      }`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className={labelClass}>{field.group.label}</span>
        {field.emphasized ? (
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
            Key factor
          </span>
        ) : null}
      </span>
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
      {selectedOption?.availabilityNote ? (
        <span className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {selectedOption.availabilityNote}
        </span>
      ) : null}
    </label>
  );
}
