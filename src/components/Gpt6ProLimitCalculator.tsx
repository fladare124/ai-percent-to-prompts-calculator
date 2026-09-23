"use client";

import { useState } from "react";

type PlanId = "pro-100" | "pro-200" | "business-standard" | "business-premium";

const plans: Array<{ id: PlanId; label: string }> = [
  { id: "pro-100", label: "ChatGPT Pro $100" },
  { id: "pro-200", label: "ChatGPT Pro $200" },
  { id: "business-standard", label: "ChatGPT Business Standard" },
  { id: "business-premium", label: "ChatGPT Business Premium" },
];

const fieldClassName =
  "mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

export default function Gpt6ProLimitCalculator() {
  const [plan, setPlan] = useState<PlanId>("pro-100");
  const [periodUsed, setPeriodUsed] = useState("");
  const [todayUsed, setTodayUsed] = useState("");

  const hasPeriodValue = periodUsed.trim() !== "";
  const periodCount = Number(periodUsed);
  const todayCount = Number(todayUsed);
  const isPro200 = plan === "pro-200";
  const validPeriodCount =
    hasPeriodValue && Number.isInteger(periodCount) && periodCount >= 0;
  const validTodayCount =
    !isPro200 ||
    (todayUsed.trim() !== "" && Number.isInteger(todayCount) && todayCount >= 0);

  let remaining: number | null = null;
  let limitDescription = "";

  if (validPeriodCount && validTodayCount) {
    if (plan === "pro-100") {
      remaining = Math.max(0, 50 - periodCount);
      limitDescription = "of the shared 50-message weekly allowance";
    } else if (plan === "pro-200") {
      remaining = Math.min(
        Math.max(0, 200 - periodCount),
        Math.max(0, 200 - todayCount),
      );
      limitDescription =
        "under both the 200-message weekly limit and 200-message daily shared limit";
    } else if (plan === "business-standard") {
      remaining = Math.max(0, 15 - periodCount);
      limitDescription = "of the shared 15-message monthly allowance";
    } else {
      remaining = Math.max(0, 50 - periodCount);
      limitDescription = "of the shared 50-message weekly allowance";
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 border-t-4 border-t-cyan-400 bg-white shadow-[0_18px_50px_-30px_rgba(24,24,27,0.35)] dark:border-zinc-800 dark:border-t-cyan-500 dark:bg-zinc-900 dark:shadow-none">
      <div className="border-b border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-6">
        <p className="text-base font-semibold text-zinc-950 dark:text-white">
          Calculate your GPT-6 Pro allowance
        </p>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Choose your plan and enter the Pro-model messages you have already used.
          The calculator applies the published shared limits; it does not connect
          to your ChatGPT account.
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:p-7">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            ChatGPT plan
            <select
              aria-label="ChatGPT plan for the GPT-6 Pro limit calculator"
              value={plan}
              onChange={(event) => {
                setPlan(event.target.value as PlanId);
                setPeriodUsed("");
                setTodayUsed("");
              }}
              className={fieldClassName}
            >
              {plans.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {isPro200
              ? "GPT-6 Pro messages used this week"
              : `GPT-6 Pro + GPT-5.6 Sol Pro messages used this ${plan === "business-standard" ? "month" : "week"}`}
            <input
              aria-label={
                isPro200
                  ? "GPT-6 Pro messages used this week"
                  : "Shared GPT Pro-model messages used in this allowance period"
              }
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={periodUsed}
              onChange={(event) => setPeriodUsed(event.target.value)}
              className={fieldClassName}
              placeholder="Enter a whole number"
            />
          </label>

          {isPro200 ? (
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              GPT-6 Pro + GPT-5.6 Sol Pro messages used today
              <input
                aria-label="GPT-6 Pro and GPT-5.6 Sol Pro messages used today"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={todayUsed}
                onChange={(event) => setTodayUsed(event.target.value)}
                className={fieldClassName}
                placeholder="Enter a whole number"
              />
              <span className="mt-1 block text-xs font-normal leading-5 text-zinc-500 dark:text-zinc-400">
                The Pro $200 plan also caps the two Pro models together at 200
                messages per day.
              </span>
            </label>
          ) : null}
        </div>

        <div className="flex min-h-48 flex-col justify-center rounded-md border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900/60 dark:bg-cyan-950/30">
          {remaining === null ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-800 dark:text-cyan-200">
                Your result
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-950 dark:text-cyan-100">
                Enter your usage above to see how many published GPT-6 Pro
                messages remain.
              </p>
            </>
          ) : (
            <div aria-live="polite" role="status">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-800 dark:text-cyan-200">
                Estimated messages left
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-cyan-950 dark:text-white">
                {remaining}
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-950 dark:text-cyan-100">
                {limitDescription}.
              </p>
              {remaining === 0 ? (
                <p className="mt-3 text-sm font-medium text-cyan-950 dark:text-cyan-100">
                  This allowance is used up. ChatGPT shows the applicable reset
                  time in your account.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <p className="border-t border-zinc-200 px-5 py-4 text-xs leading-5 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:px-6">
        The calculation uses the message counts you enter and OpenAI’s published
        limits. It cannot see credits or workspace settings in your account. For
        Pro $200, the result is the lower of your weekly GPT-6 Pro balance and
        the daily shared Pro-model balance. Last checked September 23, 2026.
      </p>
    </section>
  );
}
