import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Claude Usage Calculator and Reset Planner",
  description:
    "Estimate Claude messages or Claude Code tasks and check whether your recent usage pace could last until the next reset.",
  alternates: {
    canonical: "/claude-usage-calculator",
  },
};

export default function ClaudeUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Claude Usage Calculator"
      intro="Estimate Claude messages or Claude Code tasks from your own usage readings, then check whether your recent pace could last until the next reset."
      platformFocus="Claude"
      extraTool={
        <UsagePacePlanner
          platform="Claude"
          windowGuidance="Claude may show a five-hour session window and a separate weekly limit, depending on your plan. Run a separate calculation for each window using its reset time in Settings → Usage."
          sourceUrl="https://support.claude.com/en/articles/9797557-usage-limit-best-practices"
          sourceLabel="Check your Claude usage windows in Settings → Usage"
        />
      }
      guide={{
        title: "Estimate Claude and Claude Code usage",
        summary:
          "There is no fixed message count that applies to every Claude plan and task. Allowance depends on your plan, model, conversation length, files and features used.",
        points: [
          "Anthropic says usage can change with message length, conversation context, file attachments, tools and model choice.",
          "Paid plans can have both a five-hour session limit and a weekly limit. Check Settings → Usage for the exact amount and reset time shown for your account.",
          "Claude and Claude Code share subscription usage on supported Pro and Max sign-ins. Claude subscription usage and API billing are separate.",
          "Take readings from the same window and compare similar work for a personal estimate. This calculator does not read your account balance.",
        ],
        sources: [
          { label: "Claude usage and length limits", href: "https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work" },
          { label: "Claude usage limit best practices", href: "https://support.claude.com/en/articles/9797557-usage-limit-best-practices" },
          { label: "Claude Code with Pro or Max", href: "https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan" },
          { label: "Anthropic API pricing", href: "https://platform.claude.com/docs/en/about-claude/pricing" },
        ],
      }}
      extraFaq={[
        {
          question: "Are Claude and Claude Code limits shared?",
          answer:
            "Yes, on supported Pro and Max subscription sign-ins. Claude activity across the web, desktop and Claude Code counts toward the same usage limits. Check Settings → Usage for the limits on your plan.",
        },
        {
          question: "How many Claude messages can I send before reset?",
          answer:
            "There is no single message count that applies to every plan or task. Model choice, conversation length, files and tools can change usage. Enter your own readings above for a planning estimate.",
        },
        {
          question: "Why can two Claude messages use different amounts?",
          answer:
            "Model choice, conversation length, attached files and tools can affect how quickly you reach a limit. A personal sample from similar tasks is usually more relevant than a generic average.",
        },
      ]}
    />
  );
}
