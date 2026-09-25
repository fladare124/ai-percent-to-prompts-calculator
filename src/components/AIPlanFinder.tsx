"use client";

import { useState } from "react";

type Workflow = "editor" | "terminal" | "github" | "general";
type Intensity = "occasional" | "daily" | "all-day";
type Budget = 0 | 10 | 20 | 40 | 60 | 100 | 200;

type Plan = {
  id: string;
  provider: string;
  name: string;
  price: number;
  priceText: string;
  capacityTier: number;
  fit: Record<Workflow, number>;
  summary: string;
  usageNote: string;
  href: string;
};

const plans: Plan[] = [
  {
    id: "copilot-free",
    provider: "GitHub Copilot",
    name: "Free",
    price: 0,
    priceText: "$0 / month",
    capacityTier: 0,
    fit: { editor: 2, terminal: 1, github: 2, general: 0 },
    summary: "A no-cost way to try code completions and limited chat or agent use.",
    usageNote: "The free plan has monthly feature and AI-credit allowances.",
    href: "https://github.com/features/copilot/plans",
  },
  {
    id: "copilot-pro",
    provider: "GitHub Copilot",
    name: "Pro",
    price: 10,
    priceText: "$10 / month",
    capacityTier: 1,
    fit: { editor: 3, terminal: 2, github: 4, general: 1 },
    summary: "A lower-cost paid option for GitHub and IDE-centric coding workflows.",
    usageNote: "Completions and next edits differ from chat and agent credits.",
    href: "https://github.com/features/copilot/plans",
  },
  {
    id: "chatgpt-plus",
    provider: "ChatGPT + Codex",
    name: "Plus",
    price: 20,
    priceText: "$20 / month",
    capacityTier: 1,
    fit: { editor: 1, terminal: 3, github: 1, general: 4 },
    summary: "A single subscription for everyday ChatGPT work and Codex coding tasks.",
    usageNote: "Codex availability and usage depend on plan, task and model.",
    href: "https://chatgpt.com/pricing",
  },
  {
    id: "claude-pro",
    provider: "Claude + Claude Code",
    name: "Pro",
    price: 20,
    priceText: "$20 / month",
    capacityTier: 1,
    fit: { editor: 1, terminal: 4, github: 1, general: 3 },
    summary: "Claude Code in the terminal with the same subscription as Claude apps.",
    usageNote: "Claude and Claude Code share rolling session and weekly limits.",
    href: "https://claude.com/pricing",
  },
  {
    id: "cursor-pro",
    provider: "Cursor",
    name: "Pro",
    price: 20,
    priceText: "$20 / month",
    capacityTier: 1,
    fit: { editor: 4, terminal: 1, github: 1, general: 1 },
    summary: "An editor-first option with frontier models, agents and cloud agents.",
    usageNote: "Model selection affects how quickly included usage is consumed.",
    href: "https://cursor.com/pricing",
  },
  {
    id: "copilot-pro-plus",
    provider: "GitHub Copilot",
    name: "Pro+",
    price: 39,
    priceText: "$39 / month",
    capacityTier: 2,
    fit: { editor: 3, terminal: 2, github: 4, general: 1 },
    summary: "More monthly AI credits and premium model access in the GitHub workflow.",
    usageNote: "Credit use varies by selected model and interaction.",
    href: "https://github.com/features/copilot/plans",
  },
  {
    id: "copilot-max",
    provider: "GitHub Copilot",
    name: "Max",
    price: 100,
    priceText: "$100 / month",
    capacityTier: 3,
    fit: { editor: 3, terminal: 2, github: 4, general: 1 },
    summary: "A high-usage GitHub plan with the largest included AI-credit allowance.",
    usageNote: "AI-credit use still varies by model and task; extra usage can be billed separately.",
    href: "https://github.com/features/copilot/plans",
  },
  {
    id: "chatgpt-pro",
    provider: "ChatGPT + Codex",
    name: "Pro",
    price: 100,
    priceText: "$100 / month",
    capacityTier: 2,
    fit: { editor: 1, terminal: 3, github: 1, general: 4 },
    summary: "A higher-usage ChatGPT plan that includes Codex alongside general work.",
    usageNote: "OpenAI lists five times higher usage than Plus for this tier; model limits and guardrails apply.",
    href: "https://chatgpt.com/pricing",
  },
  {
    id: "claude-max",
    provider: "Claude + Claude Code",
    name: "Max 5x",
    price: 100,
    priceText: "$100 / month",
    capacityTier: 3,
    fit: { editor: 1, terminal: 4, github: 1, general: 3 },
    summary: "A higher Claude usage tier for people who use Claude throughout the day.",
    usageNote: "5x the Pro allowance per session; other usage limits can still apply.",
    href: "https://claude.com/pricing",
  },
  {
    id: "claude-max-20x",
    provider: "Claude + Claude Code",
    name: "Max 20x",
    price: 200,
    priceText: "$200 / month",
    capacityTier: 4,
    fit: { editor: 1, terminal: 4, github: 1, general: 3 },
    summary: "The highest Claude usage tier for sustained Claude and Claude Code work.",
    usageNote: "Offers 20x Pro's per-session allowance; weekly and other usage limits still apply.",
    href: "https://claude.com/pricing",
  },
  {
    id: "cursor-pro-plus",
    provider: "Cursor",
    name: "Pro+",
    price: 60,
    priceText: "$60 / month",
    capacityTier: 2,
    fit: { editor: 4, terminal: 1, github: 1, general: 1 },
    summary: "A step up for daily agent work inside Cursor's editor.",
    usageNote: "Includes three times Pro's agent limits; model costs still affect consumption.",
    href: "https://cursor.com/pricing",
  },
  {
    id: "cursor-ultra",
    provider: "Cursor",
    name: "Ultra",
    price: 200,
    priceText: "$200 / month",
    capacityTier: 4,
    fit: { editor: 4, terminal: 1, github: 1, general: 1 },
    summary: "Cursor's high-usage tier for sustained agent work in the editor.",
    usageNote: "Model costs and usage pools still affect how much work fits.",
    href: "https://cursor.com/pricing",
  },
];

const workflowOptions: Array<{ id: Workflow; label: string; help: string }> = [
  { id: "editor", label: "IDE or editor", help: "I want the agent in my coding environment." },
  { id: "terminal", label: "Terminal", help: "I mainly delegate work from the command line." },
  { id: "github", label: "GitHub workflow", help: "I work through GitHub, VS Code or pull requests." },
  { id: "general", label: "Work + coding", help: "I want one subscription for coding and general tasks." },
];

const budgetOptions: Array<{ value: Budget; label: string }> = [
  { value: 0, label: "Free only" },
  { value: 10, label: "Up to $10 / month" },
  { value: 20, label: "Up to $20 / month" },
  { value: 40, label: "Up to $40 / month" },
  { value: 60, label: "Up to $60 / month" },
  { value: 100, label: "Up to $100 / month" },
  { value: 200, label: "$200 / month if it is worth it" },
];

const intensityOptions: Array<{ id: Intensity; label: string; help: string }> = [
  { id: "occasional", label: "Occasional", help: "A few tasks each week" },
  { id: "daily", label: "Daily", help: "A regular part of my workday" },
  { id: "all-day", label: "Heavy", help: "Long sessions or agents most of the day" },
];

const workflowNames: Record<Workflow, string> = {
  editor: "an IDE or editor workflow",
  terminal: "terminal-based coding",
  github: "GitHub and pull-request workflows",
  general: "a mix of coding and general work",
};

function scorePlan(plan: Plan, workflow: Workflow, intensity: Intensity) {
  const desiredTier = intensity === "occasional" ? 0 : intensity === "daily" ? 1 : 4;
  const capacityFit = 4 - Math.min(4, Math.abs(plan.capacityTier - desiredTier));
  const intensityWeight = intensity === "occasional" ? 1 : intensity === "daily" ? 1.5 : 2;
  return plan.fit[workflow] * 5 + capacityFit * intensityWeight - plan.price / 100;
}

function rankPlans(budget: Budget, workflow: Workflow, intensity: Intensity) {
  return plans
    .filter((plan) => plan.price <= budget)
    .sort((a, b) => {
      const scoreDifference = scorePlan(b, workflow, intensity) - scorePlan(a, workflow, intensity);
      return scoreDifference || a.price - b.price;
    });
}

export default function AIPlanFinder() {
  const [workflow, setWorkflow] = useState<Workflow>("editor");
  const [budget, setBudget] = useState<Budget>(20);
  const [intensity, setIntensity] = useState<Intensity>("daily");
  const ranked = rankPlans(budget, workflow, intensity);
  const recommendation = ranked[0];
  const alternatives = ranked.slice(1, 3);

  return (
    <section id="finder" className="scroll-mt-6 rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="grid gap-9 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-[11px]">01</span>
            Your shortlist
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">What does your week look like?</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Pick the setup you want. You can change any answer and compare the result instantly.</p>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Where do you do most of your coding?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {workflowOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={workflow === option.id}
                  onClick={() => setWorkflow(option.id)}
                  className={`rounded-xl border p-3 text-left transition ${workflow === option.id ? "border-cyan-700 bg-cyan-50 ring-1 ring-cyan-700" : "border-zinc-200 bg-white hover:border-zinc-400"}`}
                >
                  <span className="block text-sm font-semibold">{option.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500">{option.help}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Monthly budget
              <select
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value) as Budget)}
                className="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm font-medium text-zinc-900 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend className="text-sm font-semibold">How often will you use agents?</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {intensityOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={intensity === option.id}
                    onClick={() => setIntensity(option.id)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${intensity === option.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{intensityOptions.find((option) => option.id === intensity)?.help}</p>
            </fieldset>
          </div>
        </div>

        <div aria-live="polite" className="rounded-2xl bg-zinc-950 p-5 text-white sm:p-7">
          {recommendation ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">Best fit within your budget</p>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300">For {workflowNames[workflow]}</span>
              </div>
              <h3 className="mt-5 text-3xl font-semibold tracking-tight">{recommendation.provider} {recommendation.name}</h3>
              <p className="mt-1 text-sm font-medium text-cyan-200">{recommendation.priceText}</p>
              <p className="mt-4 text-sm leading-6 text-zinc-300">{recommendation.summary}</p>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Check before you subscribe</p>
                <p className="mt-2 text-sm leading-6 text-zinc-200">{recommendation.usageNote}</p>
              </div>
              {intensity === "all-day" && recommendation.capacityTier < 3 ? (
                <p className="mt-4 rounded-lg bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100">You selected heavy use. This is the closest fit within your budget, but it may still hit its plan limits. Try it on your real workload and review the account usage meter before upgrading.</p>
              ) : null}
              <a href={recommendation.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200">
                Check official plan <span aria-hidden="true">↗</span>
              </a>
              {alternatives.length > 0 ? (
                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Also compare</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {alternatives.map((plan) => (
                      <a key={plan.id} href={plan.href} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 p-3 transition hover:border-cyan-300/60">
                        <span className="block text-sm font-semibold">{plan.provider} {plan.name}</span>
                        <span className="mt-1 block text-xs text-zinc-400">{plan.priceText}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-zinc-300">Choose a higher budget to see plans that fit.</p>
          )}
        </div>
      </div>
      <p className="mt-6 border-t border-zinc-100 pt-4 text-xs leading-5 text-zinc-500">
        The ranking is a starting point based on published features and your answers. It does not read your account, compare private plan limits or guarantee a task count.
      </p>
    </section>
  );
}
