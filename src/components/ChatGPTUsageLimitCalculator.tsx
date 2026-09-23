"use client";

import { useState } from "react";
import {
  chatGPTModelRanges,
  chatGPTPlans,
  type ChatGPTPlanKey,
} from "@/lib/chatgptUsageRanges";

const fieldClassName =
  "mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function ChatGPTUsageLimitCalculator() {
  const [plan, setPlan] = useState<ChatGPTPlanKey>("plus");
  const [model, setModel] = useState(chatGPTModelRanges[0].model);
  const [remainingPercent, setRemainingPercent] = useState("");

  const modelRange = chatGPTModelRanges.find((item) => item.model === model)!;
  const rawPercent = Number(remainingPercent);
  const hasPercent = remainingPercent.trim() !== "";
  const validPercent =
    hasPercent && Number.isFinite(rawPercent) && rawPercent >= 0 && rawPercent <= 100;
  const fullRange = modelRange.plans[plan];
  const lowRemaining = validPercent
    ? Math.floor((fullRange.low * rawPercent) / 100)
    : null;
  const highRemaining = validPercent
    ? Math.ceil((fullRange.high * rawPercent) / 100)
    : null;

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 border-t-4 border-t-cyan-400 bg-white shadow-[0_18px_50px_-30px_rgba(24,24,27,0.35)] dark:border-zinc-800 dark:border-t-cyan-500 dark:bg-zinc-900 dark:shadow-none">
      <div className="border-b border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-6">
        <p className="text-base font-semibold text-zinc-950 dark:text-white">
          Estimate ChatGPT Work and Codex messages left
        </p>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Choose the plan and model, then enter the remaining percentage shown
          in your usage dashboard. The result scales OpenAI’s published local
          message range for one five-hour period.
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:p-7">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Plan
            <select
              aria-label="ChatGPT Work and Codex plan"
              value={plan}
              onChange={(event) => setPlan(event.target.value as ChatGPTPlanKey)}
              className={fieldClassName}
            >
              {chatGPTPlans.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Model
            <select
              aria-label="ChatGPT Work and Codex model"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className={fieldClassName}
            >
              {chatGPTModelRanges.map((option) => (
                <option key={option.model} value={option.model}>
                  {option.model}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Usage remaining (%)
            <input
              aria-label="ChatGPT usage percentage remaining"
              type="number"
              min="0"
              max="100"
              step="1"
              inputMode="decimal"
              value={remainingPercent}
              onChange={(event) => setRemainingPercent(event.target.value)}
              className={fieldClassName}
              placeholder="For example, 60"
            />
            <span className="mt-1 block text-xs font-normal leading-5 text-zinc-500 dark:text-zinc-400">
              Enter the amount left, not the amount already used. If the
              dashboard only shows used percentage, subtract it from 100.
            </span>
          </label>
        </div>

        <div className="flex min-h-48 flex-col justify-center rounded-md border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900/60 dark:bg-cyan-950/30">
          {lowRemaining === null || highRemaining === null ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-800 dark:text-cyan-200">
                Estimated messages left
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-950 dark:text-cyan-100">
                Enter a remaining percentage from 0 to 100 to see an estimated
                range for this five-hour period.
              </p>
            </>
          ) : (
            <div aria-live="polite" role="status">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-800 dark:text-cyan-200">
                Estimated local messages left
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-cyan-950 dark:text-white">
                {formatCount(lowRemaining)}–{formatCount(highRemaining)}
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-950 dark:text-cyan-100">
                Approximate range in a five-hour window for {model} on the {chatGPTPlans.find((item) => item.key === plan)?.label} plan.
              </p>
              {rawPercent === 0 ? (
                <p className="mt-3 text-sm font-medium text-cyan-950 dark:text-cyan-100">
                  Your entered remaining percentage is 0%.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-200 px-5 py-4 text-xs leading-5 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:px-6">
        OpenAI publishes a range, not a fixed message cap. This estimate
        multiplies that range by your percentage, which may not match how your
        account meter changes: task length, context, reasoning and tools affect
        usage. Check your dashboard for the actual balance and reset time.
      </div>

      <div className="border-t border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
          Published local messages per five-hour period
        </h2>
        <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
          These are OpenAI’s estimates for local messages, not guaranteed caps.
          The table helps compare the plan ranges used by this calculator.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                <th scope="col" className="px-2 py-2 font-semibold">Model</th>
                {chatGPTPlans.map((item) => (
                  <th key={item.key} scope="col" className="px-2 py-2 font-semibold">
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chatGPTModelRanges.map((item) => (
                <tr key={item.model} className="border-b border-zinc-100 text-zinc-700 last:border-0 dark:border-zinc-800 dark:text-zinc-300">
                  <th scope="row" className="whitespace-nowrap px-2 py-2 font-medium">{item.model}</th>
                  {chatGPTPlans.map((planOption) => {
                    const range = item.plans[planOption.key];
                    return (
                      <td key={planOption.key} className="whitespace-nowrap px-2 py-2">
                        {formatCount(range.low)}–{formatCount(range.high)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
