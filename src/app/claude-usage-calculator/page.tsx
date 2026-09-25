import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Claude Code Usage Limit Calculator: 5-Hour & Weekly",
  description:
    "Check whether your Claude Code session or weekly allowance could last until reset. Compare both usage bars with your recent pace; no fixed prompt counts assumed.",
  alternates: {
    canonical: "/claude-usage-calculator",
  },
};

export default function ClaudeUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Claude Code Usage Limit Calculator: 5-Hour & Weekly Pace"
      intro="Claude Code shares usage with Claude, and two limits can matter at once. Compare your five-hour session and weekly balances with your recent pace to see whether either could run out before reset."
      calculator={
        <div className="space-y-8">
          <UsagePacePlanner
            platform="Claude 5-hour session"
            windowGuidance="Use the five-hour session balance and reset shown in Claude Settings → Usage. Compare readings from this session window only."
            sourceUrl="https://claude.ai/settings/usage"
            sourceLabel="Open Claude Settings → Usage"
          />
          <UsagePacePlanner
            platform="Claude weekly limit"
            windowGuidance="Use the separate weekly balance and account-assigned reset time in Claude Settings → Usage. This weekly allowance can run out even when the five-hour window has reset."
            sourceUrl="https://claude.ai/settings/usage"
            sourceLabel="Open Claude Settings → Usage"
          />
        </div>
      }
      guide={{
        title: "How Claude usage limits work",
        summary:
          "Claude does not have one fixed message count for every user. Your allowance depends on your plan, model, message and conversation length, files, tools and effort level. Compare readings from the same usage window to make a personal pace estimate.",
        points: [
          "Pro and Max plans have five-hour session limits and weekly limits across models. Your assigned weekly reset time appears in Settings → Usage.",
          "Claude web, desktop and interactive Claude Code usage can count toward the same plan limits. The Claude Agent SDK and claude -p have separate usage-credit rules.",
          "Fable 5 and Fable 5.1 are included in the plan limit for Max and eligible premium organization seats, where they can use up to 50% of weekly plan usage. On Pro and standard organization seats, Fable uses pay-as-you-go usage credits rather than the included plan allowance.",
          "Some eligible accounts may show an optional ‘Reset for free’ offer in Settings → Usage. It can refill the five-hour or weekly allowance shown in the offer, may expire, and cannot be undone after use.",
          "Use the separate five-hour and weekly planners below. Whichever balance runs out first can interrupt work; each estimate uses your own readings and does not assume a universal number of messages.",
        ],
        sources: [
          {
            label: "Claude usage and length limits",
            href: "https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work",
          },
          {
            label: "Claude usage limit best practices",
            href: "https://support.claude.com/en/articles/9797557-usage-limit-best-practices",
          },
          {
            label: "What is a Claude limit reset?",
            href: "https://support.claude.com/en/articles/17007452-what-is-a-limit-reset",
          },
          {
            label: "Claude Fable models by plan",
            href: "https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan",
          },
          {
            label: "Claude Code with Pro or Max",
            href: "https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan",
          },
        ],
      }}
      extraFaq={[
        {
          question: "How many Claude messages can I send before reset?",
          answer:
            "There is no single message count for every plan, model and task. Use the five-hour or weekly meter in Settings → Usage and compare recent readings with the matching planner above.",
        },
        {
          question: "Does Claude Fable 5 or Fable 5.1 use my regular plan limit?",
          answer:
            "It depends on your plan. On Max and eligible premium organization seats, Fable use draws from the weekly plan limit and can use up to 50% of it. On Pro and standard organization seats, Fable uses pay-as-you-go usage credits instead of the included plan allowance.",
        },
        {
          question: "Can I reset my Claude usage limit early for free?",
          answer:
            "Some eligible accounts may receive a ‘Reset for free’ offer in Settings → Usage. The offer states whether it refills the five-hour session limit or weekly limit and when it expires. You can use it before reaching the limit, but it cannot be undone; the reset also applies across Claude surfaces that share your account usage.",
        },
        {
          question: "Are Claude and Claude Code limits shared?",
          answer:
            "Interactive usage on Claude and Claude Code can draw from the same Pro or Max limits. The Claude Agent SDK and claude -p use separate monthly credits; check the current account usage page for your setup.",
        },
      ]}
    />
  );
}
