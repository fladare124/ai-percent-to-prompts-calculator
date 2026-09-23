"use client";

import Link from "next/link";
import { DISCLAIMER, roundUsage } from "@/lib/estimation";
import type { EstimateResult } from "@/types";

interface EstimatorResultProps {
  result: EstimateResult;
  unitLabel: string;
  mainFactorsSummary: string;
  shareStatus: string;
  onCopy: () => void;
  onShare: () => void;
}

const statusStyles: Record<string, string> = {
  Comfortable:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200",
  Normal:
    "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-200",
  Caution:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200",
  "High risk":
    "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900/60 dark:bg-orange-950/50 dark:text-orange-200",
  Critical:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-200",
};

const reliabilityStyles: Record<string, string> = {
  High: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200",
  "Medium-high":
    "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/50 dark:text-teal-200",
  Medium:
    "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/50 dark:text-sky-200",
  "Medium-low":
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200",
  Low: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-200",
};

function rangeText(low: number, high: number) {
  return `${roundUsage(low)}-${roundUsage(high)}`;
}

function moneyRange(low: number, high: number) {
  const format = (value: number) =>
    value < 0.01 ? `$${value.toFixed(3)}` : `$${value.toFixed(2)}`;
  return `${format(low)}-${format(high)}`;
}

export default function EstimatorResult({
  result,
  unitLabel,
  mainFactorsSummary,
  shareStatus,
  onCopy,
  onShare,
}: EstimatorResultProps) {
  if (!result.isValid) {
    return (
      <section className="space-y-5" aria-live="polite">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-300">
            Needs one fix
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {result.platform === "Cursor"
              ? "Use your Cursor pool balance"
              : result.platform === "Gemini"
                ? "Use your Gemini usage meter"
                : result.platform === "Windsurf / Devin"
                  ? "Use your Devin or Windsurf allowance"
                : "Add the missing limit details"}
          </h2>
        </div>
        <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100">
          {result.errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
          {result.platform === "Cursor" ? (
            <Link
              href="/cursor-usage-calculator"
              className="mt-3 inline-block font-semibold text-cyan-900 underline underline-offset-2 dark:text-cyan-100"
            >
              Open the Cursor pool planner
            </Link>
          ) : result.platform === "Gemini" ? (
            <Link
              href="/gemini-usage-calculator"
              className="mt-3 inline-block font-semibold text-cyan-900 underline underline-offset-2 dark:text-cyan-100"
            >
              Open the Gemini 5-hour and weekly planner
            </Link>
          ) : result.platform === "Windsurf / Devin" ? (
            <Link
              href="/windsurf-devin-usage-calculator"
              className="mt-3 inline-block font-semibold text-cyan-900 underline underline-offset-2 dark:text-cyan-100"
            >
              Open the daily and weekly usage planners
            </Link>
          ) : null}
        </div>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {DISCLAIMER}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-live="polite">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:text-cyan-300">
          Your estimate
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-950">
            {result.plan}
          </span>
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-950">
            {result.resetWindow}
          </span>
        </div>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
          Around {roundUsage(result.estimatedMid)} {unitLabel} left
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Based on {result.remainingPercent}% remaining in the {result.resetWindow.toLowerCase()} window.
        </p>
        <div className="mt-4" aria-label={`${result.remainingPercent}% remaining`}>
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Used {result.usedPercent}%</span>
            <span>Remaining {result.remainingPercent}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-cyan-600 transition-[width] dark:bg-cyan-400"
              style={{ width: `${Math.min(100, Math.max(0, result.remainingPercent))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Remaining" value={`${result.remainingPercent}%`} />
        <Metric label="Used" value={`${result.usedPercent}%`} />
        <Metric
          label="Likely range"
          value={`${rangeText(result.estimatedLow, result.estimatedHigh)} ${unitLabel}`}
          highlighted
          wide
        />
        <Metric
          label="Estimate"
          value={`${roundUsage(result.estimatedMid)} ${unitLabel}`}
        />
        <Metric
          label="Safe pace"
          value={
            result.safeRate
              ? `${rangeText(result.safeRate.low, result.safeRate.high)} ${unitLabel}/hour`
              : "Add time until reset to calculate a safe pace."
          }
          wide={!result.safeRate}
        />
        {result.apiCostEstimate ? (
          <Metric
            label="Approx. API token cost (not plan cost)"
            value={`${moneyRange(
              result.apiCostEstimate.low,
              result.apiCostEstimate.high,
            )} (${result.apiCostEstimate.modelLabel})`}
            wide
          />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <Badge
          label={`Status: ${result.status}`}
          className={statusStyles[result.status]}
        />
        <Badge
          label={`Preset confidence: ${result.reliability}`}
          className={reliabilityStyles[result.reliability]}
        />
      </div>
      <p className="-mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        Preset confidence describes the reference allowance, not a measured
        accuracy score.
      </p>

      <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {result.statusMessage}
      </p>

      <div className="rounded-md border border-zinc-200 border-l-4 border-l-cyan-400 bg-zinc-50 p-4 dark:border-zinc-800 dark:border-l-cyan-500 dark:bg-zinc-950/70">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          Main factors
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {mainFactorsSummary}
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Limit basis:</span>{" "}
          {result.limitBasis}
        </p>
        {result.apiCostEstimate?.pricingNote ? (
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {result.apiCostEstimate.pricingNote}
          </p>
        ) : null}
        {result.costReference ? (
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {result.costReference}
          </p>
        ) : null}
        {result.notes.length > 0 ? (
          <div className="mt-3 space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {result.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCopy}
          className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Copy result
        </button>
        <button
          type="button"
          onClick={onShare}
          className="h-11 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Share result
        </button>
      </div>
      {shareStatus ? (
        <p className="text-sm text-cyan-700 dark:text-cyan-300">
          {shareStatus}
        </p>
      ) : null}

      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-500">
        {DISCLAIMER}
      </p>
    </section>
  );
}

function Metric({
  label,
  value,
  wide = false,
  highlighted = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-3 ${
        highlighted
        ? "border-cyan-200 bg-cyan-50/70 dark:border-cyan-900/50 dark:bg-cyan-950/20"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      } ${
        wide ? "col-span-2" : ""
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold leading-6 text-zinc-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${className}`}>
      {label}
    </span>
  );
}
