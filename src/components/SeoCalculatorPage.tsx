import Link from "next/link";
import UsageEstimator from "@/components/UsageEstimator";
import { DISCLAIMER } from "@/lib/estimation";
import type { PlatformName } from "@/types";

interface SeoCalculatorPageProps {
  h1: string;
  intro: string;
  platformFocus?: PlatformName;
  extraFaq?: Array<{ question: string; answer: string }>;
}

const links = [
  { href: "/claude-usage-calculator", label: "Claude Usage Calculator" },
  { href: "/codex-usage-calculator", label: "Codex Usage Calculator" },
  { href: "/chatgpt-limit-calculator", label: "ChatGPT Limit Calculator" },
  { href: "/gemini-usage-calculator", label: "Gemini Usage Calculator" },
  { href: "/perplexity-usage-calculator", label: "Perplexity Usage Calculator" },
  { href: "/cursor-usage-calculator", label: "Cursor Usage Calculator" },
  {
    href: "/windsurf-devin-usage-calculator",
    label: "Windsurf / Devin Usage Calculator",
  },
];

const globalFaq = [
  {
    question: "Does this calculate exact tokens?",
    answer:
      "No. It estimates prompts, tasks, messages or usage units from your remaining percentage.",
  },
  {
    question: "Why is it approximate?",
    answer:
      "AI platforms use dynamic limits based on plan, model, system capacity, context, files and task complexity.",
  },
  {
    question: "What does remaining percentage mean?",
    answer:
      "It is the percentage the platform shows as remaining, not the percentage already used.",
  },
  {
    question: "Is this official?",
    answer: "No. It is an independent estimator.",
  },
];

export default function SeoCalculatorPage({
  h1,
  intro,
  platformFocus,
  extraFaq = [],
}: SeoCalculatorPageProps) {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Unofficial calculator
            </p>
            <span className="mt-3 inline-flex rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              Now supports Claude Fable 5
            </span>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 dark:text-white sm:text-5xl">
              {h1}
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
            {intro}
          </p>
        </header>

        <UsageEstimator platformFocus={platformFocus} />

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
              FAQ
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Quick answers about how the estimator treats remaining percentage,
              reset windows and unofficial AI usage ranges.
            </p>
          </div>
          <div className="space-y-3">
            {[...extraFaq, ...globalFaq].map((item) => (
              <details
                key={item.question}
                className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <summary className="cursor-pointer text-sm font-semibold text-zinc-950 dark:text-white">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="grid gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
            Other calculators
          </h2>
          <nav className="flex flex-wrap gap-2" aria-label="Internal links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </section>

        <p className="border-t border-zinc-200 pt-6 text-xs leading-5 text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          {DISCLAIMER}
        </p>
      </div>
    </main>
  );
}
