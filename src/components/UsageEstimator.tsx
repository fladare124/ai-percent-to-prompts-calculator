"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import EstimatorForm from "@/components/EstimatorForm";
import EstimatorResult from "@/components/EstimatorResult";
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

const STORAGE_KEY = "ai-usage-estimator:last-input:codex-first";
const THEME_KEY = "ai-usage-estimator:theme";

interface UsageEstimatorProps {
  platformFocus?: PlatformName;
}

function toEstimateInput(form: EstimatorFormState): EstimateInput {
  const advancedSelections = { ...form.advancedSelections };

  if (form.platform === "ChatGPT") {
    advancedSelections.reasoning =
      advancedSelections.model === "GPT-5.5 Thinking"
        ? advancedSelections.reasoning === "None / Instant" ||
          !advancedSelections.reasoning
          ? "Standard"
          : advancedSelections.reasoning
        : "None / Instant";
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

export default function UsageEstimator({ platformFocus }: UsageEstimatorProps) {
  const defaultForm = useMemo(
    () => createDefaultEstimatorForm(platformFocus),
    [platformFocus],
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
    () => normalizeStoredEstimatorForm(storedFormJson, platformFocus),
    [platformFocus, storedFormJson],
  );
  const queryForm = useMemo(
    () => createEstimatorFormFromSearch(locationSearch ?? "", platformFocus),
    [locationSearch, platformFocus],
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
    form.platform === "Claude"
      ? form.advancedSelections.mode
      : form.advancedSelections.model;
  const unitLabel = getPlatformUnitLabel(
    form.platform,
    selectedModeForLabel,
    form.advancedSelections.feature,
    form.advancedSelections.model,
  );
  const mainFactorsSummary = getMainFactorsSummary(result);
  const selectedModelLabel =
    form.platform === "Claude" &&
    (form.advancedSelections.model === "claude-fable-5" ||
      form.advancedSelections.model === "Claude Fable 5")
      ? "Claude Fable 5"
      : undefined;
  const inlineErrors = result.errors.filter(
    (error) =>
      error.includes("Remaining") ||
      error.includes("Hours"),
  );

  const shareText = useMemo(() => {
    return buildShareText(result, unitLabel, selectedModelLabel);
  }, [result, selectedModelLabel, unitLabel]);

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
          title: "AI Usage Calculator",
          text: shareText,
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
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
            AI Usage Calculator
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Estimate usage left for Codex, ChatGPT, Claude, Gemini and more.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setThemeChoice(darkMode ? "light" : "dark")}
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 lg:border-b-0 lg:border-r">
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
        <div className="p-5">
          <EstimatorResult
            result={result}
            unitLabel={unitLabel}
            mainFactorsSummary={mainFactorsSummary}
            shareStatus={shareStatus}
            onCopy={copyResult}
            onShare={shareResult}
          />
        </div>
      </div>
    </div>
  );
}
