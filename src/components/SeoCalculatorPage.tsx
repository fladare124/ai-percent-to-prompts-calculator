import Link from "next/link";
import type { ReactNode } from "react";
import UsageEstimator from "@/components/UsageEstimator";
import { DISCLAIMER } from "@/lib/estimation";
import type { PlatformName } from "@/types";

interface SeoCalculatorPageProps {
  h1: string;
  intro: string;
  calculator?: ReactNode;
  platformFocus?: PlatformName;
  productFocus?: "ChatGPT chat" | "Codex";
  extraTool?: ReactNode;
  guide?: ProviderGuide;
  extraFaq?: Array<{ question: string; answer: string }>;
}

interface ProviderGuide {
  title: string;
  summary: string;
  points: string[];
  sources: Array<{ label: string; href: string }>;
}

const links = [
  { href: "/", label: "AI Usage Limit Calculator" },
  {
    href: "/chatgpt-limit-calculator",
    label: "ChatGPT & GPT-6 Pro Limit Calculator",
  },
  { href: "/codex-usage-calculator", label: "Codex Usage Calculator" },
  { href: "/claude-usage-calculator", label: "Claude Usage Calculator" },
  { href: "/gemini-usage-calculator", label: "Gemini Usage Calculator" },
  { href: "/perplexity-usage-calculator", label: "Perplexity Usage Calculator" },
  { href: "/cursor-usage-calculator", label: "Cursor Usage Calculator" },
  {
    href: "/windsurf-devin-usage-calculator",
    label: "Windsurf / Devin Usage Calculator",
  },
];

const popularLinks = [
  {
    href: "/chatgpt-limit-calculator",
    label: "GPT-6 Pro message limit",
    text: "Check the published weekly or monthly allowance and shared Pro-model usage.",
  },
  {
    href: "/codex-usage-calculator",
    label: "Codex usage until reset",
    text: "Estimate tasks and compare your usage pace with the next reset.",
  },
  {
    href: "/claude-usage-calculator",
    label: "Claude usage until reset",
    text: "Estimate remaining messages and compare your usage pace with the next reset.",
  },
  {
    href: "/gemini-usage-calculator",
    label: "Gemini usage until refresh",
    text: "Compare your Gemini Usage Limits reading with recent pace and reset time.",
  },
  {
    href: "/cursor-usage-calculator",
    label: "Cursor usage pools",
    text: "Compare Cursor Models and Other Models balances with your recent usage pace.",
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

const estimateSteps = [
  {
    title: "Start With Percent Left",
    text: "Use the remaining percentage your AI tool shows, not the percentage already used.",
  },
  {
    title: "Match The Window",
    text: "Choose the reset window, plan and platform so the estimate uses the closest preset.",
  },
  {
    title: "Read Human Units",
    text: "See estimated Codex tasks, ChatGPT messages, Claude messages or similar usage labels.",
  },
];

export default function SeoCalculatorPage({
  h1,
  intro,
  calculator,
  platformFocus,
  productFocus,
  extraTool,
  guide,
  extraFaq = [],
}: SeoCalculatorPageProps) {
  const isOverviewPage = !platformFocus && !calculator;
  const faqItems = isOverviewPage ? [...extraFaq, ...globalFaq] : extraFaq;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Usage Limit Calculator",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <BrandMark />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                  Unofficial calculator
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Percent in. Human estimate out.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200">
                Free to use
              </span>
              <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                No sign-in
              </span>
              <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                Estimate only
              </span>
            </div>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight text-zinc-950 dark:text-white sm:text-5xl">
            {h1}
          </h1>
          <p className="mt-4 max-w-3xl border-l-2 border-cyan-400 pl-4 text-base leading-7 text-zinc-700 dark:border-cyan-500 dark:text-zinc-300">
            {intro}
          </p>
        </header>

        {calculator ?? (
          <UsageEstimator
            platformFocus={platformFocus}
            productFocus={productFocus}
          />
        )}

        {extraTool}

        {guide ? <ProviderGuideSection guide={guide} /> : null}

        {isOverviewPage ? (
          <>
            <section className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                  Calculators
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
                  Choose your AI platform
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Each provider tracks usage differently. Select the matching calculator and reset window to get a relevant planning estimate.
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {popularLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group rounded-md border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-cyan-800"
                  >
                    <span className="block text-sm font-semibold text-zinc-950 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                      {link.label}
                    </span>
                    <span className="mt-2 block text-sm leading-5 text-zinc-600 dark:text-zinc-400">
                      {link.text}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="grid gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
                  How the estimate works
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  The calculator multiplies a reference amount for your selected plan and reset window by the remaining percentage and model or task factors. Those reference amounts are independent estimates, not live or guaranteed provider limits. The result includes an uncertainty range, and you can add two recent readings below the estimate to calculate your own usage pace.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {estimateSteps.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {faqItems.length > 0 ? (
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
            {faqItems.map((item) => (
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
        ) : null}

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

function ProviderGuideSection({ guide }: { guide: ProviderGuide }) {
  return (
    <section className="grid gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
          Platform guide
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
          {guide.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {guide.summary}
        </p>
      </div>
      <div>
        <ul className="space-y-3">
          {guide.points.map((point) => (
            <li
              key={point}
              className="rounded-md border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Check the provider’s current usage rules
          </h3>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {guide.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-cyan-800 underline decoration-cyan-300 underline-offset-4 hover:text-cyan-600 dark:text-cyan-300 dark:decoration-cyan-800"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-11 w-11 shrink-0 rounded-lg"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="14" className="fill-zinc-950 dark:fill-white" />
      <path
        d="M17 41.5 31.5 22l8.5 11.5 7-8.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        className="text-cyan-300 dark:text-cyan-600"
      />
      <g className="fill-white dark:fill-zinc-950">
        <circle cx="18" cy="42" r="4" />
        <circle cx="32" cy="22" r="4" />
        <circle cx="40" cy="34" r="4" />
        <circle cx="47" cy="25" r="4" />
      </g>
    </svg>
  );
}
