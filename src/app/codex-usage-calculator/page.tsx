import type { Metadata } from "next";
import CodexTaskEstimator from "@/components/CodexTaskEstimator";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Codex Usage Calculator: Tasks Left & Reset Pace",
  description:
    "Estimate how many similar Codex tasks your remaining usage could cover from your own task history, then check whether that pace could last until reset.",
  alternates: {
    canonical: "/codex-usage-calculator",
    languages: {
      en: "/codex-usage-calculator",
      "es-ES": "/es/calculadora-uso-codex",
    },
  },
};

export default function CodexUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Codex Usage Calculator: Tasks Left and Reset Pace"
      intro="Estimate how many similar coding tasks your remaining Codex balance could cover from your own recent usage, then check whether that pace could last until the reset shown in your account."
      calculator={
        <>
          <CodexTaskEstimator />
          <UsagePacePlanner
            platform="Codex"
            windowGuidance="Check Settings, your usage dashboard, or /status in an active Codex CLI session. If your account shows more than one allowance, calculate each one separately using its displayed reset time."
            sourceUrl="https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan"
            sourceLabel="Check current Codex usage and reset details"
          />
        </>
      }
      guide={{
        title: "How Codex task usage varies",
        summary:
          "A Codex usage percentage does not map to a universal number of coding tasks. This page estimates a personal count from similar tasks in your own history; model, execution environment, task complexity, context, reasoning, speed and tools can change the amount consumed.",
        points: [
          "Open Settings or your usage dashboard to check which allowance is active, its balance and any reset time. In an active Codex CLI session, run /status.",
          "On plans that use shared allowances or credits, Codex can share usage with ChatGPT Work, ChatGPT for Excel and Workspace Agents when those features are available. Regular ChatGPT messages use separate limits.",
          "Choose the task size and reasoning level that match your next job. A repository-wide change can use much more than a short code edit.",
          "Example: if five similar tasks use 15 percentage points and 65% remains, the personal estimate is about 22 similar tasks. Enter 65, 15 and 5 in the task calculator. A different mix of work can change the estimate.",
          "The reset planner forecasts your recent net meter change. Compare readings from the same allowance and active cycle; a reset or another change in the meter can skew that projection.",
        ],
        sources: [
          { label: "OpenAI guide to Codex usage", href: "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan" },
          { label: "OpenAI guide to usage credits", href: "https://help.openai.com/en/articles/12642688-using-credits-for-flexible-usage-in-chatgpt-freegopluspro-sora" },
          { label: "OpenAI API pricing", href: "https://developers.openai.com/api/docs/pricing" },
        ],
      }}
      extraFaq={[
        {
          question: "How many Codex tasks can I do with 65% remaining?",
          answer:
            "There is no universal conversion from 65% to a task count. Enter the percentage your own similar tasks used and how many tasks were in that sample to estimate a personal count.",
        },
        {
          question: "Where do I check my actual Codex usage?",
          answer:
            "Open Settings or your usage dashboard to see the allowance, balance and any reset time. In an active Codex CLI session, run /status. These account readings are more authoritative than this independent planner.",
        },
        {
          question: "Does Codex share usage limits with ChatGPT?",
          answer:
            "On plans with shared allowances or credits, Codex may share usage with ChatGPT Work, ChatGPT for Excel and Workspace Agents when those features are available. Regular ChatGPT messages use separate limits. Check your plan for the current setup.",
        },
      ]}
    />
  );
}
