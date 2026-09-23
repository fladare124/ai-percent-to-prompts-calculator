"use client";

import { useState, type FormEvent } from "react";

type Inputs = {
  remaining: string;
  pointsSpent: string;
  similarTasks: string;
};

type Estimate = {
  remaining: number;
  pointsPerTask: number;
  tasksLeft: number;
};

const fieldClassName =
  "mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

function parseDecimal(value: string) {
  return Number(value.trim().replace(",", "."));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function CodexTaskEstimator() {
  const [inputs, setInputs] = useState<Inputs>({
    remaining: "",
    pointsSpent: "",
    similarTasks: "",
  });
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState("");

  function update(field: keyof Inputs, value: string) {
    setInputs((current) => ({ ...current, [field]: value }));
    setEstimate(null);
    setError("");
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const remaining = parseDecimal(inputs.remaining);
    const pointsSpent = parseDecimal(inputs.pointsSpent);
    const similarTasks = Number(inputs.similarTasks);

    if (
      ![remaining, pointsSpent, similarTasks].every(Number.isFinite) ||
      remaining < 0 ||
      remaining > 100 ||
      pointsSpent <= 0 ||
      pointsSpent > 100 ||
      similarTasks < 1 ||
      !Number.isInteger(similarTasks)
    ) {
      setEstimate(null);
      setError(
        "Enter a remaining balance from 0 to 100, a positive usage drop, and at least one whole task.",
      );
      return;
    }

    const pointsPerTask = pointsSpent / similarTasks;
    setError("");
    setEstimate({
      remaining,
      pointsPerTask,
      tasksLeft: remaining / pointsPerTask,
    });
  }

  return (
    <section
      aria-labelledby="codex-tasks-left-title"
      className="border-t border-zinc-200 pt-8 dark:border-zinc-800"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
          Personal task estimate
        </p>
        <h2
          id="codex-tasks-left-title"
          className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white"
        >
          How many similar Codex tasks could your balance cover?
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Use your own recent tasks to estimate a count. Compare readings from the
          same Codex allowance and reset cycle, then enter how many comparable
          tasks used the balance shown by those readings.
        </p>
      </div>

      <form
        onSubmit={calculate}
        className="mt-5 rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Remaining in this Codex window (%)
            <input
              aria-label="Codex usage percentage remaining"
              type="text"
              inputMode="decimal"
              required
              value={inputs.remaining}
              onChange={(event) => update("remaining", event.target.value)}
              className={fieldClassName}
              placeholder="e.g. 65"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Percentage points used by the sample tasks
            <input
              aria-label="Codex percentage points spent by the sample tasks"
              type="text"
              inputMode="decimal"
              required
              value={inputs.pointsSpent}
              onChange={(event) => update("pointsSpent", event.target.value)}
              className={fieldClassName}
              placeholder="e.g. 15"
            />
            <span className="mt-1 block text-xs font-normal leading-5 text-zinc-500 dark:text-zinc-400">
              If the same meter fell from 80% to 65%, enter 15.
            </span>
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Similar Codex tasks completed
            <input
              aria-label="Number of similar Codex tasks completed"
              type="number"
              min="1"
              step="1"
              required
              value={inputs.similarTasks}
              onChange={(event) => update("similarTasks", event.target.value)}
              className={fieldClassName}
              placeholder="e.g. 5"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-5 min-h-10 rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:focus:ring-offset-zinc-900"
        >
          Estimate similar tasks left
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
            <p>
              At about {formatNumber(estimate.pointsPerTask)} percentage points
              per similar task, {formatNumber(estimate.remaining)}% remaining
              could cover approximately {formatNumber(estimate.tasksLeft)} more
              similar {estimate.tasksLeft === 1 ? "task" : "tasks"}.
            </p>
            <p className="mt-2 text-xs leading-5">
              This projects your sample average. A different model, task size,
              context, reasoning level or tool use can change the result.
            </p>
          </div>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          Estimate only. The calculation runs in your browser; these values are
          not sent to or saved by this site. For this estimate to be useful, the
          sample tasks should resemble the work you plan to do.
        </p>
      </form>
    </section>
  );
}
