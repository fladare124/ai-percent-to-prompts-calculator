import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "GitHub Copilot Usage Calculator: AI Credit Pace",
  description:
    "Forecast when your GitHub Copilot AI credits may run out using your current balance, recent usage and monthly reset.",
  alternates: {
    canonical: "/github-copilot-usage-calculator",
  },
};

const monthlyCredits = [
  { plan: "Copilot Pro", credits: "1,500" },
  { plan: "Copilot Pro+", credits: "7,000" },
  { plan: "Copilot Max", credits: "20,000" },
  { plan: "Copilot Business", credits: "1,900 per licensed user" },
  { plan: "Copilot Enterprise", credits: "3,900 per licensed user" },
  {
    plan: "Copilot Free and Student",
    credits: "Allowance shown in your account",
  },
];

export default function GitHubCopilotUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="GitHub Copilot AI Credits Calculator"
      intro="Compare your GitHub Copilot AI credit balance with your recent usage to forecast whether it may last until reset. Credit use changes with the model and tokens consumed, so this planner estimates your pace instead of converting credits into a fixed number of prompts."
      calculator={
        <>
          <UsagePacePlanner
            platform="GitHub Copilot"
            windowGuidance="Included credits reset at 00:00 UTC on the first day of each calendar month. If you track a company-set budget or additional usage, use the reset for that specific meter."
            sourceUrl="https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage"
            sourceLabel="GitHub guide to monitoring AI credit usage"
            measurementUnit="AI credits"
          />

          <section className="mt-8 rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
              Monthly GitHub Copilot AI credits by plan
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Paid individual plan totals include both base credits and the flex
              allotment. Free and Student allowances vary by account. Check your
              GitHub usage view for the balance that applies to you.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Plan
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Included monthly AI credits
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyCredits.map((item) => (
                    <tr
                      key={item.plan}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <th scope="row" className="px-3 py-2 font-medium">
                        {item.plan}
                      </th>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {item.credits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Business and Enterprise credits are contributed to a shared
              billing-entity pool. Per-user figures are not individual hard
              limits.
            </p>
          </section>
        </>
      }
      guide={{
        title: "How to estimate your GitHub Copilot credit usage",
        summary:
          "GitHub AI Credits measure model usage from the tokens consumed. This calculator applies your recent observed credit spend to the time left in the current usage window.",
        points: [
          "For an individual plan, open GitHub Billing and licensing, then AI usage, or check Usage in Copilot settings. If you only see included credits used, subtract that from your plan allowance above to get the remaining included credits; keep additional usage separate.",
          "Enter your current balance, hours until its reset, credits spent since an earlier reading, and the time between readings. Compare readings from the same cycle and the same account or pool.",
          "A longer conversation, a complex agent task, more context, or a higher-cost model can consume more credits. The forecast assumes the recent pace continues, so treat it as a guide rather than a guarantee.",
          "Copilot Business and Enterprise contributions are pooled at the billing entity level. If your organization sets a personal budget, use that budget and its current-cycle usage. Otherwise, ask an administrator for the current shared-pool balance and usage.",
          "Code completions and next edit suggestions do not consume AI credits. Copilot Free and Student have an allowance, but GitHub does not publish one fixed total for those plans in its plan table.",
          "Some annual Pro or Pro+ subscribers may still use legacy premium request billing. If your account shows premium requests instead of AI credits, this AI credit planner does not apply to that meter.",
        ],
        sources: [
          {
            label: "GitHub Copilot plans and credit allowances",
            href: "https://docs.github.com/en/copilot/get-started/plans",
          },
          {
            label: "GitHub guide to monitoring AI credit usage",
            href: "https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage",
          },
          {
            label: "GitHub AI credit billing for individuals",
            href: "https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing",
          },
          {
            label: "GitHub AI credit billing for organizations",
            href: "https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing",
          },
          {
            label: "GitHub legacy premium request billing guidance",
            href: "https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/monitor-premium-requests",
          },
        ],
      }}
      extraFaq={[
        {
          question: "How many GitHub Copilot prompts are left in my AI credits?",
          answer:
            "There is no fixed prompt-to-credit conversion. A short question on a lightweight model can cost a fraction of a credit, while a long agent session with a more expensive model can use much more. This calculator forecasts credits at your recent pace, not a prompt count.",
        },
        {
          question: "When do GitHub Copilot included AI credits reset?",
          answer:
            "Included monthly credits reset at 00:00 UTC on the first day of each calendar month. This is separate from your subscription billing date.",
        },
        {
          question: "Where can I check my GitHub Copilot AI credit balance?",
          answer:
            "Individual users can open GitHub Billing and licensing and select AI usage, or review Usage in Copilot settings. Business and Enterprise users can check Copilot settings; administrators can review the organization or enterprise AI usage view.",
        },
        {
          question: "Are Copilot Business and Enterprise credits personal limits?",
          answer:
            "No. Each licensed seat contributes credits to a shared billing-entity pool. An administrator may also set a separate user-level budget. Use the balance or budget that applies to your account when entering readings.",
        },
        {
          question: "Does this calculator count code completions?",
          answer:
            "No. GitHub says code completions and next edit suggestions are not billed in AI credits. The planner is for the AI credit meter used by features such as Copilot Chat, CLI and agents.",
        },
        {
          question: "Can I use this for Copilot premium requests?",
          answer:
            "Only if your account uses AI credits. Some eligible annual Pro or Pro+ accounts may remain on legacy premium request billing; use a matching request meter for those accounts instead of entering requests as AI credits.",
        },
      ]}
    />
  );
}
