import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Claude Usage Limit Calculator: Pace Until Reset",
  description:
    "Estimate Claude usage until your five-hour or weekly reset. Learn how Claude Code sharing, usage credits and optional free limit resets affect your plan.",
  alternates: {
    canonical: "/claude-usage-calculator",
  },
};

export default function ClaudeUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Claude Usage Limit Calculator"
      intro="Use your current Claude usage meter and recent pace to estimate whether your allowance could last until reset. The planner uses your own readings instead of assuming every model uses the same number of messages."
      calculator={
        <UsagePacePlanner
          platform="Claude"
          windowGuidance="Claude can show a five-hour session allowance and a separate weekly allowance. Calculate each one from Settings → Usage. If an optional ‘Reset for free’ offer appears there, follow the allowance and expiry shown in your account."
          sourceUrl="https://claude.ai/settings/usage"
          sourceLabel="Open Claude Settings → Usage"
        />
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
          "Use the five-hour progress bar and weekly progress bar as separate calculations. This planner does not read your account or estimate a universal number of messages.",
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
            "There is no single message count for every plan, model and task. Use the current five-hour or weekly meter in Settings → Usage, then compare recent readings from that same window with the planner above.",
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
