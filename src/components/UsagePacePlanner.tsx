"use client";

import { useEffect, useState, type FormEvent } from "react";

type Inputs = {
  remaining: string;
  hoursUntilReset: string;
  pointsSpent: string;
  hoursObserved: string;
};

type Estimate =
  | { kind: "empty" }
  | { kind: "no-burn"; remaining: number; sustainableRate: number }
  | {
      kind: "forecast";
      remaining: number;
      hoursUntilReset: number;
      observedRate: number;
      sustainableRate: number;
      projectedRemaining: number;
      runsOutInHours: number | null;
    };

type UsagePacePlannerProps = {
  platform:
    | "Claude"
    | "Codex"
    | "Gemini usage"
    | "Cursor Models pool"
    | "Other Models pool"
    | "Windsurf / Devin daily quota"
    | "Windsurf / Devin weekly quota";
  windowGuidance: string;
  sourceUrl: string;
  sourceLabel: string;
  measurementUnit?: string;
};

const initialInputs: Inputs = {
  remaining: "",
  hoursUntilReset: "",
  pointsSpent: "",
  hoursObserved: "",
};

function calculateUsagePace(inputs: Inputs, measurementUnit: string) {
  const remaining = Number(inputs.remaining);
  const hoursUntilReset = Number(inputs.hoursUntilReset);
  const pointsSpent = Number(inputs.pointsSpent);
  const hoursObserved = Number(inputs.hoursObserved);
  const maxMeasurement =
    measurementUnit === "percentage points" ? 100 : undefined;

  if (
    ![remaining, hoursUntilReset, pointsSpent, hoursObserved].every(
      Number.isFinite,
    ) ||
    remaining < 0 ||
    (maxMeasurement !== undefined && remaining > maxMeasurement) ||
    hoursUntilReset <= 0 ||
    pointsSpent < 0 ||
    (maxMeasurement !== undefined && pointsSpent > maxMeasurement) ||
    hoursObserved <= 0
  ) {
    return {
      estimate: null,
      error: "Enter valid readings and time periods to calculate a pace.",
    };
  }

  if (remaining === 0) {
    return { estimate: { kind: "empty" } as Estimate, error: "" };
  }

  const observedRate = pointsSpent / hoursObserved;
  const sustainableRate = remaining / hoursUntilReset;

  if (observedRate === 0) {
    return {
      estimate: { kind: "no-burn", remaining, sustainableRate } as Estimate,
      error: "",
    };
  }

  const projectedRemaining = remaining - observedRate * hoursUntilReset;
  return {
    estimate: {
      kind: "forecast",
      remaining,
      hoursUntilReset,
      observedRate,
      sustainableRate,
      projectedRemaining: Math.max(0, projectedRemaining),
      runsOutInHours:
        projectedRemaining <= 0 ? remaining / observedRate : null,
    } as Estimate,
    error: "",
  };
}

export default function UsagePacePlanner({
  platform,
  windowGuidance,
  sourceUrl,
  sourceLabel,
  measurementUnit = "percentage points",
}: UsagePacePlannerProps) {
  const titleId = `${platform.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-pace-title`;
  const maxMeasurement =
    measurementUnit === "percentage points" ? 100 : undefined;
  const isPercentage = measurementUnit === "percentage points";
  const [inputs, setInputs] = useState(initialInputs);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("ptpPace") !== "1" ||
      params.get("pacePlanner") !== platform
    ) {
      return;
    }

    const remaining = params.get("paceRemaining");
    const hoursUntilReset = params.get("paceHours");
    const pointsSpent = params.get("paceSpent");
    const hoursObserved = params.get("paceObserved");
    if (
      remaining === null ||
      hoursUntilReset === null ||
      pointsSpent === null ||
      hoursObserved === null
    ) {
      return;
    }

    const sharedInputs = {
      remaining,
      hoursUntilReset,
      pointsSpent,
      hoursObserved,
    };
    const calculation = calculateUsagePace(sharedInputs, measurementUnit);
    if (calculation.error) return;

    setInputs(sharedInputs);
    setEstimate(calculation.estimate);
  }, [measurementUnit, platform]);

  function updateInput(field: keyof Inputs, value: string) {
    setInputs((current) => ({ ...current, [field]: value }));
    setEstimate(null);
    setError("");
    setShareStatus("");
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const calculation = calculateUsagePace(inputs, measurementUnit);
    setError(calculation.error);
    setEstimate(calculation.estimate);
  }

  function createShareUrl() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    params.set("ptpPace", "1");
    params.set("pacePlanner", platform);
    params.set("paceRemaining", inputs.remaining);
    params.set("paceHours", inputs.hoursUntilReset);
    params.set("paceSpent", inputs.pointsSpent);
    params.set("paceObserved", inputs.hoursObserved);
    url.search = params.toString();
    url.hash = "";
    return url.toString();
  }

  async function copyShareLink() {
    try {
      const shareUrl = createShareUrl();
      const shareText = `${platform} usage pace: ${inputs.remaining} ${measurementUnit} remaining; ${inputs.hoursUntilReset} hours until reset; recent usage ${inputs.pointsSpent} ${measurementUnit} over ${inputs.hoursObserved} hours.`;
      await navigator.clipboard.writeText(
        `${shareText}\n\nOpen this planner: ${shareUrl}`,
      );
      setShareStatus("Planner result and link copied.");
    } catch {
      setShareStatus("Copy failed. Use the browser address bar to share the link.");
    }
  }

  async function sharePace() {
    const shareUrl = createShareUrl();
    const shareText = `${platform} usage pace: ${inputs.remaining} ${measurementUnit} remaining; ${inputs.hoursUntilReset} hours until reset; recent usage ${inputs.pointsSpent} ${measurementUnit} over ${inputs.hoursObserved} hours.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${platform} usage pace`,
          text: shareText,
          url: shareUrl,
        });
        setShareStatus("Share sheet opened with your planner link.");
      } else {
        await navigator.clipboard.writeText(
          `${shareText}\n\nOpen this planner: ${shareUrl}`,
        );
        setShareStatus("Planner result and link copied to clipboard.");
      }
    } catch {
      setShareStatus("Share was cancelled or unavailable.");
    }
  }

  return (
    <section
      aria-labelledby={titleId}
      className="border-t border-zinc-200 pt-8 dark:border-zinc-800"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
          {platform} usage planner
        </p>
        <h2
          id={titleId}
          className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white"
        >
          Will your {platform} usage last until reset?
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Compare the allowance left in one usage window with your recent pace.{" "}
          {windowGuidance}
        </p>
      </div>

      <form
        onSubmit={calculate}
        className="mt-5 rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Remaining in this window ({measurementUnit})
            <input
              aria-label={`${platform} usage remaining`}
              type="number"
              min="0"
              max={maxMeasurement}
              step="0.1"
              inputMode="decimal"
              required
              value={inputs.remaining}
              onChange={(event) => updateInput("remaining", event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              placeholder={isPercentage ? "e.g. 65" : "e.g. 240"}
            />
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Hours until this window resets
            <input
              aria-label={`Hours until the selected ${platform} usage window resets`}
              type="number"
              min="0.1"
              step="0.1"
              inputMode="decimal"
              required
              value={inputs.hoursUntilReset}
              onChange={(event) =>
                updateInput("hoursUntilReset", event.target.value)
              }
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              placeholder="e.g. 18"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {isPercentage
              ? "Percentage points used since your last reading"
              : `Amount used since your last reading (${measurementUnit})`}
            <input
              aria-label={`${platform} usage amount spent since the last reading`}
              type="number"
              min="0"
              max={maxMeasurement}
              step="0.1"
              inputMode="decimal"
              required
              value={inputs.pointsSpent}
              onChange={(event) => updateInput("pointsSpent", event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              placeholder={isPercentage ? "e.g. 15" : "e.g. 60"}
            />
            <span className="mt-1 block text-xs font-normal leading-5 text-zinc-500 dark:text-zinc-400">
              {isPercentage
                ? "If the meter fell from 80% to 65%, enter 15."
                : "Subtract the current balance from your earlier reading. Use the same unit as the balance above."}
            </span>
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Hours between those readings
            <input
              aria-label={`Hours between ${platform} usage readings`}
              type="number"
              min="0.1"
              step="0.1"
              inputMode="decimal"
              required
              value={inputs.hoursObserved}
              onChange={(event) =>
                updateInput("hoursObserved", event.target.value)
              }
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              placeholder="e.g. 4"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-5 min-h-10 rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:focus:ring-offset-zinc-900"
        >
          Check my usage pace
        </button>

        {error ? (
          <p className="mt-4 text-sm text-amber-800 dark:text-amber-200" role="alert">
            {error}
          </p>
        ) : null}

        {estimate ? (
          <div
            className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100"
            aria-live="polite"
            role="status"
          >
            {estimate.kind === "empty" ? (
              <p>No allowance remains in this window. Check the reset time shown by {platform} before planning more use.</p>
            ) : estimate.kind === "no-burn" ? (
              <p>
                Your readings show no drop in this window during the observed
                period. To spread the current balance until reset, average use
                would need to stay near or below{" "}
                <strong>
                  {estimate.sustainableRate.toFixed(1)} {measurementUnit} per hour
                </strong>
                .
              </p>
            ) : estimate.runsOutInHours !== null ? (
              <p>
                At the observed rate of{" "}
                <strong>{estimate.observedRate.toFixed(1)} {measurementUnit} per hour</strong>,
                the remaining allowance could run out in about{" "}
                <strong>{estimate.runsOutInHours.toFixed(1)} hours</strong>, roughly{" "}
                <strong>
                  {Math.max(
                    0,
                    estimate.hoursUntilReset - estimate.runsOutInHours,
                  ).toFixed(1)}{" "}
                  hours before reset
                </strong>
                .
              </p>
            ) : (
              <p>
                At the observed rate of{" "}
                <strong>{estimate.observedRate.toFixed(1)} {measurementUnit} per hour</strong>,
                  about{" "}
                <strong>
                  {estimate.projectedRemaining.toFixed(1)} {measurementUnit} could remain at reset
                </strong>
                .
              </p>
            )}

            {estimate.kind === "forecast" ? (
              <p className="mt-2">
                To spread the remaining {estimate.remaining.toFixed(1)}{" "}
                {measurementUnit} over the next{" "}
                {estimate.hoursUntilReset.toFixed(1)} hours, average use would
                need to stay near or below{" "}
                <strong>
                  {estimate.sustainableRate.toFixed(1)} {measurementUnit} per hour
                </strong>
                .
              </p>
            ) : null}
          </div>
        ) : null}

        {estimate ? (
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="min-h-10 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Copy planner result and link
              </button>
              <button
                type="button"
                onClick={sharePace}
                className="min-h-10 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Share planner
              </button>
            </div>
            <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              The shareable link includes these four meter readings and opens this planner.
            </p>
            {shareStatus ? (
              <p className="text-sm text-cyan-700 dark:text-cyan-300" role="status">
                {shareStatus}
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          This is a planning estimate, not a live account reading. Compare
          readings from the same usage window and reset cycle. Calculations stay
          in this browser; values are not sent or saved.
        </p>

        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-medium text-cyan-800 underline decoration-cyan-300 underline-offset-4 hover:text-cyan-600 dark:text-cyan-300 dark:decoration-cyan-800"
        >
          {sourceLabel}
        </a>
      </form>
    </section>
  );
}
