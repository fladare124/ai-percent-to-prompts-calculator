"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import EstimatorForm from "@/components/EstimatorForm";
import EstimatorResult from "@/components/EstimatorResult";
import UsageCalibration from "@/components/UsageCalibration";
import {
  buildShareText,
  getMainFactorsSummary,
  getPlatformUnitLabel,
} from "@/lib/displayLabels";
import { estimateUsage } from "@/lib/estimation";
import {
  createDefaultEstimatorForm,
  createEstimatorFormFromSearch,
  normalizeStoredEstimatorForm,
  type EstimatorFormState,
} from "@/lib/formState";
import {
  platformPresets,
} from "@/lib/platformPresets";
import type { EstimateInput, PlatformName } from "@/types";

const STORAGE_KEY = "ai-percent-to-prompts:last-input:codex-first";
const THEME_KEY = "ai-percent-to-prompts:theme";

interface UsageEstimatorProps {
  platformFocus?: PlatformName;
  productFocus?: "ChatGPT chat" | "Codex";
}

function applyProductFocus(
  form: EstimatorFormState | null,
  productFocus?: "ChatGPT chat" | "Codex",
) {
  if (!form || form.platform !== "Codex" || !productFocus) return form;
  const isChat = productFocus === "ChatGPT chat";
  return {
    ...form,
    resetWindow: "5 hours" as EstimatorFormState["resetWindow"],
    hoursUntilReset: "5",
    minutesUntilReset: "0",
    advancedSelections: {
      ...form.advancedSelections,
      product: productFocus,
      model: "gpt-5.6-sol",
      reasoning: "Medium",
      feature: isChat ? "Simple chat" : "Coding task",
    },
  };
}

function toEstimateInput(form: EstimatorFormState): EstimateInput {
  const advancedSelections = { ...form.advancedSelections };

  if (form.platform === "ChatGPT") {
    advancedSelections.reasoning =
      advancedSelections.model === "GPT-5.5 Thinking"
        ? advancedSelections.reasoning === "None / Instant" ||
          !advancedSelections.reasoning
          ? "Medium"
          : advancedSelections.reasoning
        : "None / Instant";
  }

  if (form.platform === "Codex") {
    advancedSelections.reasoning =
      advancedSelections.model === "gpt-5.5-instant"
        ? "None / Instant"
        : advancedSelections.model === "gpt-5.6-sol-pro"
          ? "Pro"
          : advancedSelections.reasoning ?? "Medium";
  }

  return {
    platform: form.platform,
    plan: form.plan,
    remainingPercent: Number(form.remainingPercent),
    resetWindow: form.resetWindow,
    hoursUntilReset: Number(form.hoursUntilReset || 0),
    minutesUntilReset: Number(form.minutesUntilReset || 0),
    usageIntensity: form.usageIntensity,
    advancedSelections,
  };
}

function subscribeToBrowserStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getStoredFormSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getLocationSearchSnapshot() {
  return window.location.search;
}

function getStoredThemeSnapshot() {
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerSnapshot() {
  return null;
}

export default function UsageEstimator({
  platformFocus,
  productFocus,
}: UsageEstimatorProps) {
  const defaultForm = useMemo(
    () =>
      applyProductFocus(
        createDefaultEstimatorForm(platformFocus),
        productFocus,
      )!,
    [platformFocus, productFocus],
  );
  const storedFormJson = useSyncExternalStore(
    subscribeToBrowserStorage,
    getStoredFormSnapshot,
    getServerSnapshot,
  );
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearchSnapshot,
    getServerSnapshot,
  );
  const storedTheme = useSyncExternalStore(
    subscribeToBrowserStorage,
    getStoredThemeSnapshot,
    getServerSnapshot,
  );
  const storedForm = useMemo(
    () =>
      applyProductFocus(
        normalizeStoredEstimatorForm(storedFormJson, platformFocus),
        productFocus,
      ),
    [platformFocus, productFocus, storedFormJson],
  );
  const queryForm = useMemo(
    () =>
      applyProductFocus(
        createEstimatorFormFromSearch(locationSearch ?? "", platformFocus),
        productFocus,
      ),
    [locationSearch, platformFocus, productFocus],
  );
  const [draftForm, setDraftForm] = useState<EstimatorFormState | null>(null);
  const form = draftForm ?? storedForm ?? queryForm ?? defaultForm;
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [themeChoice, setThemeChoice] = useState<string | null>(null);
  const darkMode = (themeChoice ?? storedTheme ?? "light") === "dark";

  useEffect(() => {
    if (!draftForm) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draftForm));
  }, [draftForm]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    if (themeChoice) {
      window.localStorage.setItem(THEME_KEY, themeChoice);
    }
  }, [darkMode, themeChoice]);

  const preset = platformPresets[form.platform];
  const result = useMemo(() => estimateUsage(toEstimateInput(form)), [form]);
  const selectedModeForLabel =
    form.platform === "Codex"
      ? form.advancedSelections.product
      : form.platform === "Claude"
      ? form.advancedSelections.mode
      : form.advancedSelections.model;
  const unitLabel = getPlatformUnitLabel(
    form.platform,
    selectedModeForLabel,
    form.advancedSelections.feature,
    form.advancedSelections.model,
  );
  const mainFactorsSummary = getMainFactorsSummary(result);
  const selectedModelValue = form.advancedSelections.model;
  const selectedModelLabel = preset.advancedGroups
    .find((group) => group.key === "model")
    ?.options.find(
      (option) =>
        (option.value ?? option.label) === selectedModelValue ||
        option.label === selectedModelValue,
    )?.label;
  const selectedModeLabel = preset.advancedGroups
    .find((group) => group.key === "mode")
    ?.options.find(
      (option) =>
        (option.value ?? option.label) === form.advancedSelections.mode ||
        option.label === form.advancedSelections.mode,
    )?.label;
  const inlineErrors = result.errors.filter(
    (error) =>
      error.includes("Remaining") ||
      error.includes("Hours"),
  );

  const shareText = useMemo(() => {
    return buildShareText(result, unitLabel, selectedModelLabel, selectedModeLabel);
  }, [result, selectedModeLabel, selectedModelLabel, unitLabel]);

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("Result copied to clipboard.");
    } catch {
      setShareStatus("Copy failed. Select the result text manually.");
    }
  };

  const shareResult = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AI Percent to Prompts Calculator",
          text: shareText,
          url: window.location.href,
        });
        setShareStatus("Share sheet opened.");
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareStatus("Web Share is not available, so the result was copied.");
      }
    } catch {
      setShareStatus("Share was cancelled or unavailable.");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-t-4 border-zinc-200 border-t-cyan-400 bg-white shadow-[0_18px_50px_-30px_rgba(24,24,27,0.35)] dark:border-zinc-800 dark:border-t-cyan-500 dark:bg-zinc-900 dark:shadow-none">
      <div className="flex flex-col gap-4 border-b border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <p className="text-base font-semibold text-zinc-950 dark:text-white">
            Build your estimate
          </p>
          <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Pick a platform, match the window it shows, then read the likely range.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md border border-cyan-200 bg-white px-2 py-1 text-xs font-semibold text-cyan-800 dark:border-cyan-900/60 dark:bg-zinc-900 dark:text-cyan-200">
              Model: {selectedModelLabel ?? "Auto / not sure"}
            </span>
            <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              Personal usage calibration
            </span>
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Model and task factors
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setThemeChoice(darkMode ? "light" : "dark")}
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-6 lg:border-b-0 lg:p-7">
          <EstimatorForm
            form={form}
            preset={preset}
            advancedOpen={advancedOpen}
            inlineErrors={inlineErrors}
            onChange={(next) => {
              setDraftForm(next);
              setShareStatus("");
            }}
            onAdvancedToggle={() => setAdvancedOpen((value) => !value)}
          />
        </div>
        <div className="self-start bg-zinc-50/55 p-5 dark:border-zinc-800 dark:bg-zinc-950/25 sm:p-6 lg:sticky lg:top-4 lg:border-l lg:border-zinc-200 lg:p-7">
          <EstimatorResult
            result={result}
            unitLabel={unitLabel}
            mainFactorsSummary={mainFactorsSummary}
            shareStatus={shareStatus}
            onCopy={copyResult}
            onShare={shareResult}
          />
          <UsageCalibration
            remainingPercent={Number(form.remainingPercent)}
            unitLabel={unitLabel}
          />
        </div>
      </div>
    </div>
  );
}
