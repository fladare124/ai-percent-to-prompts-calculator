import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Claude Usage Limit Calculator: Pace Until Reset",
  description:
    "Estimate whether your Claude usage can last until reset from your own usage meter readings. Includes current guidance for weekly limits and Fable credits.",
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
          windowGuidance="Claude can show a five-hour session allowance and a separate weekly allowance. Calculate each one separately using the reset details in Settings → Usage."
          sourceUrl="https://support.claude.com/en/articles/9797557-usage-limit-best-practices"
          sourceLabel="Check your current Claude usage and reset times"
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
          question: "Are Claude and Claude Code limits shared?",
          answer:
            "Interactive usage on Claude and Claude Code can draw from the same Pro or Max limits. The Claude Agent SDK and claude -p use separate monthly credits; check the current account usage page for your setup.",
        },
      ]}
    />
  );
}
