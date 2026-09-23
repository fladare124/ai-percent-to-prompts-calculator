"use client";

import { useState } from "react";
import {
  GITHUB_COPILOT_MODEL_RATES,
  GITHUB_COPILOT_PLANS,
  type GitHubCopilotPlan,
} from "@/lib/githubCopilotPricing";

type TokenInputs = {
  input: string;
  cachedInput: string;
  cacheWrite: string;
  output: string;
  requestsPerDay: string;
  activeDays: string;
};

const initialTokens: TokenInputs = {
  input: "12000",
  cachedInput: "6000",
  cacheWrite: "0",
  output: "1500",
  requestsPerDay: "10",
  activeDays: "21",
};

const scenarios: Array<{ label: string; values: TokenInputs }> = [
  {
    label: "Short chat",
    values: {
      input: "2500",
      cachedInput: "0",
      cacheWrite: "0",
      output: "500",
      requestsPerDay: "30",
      activeDays: "21",
    },
  },
  {
    label: "Coding task",
    values: initialTokens,
  },
  {
    label: "Agent session",
    values: {
      input: "50000",
      cachedInput: "30000",
      cacheWrite: "5000",
      output: "8000",
      requestsPerDay: "4",
      activeDays: "20",
    },
  },
];

const inputClassName =
  "mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

function readNonNegativeNumber(value: string) {
  if (value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function formatCredits(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: value > 0 && value < 1 ? 4 : 2,
  });
}

export default function GitHubCopilotCreditCalculator() {
  const [planId, setPlanId] = useState("pro");
  const [modelId, setModelId] = useState("claude-sonnet-4-6");
  const [tokens, setTokens] = useState(initialTokens);
  const [seatCount, setSeatCount] = useState("10");
  const [customAllowance, setCustomAllowance] = useState("");
  const [useAutoSelectionDiscount, setUseAutoSelectionDiscount] =
    useState(false);

  const plan = GITHUB_COPILOT_PLANS.find((item) => item.id === planId);
  const model = GITHUB_COPILOT_MODEL_RATES.find((item) => item.id === modelId);
  const input = readNonNegativeNumber(tokens.input);
  const cachedInput = readNonNegativeNumber(tokens.cachedInput);
  const cacheWrite = readNonNegativeNumber(tokens.cacheWrite);
  const output = readNonNegativeNumber(tokens.output);
  const requestsPerDay = readNonNegativeNumber(tokens.requestsPerDay);
  const activeDays = readNonNegativeNumber(tokens.activeDays);
  const seats = readNonNegativeNumber(seatCount);
  const customCredits = readNonNegativeNumber(customAllowance);
  const hasValidInputs =
    plan !== undefined &&
    model !== undefined &&
    input !== null &&
    Number.isInteger(input) &&
    cachedInput !== null &&
    Number.isInteger(cachedInput) &&
    cacheWrite !== null &&
    Number.isInteger(cacheWrite) &&
    output !== null &&
    Number.isInteger(output) &&
    requestsPerDay !== null &&
    requestsPerDay > 0 &&
    activeDays !== null &&
    activeDays > 0 &&
    Number.isInteger(activeDays) &&
    activeDays <= 31 &&
    (!plan.sharedPool ||
      (seats !== null && seats > 0 && Number.isInteger(seats))) &&
    (plan.monthlyCredits !== null ||
      (customCredits !== null && customCredits > 0 && Number.isInteger(customCredits))) &&
    (model.cacheWriteUsdPerMillion !== undefined || cacheWrite === 0);

  const monthlyAllowance =
    plan && plan.monthlyCredits !== null
      ? plan.monthlyCredits *
        (plan.sharedPool ? (seats ?? 0) : 1)
      : (customCredits ?? 0);
  const rateDiscount =
    useAutoSelectionDiscount && planId !== "free" && planId !== "student"
      ? 0.9
      : 1;
  const modelCostUsd = model
    ? ((input ?? 0) * model.inputUsdPerMillion +
        (cachedInput ?? 0) * model.cachedInputUsdPerMillion +
        (cacheWrite ?? 0) * (model.cacheWriteUsdPerMillion ?? 0) +
        (output ?? 0) * model.outputUsdPerMillion) /
      1_000_000
    : 0;
  const creditsPerInteraction = (modelCostUsd * rateDiscount) / 0.01;
  const interactionsPerMonth =
    (requestsPerDay ?? 0) * (activeDays ?? 0);
  const projectedMonthlyCredits = creditsPerInteraction * interactionsPerMonth;
  const projectedOverageCredits = Math.max(
    0,
    projectedMonthlyCredits - monthlyAllowance,
  );
  const projectedOverageUsd = projectedOverageCredits * 0.01;
  const allowancePercent =
    monthlyAllowance > 0
      ? (projectedMonthlyCredits / monthlyAllowance) * 100
      : 0;

  function updateTokens(field: keyof TokenInputs, value: string) {
    setTokens((current) => ({ ...current, [field]: value }));
  }

  function selectPlan(value: string) {
    setPlanId(value);
    if (value === "free" || value === "student") {
      setUseAutoSelectionDiscount(false);
    }
  }

  function selectModel(value: string) {
    setModelId(value);
    const selectedModel = GITHUB_COPILOT_MODEL_RATES.find(
      (item) => item.id === value,
    );
    if (selectedModel?.cacheWriteUsdPerMillion === undefined) {
      setTokens((current) => ({ ...current, cacheWrite: "0" }));
    }
  }

  return (
    <section
      aria-labelledby="github-copilot-credit-calculator-title"
      className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
          Model and token estimate
        </p>
        <h2
          id="github-copilot-credit-calculator-title"
          className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white"
        >
          Estimate GitHub Copilot credits by model
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Estimate AI credits for one interaction and your monthly workload from
          the model’s published token rates. The starting values are an editable
          example, not typical Copilot usage.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Copilot plan
          <select
            value={planId}
            onChange={(event) => selectPlan(event.target.value)}
            className={inputClassName}
          >
            {GITHUB_COPILOT_PLANS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 sm:col-span-2">
          Model and context tier
          <select
            value={modelId}
            onChange={(event) => selectModel(event.target.value)}
            className={inputClassName}
          >
            {Object.entries(
              GITHUB_COPILOT_MODEL_RATES.reduce<Record<string, typeof GITHUB_COPILOT_MODEL_RATES>>(
                (groups, item) => {
                  (groups[item.provider] ??= []).push(item);
                  return groups;
                },
                {},
              ),
            ).map(([provider, models]) => (
              <optgroup key={provider} label={provider}>
                {models.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        {plan?.monthlyCredits === null ? (
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Your monthly credit allowance
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={customAllowance}
              onChange={(event) => setCustomAllowance(event.target.value)}
              className={inputClassName}
              aria-label="Your Copilot monthly AI credit allowance"
            />
            <span className="mt-1 block text-xs font-normal leading-5 text-zinc-500 dark:text-zinc-400">
              Enter the allowance shown in your GitHub account.
            </span>
          </label>
        ) : null}

        {plan?.sharedPool ? (
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Licensed seats in the shared pool
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={seatCount}
              onChange={(event) => setSeatCount(event.target.value)}
              className={inputClassName}
              aria-label="Number of Copilot licensed seats in the shared pool"
            />
          </label>
        ) : null}

        <TokenField
          label="Uncached input tokens per interaction"
          value={tokens.input}
          onChange={(value) => updateTokens("input", value)}
        />
        <TokenField
          label="Cached input tokens per interaction"
          value={tokens.cachedInput}
          onChange={(value) => updateTokens("cachedInput", value)}
        />
        <TokenField
          label="Cache write tokens per interaction"
          value={tokens.cacheWrite}
          onChange={(value) => updateTokens("cacheWrite", value)}
          disabled={model?.cacheWriteUsdPerMillion === undefined}
          helpText={
            model?.cacheWriteUsdPerMillion === undefined
              ? "This model has no separate cache-write rate in GitHub’s table."
              : "Only include tokens the selected model writes to cache."
          }
        />
        <TokenField
          label="Output tokens per interaction"
          value={tokens.output}
          onChange={(value) => updateTokens("output", value)}
        />
        <TokenField
          label="Interactions per active day"
          value={tokens.requestsPerDay}
          onChange={(value) => updateTokens("requestsPerDay", value)}
        />
        <TokenField
          label="Active days per month"
          value={tokens.activeDays}
          onChange={(value) => updateTokens("activeDays", value)}
          max="31"
        />
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Fill the token and monthly workload fields with an example:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.label}
              type="button"
              onClick={() => setTokens(scenario.values)}
              className="min-h-9 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {planId !== "free" && planId !== "student" ? (
        <label className="mt-4 flex items-start gap-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={useAutoSelectionDiscount}
            onChange={(event) =>
              setUseAutoSelectionDiscount(event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-zinc-300 text-cyan-700 focus:ring-cyan-500"
          />
          <span>
            Apply GitHub’s 10% auto model selection discount to this model rate
            for eligible Copilot Chat, CLI, app or cloud agent usage.
          </span>
        </label>
      ) : null}

      {hasValidInputs && model && plan ? (
        <div
          className="mt-5 rounded-md border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/30"
          aria-live="polite"
          role="status"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultValue
              label="Estimated credits per interaction"
              value={formatCredits(creditsPerInteraction)}
            />
            <ResultValue
              label="Estimated AI credits per month"
              value={formatCredits(projectedMonthlyCredits)}
            />
            <ResultValue
              label={plan.sharedPool ? "Estimated shared pool" : "Included monthly credits"}
              value={formatCredits(monthlyAllowance)}
            />
            <ResultValue
              label="Possible extra usage per month"
              value={`$${projectedOverageUsd.toFixed(2)}`}
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-cyan-950 dark:text-cyan-100">
            At this example pace, the workload uses about{" "}
            <strong>{allowancePercent.toFixed(1)}%</strong> of the selected
            allowance. Potential extra usage is estimated at $0.01 per AI credit;
            your organization’s budget and billing settings determine whether it
            is charged, blocked or pooled.
          </p>
          <p className="mt-2 text-xs leading-5 text-cyan-900 dark:text-cyan-200">
            This is a token-rate projection, not a GitHub account reading. Code
            completions and next edit suggestions are excluded from AI credits.
            Copilot code review can also consume GitHub Actions minutes.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-amber-800 dark:text-amber-200" role="status">
          Enter token counts, monthly usage and a plan allowance to see the
          estimate. Unused token categories can stay at zero. Cache-write tokens
          require a model with a published cache-write rate.
        </p>
      )}

      <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        Model rates are a snapshot checked on September 23, 2026. Token volumes
        are your assumptions; actual prompt context and model calls can differ.
        See{" "}
        <a
          href="https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-cyan-800 underline decoration-cyan-300 underline-offset-4 dark:text-cyan-300 dark:decoration-cyan-800"
        >
          GitHub’s current model prices
        </a>
        {" "}before using this estimate for a budget.
      </p>
    </section>
  );
}

function TokenField({
  label,
  value,
  onChange,
  disabled = false,
  helpText,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  helpText?: string;
  max?: string;
}) {
  return (
    <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
      {label}
      <input
        type="number"
        min="0"
        max={max}
        step="1"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:disabled:bg-zinc-900`}
        disabled={disabled}
      />
      {helpText ? (
        <span className="mt-1 block text-xs font-normal leading-5 text-zinc-500 dark:text-zinc-400">
          {helpText}
        </span>
      ) : null}
    </label>
  );
}

function ResultValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-cyan-800 dark:text-cyan-200">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-cyan-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}
