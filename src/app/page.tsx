import type { Metadata } from "next";
import Link from "next/link";
import AIPlanFinder from "@/components/AIPlanFinder";

export const metadata: Metadata = {
  title: "AI Coding Plan Finder: Compare Claude, Codex, Cursor & Copilot",
  description:
    "Compare Claude Code, Codex, Cursor and GitHub Copilot prices, usage limits and reset patterns, then find a plan that fits your coding workflow and budget.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Coding Plan Finder: Compare Claude, Codex, Cursor & Copilot",
    description:
      "Find a coding assistant plan that fits your tools, workload and monthly budget.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Coding Plan Finder",
    description:
      "Compare AI coding plans by workflow, usage style and monthly budget.",
    images: ["/opengraph-image"],
  },
};

const faq = [
  {
    question: "Which AI coding plan gives the most usage for $20?",
    answer:
      "There is no fair universal count of coding tasks or prompts across plans. At around $20 per month, ChatGPT Plus combines general ChatGPT access with Codex, Claude Pro includes Claude Code, and Cursor Pro focuses on agentic work in its editor. Pick by workflow, then check the usage meter for your own account.",
  },
  {
    question: "Does ChatGPT Plus include Codex?",
    answer:
      "OpenAI currently lists Codex as part of ChatGPT plans including Plus. The available models and amount of usage depend on the plan, task, model and account. Check the current plan page before subscribing.",
  },
  {
    question: "Does Claude Pro include Claude Code?",
    answer:
      "Anthropic currently includes Claude Code with paid Pro and Max plans. Claude and Claude Code share plan usage, and the number of tasks varies with model, task size and other factors.",
  },
  {
    question: "Can I compare AI plans by a fixed number of prompts?",
    answer:
      "Not reliably. Providers meter usage differently, and longer agent tasks can consume very different amounts. This finder compares published plan features and your stated workflow; it does not promise a fixed number of messages or tasks.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const applicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Coding Plan Finder",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="AI Plan Finder home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-lg font-bold text-cyan-300">
              P
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight">AI Plan Finder</span>
              <span className="block text-xs text-zinc-500">A Percent to Prompts project</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-zinc-600" aria-label="Main navigation">
            <a href="#compare" className="transition hover:text-zinc-950">Compare plans</a>
            <a href="#method" className="transition hover:text-zinc-950">How we compare</a>
            <Link href="/ai-usage-calculator" className="transition hover:text-zinc-950">Usage calculator</Link>
          </nav>
        </header>

        <section className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-900">
              Independent plan finder · Updated September 25, 2026
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
              Pick an AI coding plan that fits your work.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
              Compare Claude Code, Codex, Cursor and GitHub Copilot by your workflow, workload and monthly budget. Get a practical shortlist without pretending every plan gives the same number of prompts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#finder" className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
                Find my plan
              </a>
              <a href="#compare" className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-500">
                See the comparison
              </a>
            </div>
            <p className="mt-5 text-xs leading-5 text-zinc-500">
              Free to use. No account connection. Prices are public list prices and can vary by country, tax and billing term.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-cyan-200/70 via-transparent to-amber-100/70 blur-xl" />
            <div className="relative rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_24px_80px_-40px_rgba(24,24,27,0.35)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Three quick inputs</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">Get your shortlist</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">No sign-in</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Start with the way you code. The finder ranks plans that fit your budget and points out what to verify before upgrading.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium">IDE / editor</span>
                <span className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium">Terminal</span>
                <span className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium">GitHub workflow</span>
                <span className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium">General work + code</span>
              </div>
              <div className="mt-6 border-t border-zinc-100 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-700">The comparison starts with your needs</span>
                  <span className="text-zinc-400">01 / 03</span>
                </div>
                <div className="mt-3 flex gap-1.5" aria-hidden="true">
                  <span className="h-1.5 flex-1 rounded-full bg-cyan-500" />
                  <span className="h-1.5 flex-1 rounded-full bg-zinc-200" />
                  <span className="h-1.5 flex-1 rounded-full bg-zinc-200" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <AIPlanFinder />

        <section id="compare" className="scroll-mt-8 border-t border-zinc-200 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Plans at a glance</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Compare the plans people actually use for coding</h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Monthly prices below are the providers’ US list prices checked on September 25, 2026. Each plan meters usage differently, so compare the workflow and included features before comparing capacity.
            </p>
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Plan</th>
                    <th className="px-5 py-4 font-semibold">Monthly price</th>
                    <th className="px-5 py-4 font-semibold">Strongest fit</th>
                    <th className="px-5 py-4 font-semibold">Usage model</th>
                    <th className="px-5 py-4 font-semibold">Provider details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <th className="px-5 py-4 font-semibold">GitHub Copilot Free</th>
                    <td className="px-5 py-4">$0</td>
                    <td className="px-5 py-4 text-zinc-600">Try completions and limited chat or agent use</td>
                    <td className="px-5 py-4 text-zinc-600">Monthly AI credit allowance</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://github.com/features/copilot/plans" target="_blank" rel="noreferrer">Copilot plans</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">GitHub Copilot Pro</th>
                    <td className="px-5 py-4">$10</td>
                    <td className="px-5 py-4 text-zinc-600">VS Code, GitHub and agent workflows on a lower budget</td>
                    <td className="px-5 py-4 text-zinc-600">Completions plus AI credits for chat and agents</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://github.com/features/copilot/plans" target="_blank" rel="noreferrer">Copilot plans</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">GitHub Copilot Pro+</th>
                    <td className="px-5 py-4">$39</td>
                    <td className="px-5 py-4 text-zinc-600">Premium models and more GitHub agent use</td>
                    <td className="px-5 py-4 text-zinc-600">Larger monthly AI-credit allowance</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://github.com/features/copilot/plans" target="_blank" rel="noreferrer">Copilot plans</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">GitHub Copilot Max</th>
                    <td className="px-5 py-4">$100</td>
                    <td className="px-5 py-4 text-zinc-600">Sustained, high-volume work across GitHub and IDEs</td>
                    <td className="px-5 py-4 text-zinc-600">Highest included AI-credit allowance</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://github.com/features/copilot/plans" target="_blank" rel="noreferrer">Copilot plans</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">ChatGPT Plus with Codex</th>
                    <td className="px-5 py-4">$20</td>
                    <td className="px-5 py-4 text-zinc-600">One subscription for general ChatGPT work and coding</td>
                    <td className="px-5 py-4 text-zinc-600">Plan usage varies with task and model</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://chatgpt.com/pricing" target="_blank" rel="noreferrer">ChatGPT pricing</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">ChatGPT Pro with Codex</th>
                    <td className="px-5 py-4">$100</td>
                    <td className="px-5 py-4 text-zinc-600">Frequent ChatGPT and Codex use across a workday</td>
                    <td className="px-5 py-4 text-zinc-600">OpenAI lists 5x Plus usage; model limits still apply</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://chatgpt.com/pricing" target="_blank" rel="noreferrer">ChatGPT pricing</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">Claude Pro with Claude Code</th>
                    <td className="px-5 py-4">$20 monthly</td>
                    <td className="px-5 py-4 text-zinc-600">Claude in the terminal plus the web and desktop apps</td>
                    <td className="px-5 py-4 text-zinc-600">Shared five-hour and weekly limits</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://claude.com/pricing" target="_blank" rel="noreferrer">Claude pricing</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">Claude Max 5x</th>
                    <td className="px-5 py-4">$100</td>
                    <td className="px-5 py-4 text-zinc-600">Regular Claude Code and Claude use throughout the day</td>
                    <td className="px-5 py-4 text-zinc-600">5x Pro's session allowance; weekly limits apply</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://claude.com/pricing" target="_blank" rel="noreferrer">Claude pricing</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">Claude Max 20x</th>
                    <td className="px-5 py-4">$200</td>
                    <td className="px-5 py-4 text-zinc-600">Heavy Claude Code use across long work sessions</td>
                    <td className="px-5 py-4 text-zinc-600">20x Pro's session allowance; weekly limits apply</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://claude.com/pricing" target="_blank" rel="noreferrer">Claude pricing</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">Cursor Pro</th>
                    <td className="px-5 py-4">$20</td>
                    <td className="px-5 py-4 text-zinc-600">Agent-first work inside Cursor’s editor</td>
                    <td className="px-5 py-4 text-zinc-600">Model choice affects how included usage is consumed</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://cursor.com/pricing" target="_blank" rel="noreferrer">Cursor pricing</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">Cursor Pro+</th>
                    <td className="px-5 py-4">$60</td>
                    <td className="px-5 py-4 text-zinc-600">Daily agent use in Cursor</td>
                    <td className="px-5 py-4 text-zinc-600">3x Pro agent limits; model choice affects usage</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://cursor.com/pricing" target="_blank" rel="noreferrer">Cursor pricing</a></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">Cursor Ultra</th>
                    <td className="px-5 py-4">$200</td>
                    <td className="px-5 py-4 text-zinc-600">Heavy, sustained agent work in Cursor</td>
                    <td className="px-5 py-4 text-zinc-600">20x Pro agent limits; model choice affects usage</td>
                    <td className="px-5 py-4"><a className="font-medium text-cyan-800 underline underline-offset-4" href="https://cursor.com/pricing" target="_blank" rel="noreferrer">Cursor pricing</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Pricing and plan features change. Higher tiers exist for heavy use, but a higher price does not translate into a universal count of coding tasks. Confirm your local checkout price and current usage meter before you buy.
          </p>
        </section>

        <section className="mt-12 border-t border-zinc-200 pt-12 sm:mt-16 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Usage and reset patterns</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">The same monthly price can buy very different usage</h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              A coding request is not a shared unit across these services. Compare what each plan meters, when its allowance refreshes and what happens when you reach the limit.
            </p>
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Service</th>
                    <th className="px-5 py-4 font-semibold">What usage means</th>
                    <th className="px-5 py-4 font-semibold">Reset or billing pattern</th>
                    <th className="px-5 py-4 font-semibold">Personal calculator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      <a className="text-cyan-800 underline underline-offset-4" href="https://github.com/features/copilot/plans" target="_blank" rel="noreferrer">GitHub Copilot</a>
                    </th>
                    <td className="px-5 py-4 text-zinc-600">AI credits are used by chat, agents and CLI; model and task affect the credit cost. Paid code completions are separate.</td>
                    <td className="px-5 py-4 text-zinc-600">Monthly credit allowance. Current usage and any extra-usage setting appear in your account.</td>
                    <td className="px-5 py-4"><Link className="font-medium text-cyan-800 underline underline-offset-4" href="/github-copilot-usage-calculator">Copilot credit planner</Link></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      <a className="text-cyan-800 underline underline-offset-4" href="https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan" target="_blank" rel="noreferrer">OpenAI Codex</a>
                    </th>
                    <td className="px-5 py-4 text-zinc-600">Plan allowance or credits vary with model, task size, context and where the task runs.</td>
                    <td className="px-5 py-4 text-zinc-600">The account dashboard shows your active balance and reset. Some plans also use separate time windows.</td>
                    <td className="px-5 py-4"><Link className="font-medium text-cyan-800 underline underline-offset-4" href="/codex-usage-calculator">Codex task and reset planner</Link></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      <a className="text-cyan-800 underline underline-offset-4" href="https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work" target="_blank" rel="noreferrer">Claude Code</a>
                    </th>
                    <td className="px-5 py-4 text-zinc-600">Claude Code shares Claude’s pool across web, desktop and mobile. Model, context and effort change consumption.</td>
                    <td className="px-5 py-4 text-zinc-600">Rolling five-hour sessions; paid plans also have weekly limits. Check your account for its current reset.</td>
                    <td className="px-5 py-4"><Link className="font-medium text-cyan-800 underline underline-offset-4" href="/claude-usage-calculator">Claude usage planner</Link></td>
                  </tr>
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      <a className="text-cyan-800 underline underline-offset-4" href="https://cursor.com/docs/models-and-pricing" target="_blank" rel="noreferrer">Cursor</a>
                    </th>
                    <td className="px-5 py-4 text-zinc-600">Separate model pools; third-party model use is charged at that model’s API rate.</td>
                    <td className="px-5 py-4 text-zinc-600">Pools refresh with the monthly billing cycle; paid on-demand usage is available after included usage.</td>
                    <td className="px-5 py-4"><Link className="font-medium text-cyan-800 underline underline-offset-4" href="/cursor-usage-calculator">Cursor pool planner</Link></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Sources: <a className="underline underline-offset-2" href="https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals" target="_blank" rel="noreferrer">GitHub billing</a>, <a className="underline underline-offset-2" href="https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan" target="_blank" rel="noreferrer">OpenAI Codex usage</a>, <a className="underline underline-offset-2" href="https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work" target="_blank" rel="noreferrer">Claude usage limits</a> and <a className="underline underline-offset-2" href="https://cursor.com/docs/models-and-pricing" target="_blank" rel="noreferrer">Cursor usage pools</a>. Checked September 25, 2026.
          </p>
        </section>

        <section id="method" className="mt-12 grid gap-8 rounded-3xl bg-zinc-950 p-7 text-white sm:mt-16 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">How we compare</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Features are comparable. Task counts usually are not.</h2>
          </div>
          <div className="space-y-4 text-sm leading-6 text-zinc-300">
            <p>Claude, Codex, Cursor and Copilot meter different products in different ways. A completion, an agent turn and a multi-file coding task are not equivalent units.</p>
            <p>We rank plans by workflow fit, monthly budget and expected intensity. We link to official plan pages and avoid promising a fixed number of prompts when the provider does not publish one.</p>
            <p>For your own account, compare two usage-meter readings after similar work. <Link className="font-semibold text-cyan-300 underline underline-offset-4" href="/ai-usage-calculator">Use the personal usage calculator</Link> to estimate your own pace.</p>
          </div>
        </section>

        <section className="mt-12 grid gap-8 border-t border-zinc-200 pt-12 sm:mt-16 sm:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Questions</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Choosing an AI coding subscription</h2>
          </div>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-xl border border-zinc-200 bg-white p-5">
                <summary className="cursor-pointer list-none pr-6 text-base font-semibold marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-xl font-normal text-zinc-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-14 flex flex-col gap-4 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Independent comparison. We do not read your provider accounts or receive payment for the ranking.</p>
          <nav className="flex flex-wrap gap-4" aria-label="Tools">
            <Link href="/ai-usage-calculator" className="font-medium text-zinc-700 underline underline-offset-4">AI usage calculator</Link>
            <Link href="/chatgpt-limit-calculator" className="font-medium text-zinc-700 underline underline-offset-4">ChatGPT message limits</Link>
            <Link href="/codex-usage-calculator" className="font-medium text-zinc-700 underline underline-offset-4">Codex reset planner</Link>
            <Link href="/claude-usage-calculator" className="font-medium text-zinc-700 underline underline-offset-4">Claude Code session and weekly limits</Link>
            <Link href="/github-copilot-usage-calculator" className="font-medium text-zinc-700 underline underline-offset-4">Copilot credits</Link>
            <Link href="/cursor-usage-calculator" className="font-medium text-zinc-700 underline underline-offset-4">Cursor usage pools</Link>
            <Link href="/gemini-usage-calculator" className="font-medium text-zinc-700 underline underline-offset-4">Gemini usage resets</Link>
            <Link href="/perplexity-usage-calculator" className="font-medium text-zinc-700 underline underline-offset-4">Perplexity Pro Search and Research</Link>
            <Link href="/windsurf-devin-usage-calculator" className="font-medium text-zinc-700 underline underline-offset-4">Windsurf and Devin quotas</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
