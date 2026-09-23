"use client";

import { useMemo, useState } from "react";

interface UsageCalibrationProps {
  remainingPercent: number;
  unitLabel: string;
}

export default function UsageCalibration({
  remainingPercent,
  unitLabel,
}: UsageCalibrationProps) {
  const [startingPercent, setStartingPercent] = useState("");
  const [completedUnits, setCompletedUnits] = useState("");

  const estimate = useMemo(() => {
    const start = Number(startingPercent);
    const completed = Number(completedUnits);
    const current = remainingPercent;
    const percentagePointsUsed = start - current;

    if (
      startingPercent === "" ||
      completedUnits === "" ||
      !Number.isFinite(start) ||
      !Number.isFinite(completed) ||
      !Number.isFinite(current) ||
      start < 0 ||
      start > 100 ||
      current < 0 ||
      current > 100 ||
      completed <= 0 ||
      percentagePointsUsed <= 0
    ) {
      return null;
    }

    return Math.max(0, Math.round((completed / percentagePointsUsed) * current));
  }, [completedUnits, remainingPercent, startingPercent]);

  const hasPartialInput = startingPercent !== "" || completedUnits !== "";
  const invalidSample = hasPartialInput && estimate === null;

  return (
    <details className="mt-5 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <summary className="cursor-pointer text-sm font-semibold text-zinc-950 dark:text-white">
        Personalize with your recent usage
      </summary>
      <div className="mt-3 space-y-4">
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Compare two readings from the same reset window and enter how many
          similar tasks you completed between them. Keep the provider, plan,
          model and task type the same. Your current percentage comes from the
          estimate above.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Earlier remaining percentage
            <span className="mt-1 flex items-center gap-2">
              <input
                aria-label="Earlier remaining percentage"
                type="number"
                min="0"
                max="100"
                step="1"
                inputMode="decimal"
                value={startingPercent}
                onChange={(event) => setStartingPercent(event.target.value)}
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                placeholder="e.g. 80"
              />
              <span aria-hidden="true">%</span>
            </span>
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Similar requests completed since
            <input
              aria-label="Similar tasks completed since earlier reading"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={completedUnits}
              onChange={(event) => setCompletedUnits(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              placeholder="e.g. 12"
            />
          </label>
        </div>

        {estimate !== null ? (
          <p
            className="rounded-md border border-cyan-200 bg-cyan-50 p-3 text-sm leading-6 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100"
            aria-live="polite"
          >
            At that recent pace, you may have about{" "}
            <strong>
              {estimate.toLocaleString()} {unitLabel}
            </strong>{" "}
            left. This uses your observed usage, so it can differ from the
            general estimate above.
          </p>
        ) : invalidSample ? (
          <p className="text-sm leading-6 text-amber-800 dark:text-amber-200" role="status">
            Use an earlier percentage that is higher than the current one, and
            a positive number of completed tasks from that same reset window.
          </p>
        ) : null}

        <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          This is a personal pace estimate, not a provider limit. A different
          model, task or context size can change how quickly usage is consumed.
        </p>
      </div>
    </details>
  );
}
