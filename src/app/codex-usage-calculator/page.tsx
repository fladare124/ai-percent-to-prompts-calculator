import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Codex Usage Calculator: Limit and Reset Planner",
  description:
    "Compare your Codex usage meter with recent readings to estimate whether the 5-hour or weekly allowance can last until reset.",
  alternates: {
    canonical: "/codex-usage-calculator",
  },
};

export default function CodexUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Codex Usage Calculator"
      intro="Compare the remaining percentage in your Codex usage meter with your recent pace to see whether that allowance could last until reset. Codex use varies by model, task, context and tools, so the planner uses your own readings instead of assuming a fixed number of coding tasks."
      calculator={
        <UsagePacePlanner
          platform="Codex"
          windowGuidance="Codex may show a short-window and a weekly allowance. Track each window separately and use its own reset time. Check Settings or your usage dashboard; in an active Codex CLI session, run /status."
          sourceUrl="https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan"
          sourceLabel="Check current Codex usage and reset details"
        />
      }
      guide={{
        title: "How Codex task usage varies",
        summary:
          "A Codex usage percentage is not a fixed number of coding tasks. The amount consumed depends on the model, where the task runs, task complexity, context, reasoning, speed and tools used.",
        points: [
          "Open Settings or your usage dashboard to check which allowance is active, its balance and any reset time. In an active Codex CLI session, run /status.",
          "On plans that use shared allowances or credits, Codex can share usage with ChatGPT Work, ChatGPT for Excel and Workspace Agents when those features are available. Regular ChatGPT messages use separate limits.",
          "Choose the task size and reasoning level that match your next job. A repository-wide change can use much more than a short code edit.",
          "Example: if your Codex meter drops from 80% to 65% over four hours, the observed pace is 3.75 percentage points per hour. With 65% remaining and 10 hours until reset, the same pace projects about 27.5% remaining at reset. Enter 65, 10, 15 and 4 in the planner. This forecasts allowance pace, not a fixed number of coding tasks.",
          "This planner forecasts your recent pace in the usage window you select. It does not connect to your account or predict a fixed task count.",
        ],
        sources: [
          { label: "OpenAI guide to Codex usage", href: "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan" },
          { label: "OpenAI guide to usage credits", href: "https://help.openai.com/en/articles/12642688-using-credits-for-flexible-usage-in-chatgpt-freegopluspro-sora" },
          { label: "OpenAI API pricing", href: "https://developers.openai.com/api/docs/pricing" },
        ],
      }}
      extraFaq={[
        {
          question: "Can this calculator tell me exactly how many Codex tasks I have left?",
          answer:
            "No. Task usage varies with the model, where it runs, task complexity, context, reasoning, speed and tools. Compare your current meter with an earlier reading to estimate whether your recent pace may last until reset.",
        },
        {
          question: "Where do I check my actual Codex usage?",
          answer:
            "Open Settings or your usage dashboard to see the allowance, balance and any reset time. In an active Codex CLI session, run /status. These account readings are more authoritative than this independent planner.",
        },
        {
          question: "Does Codex share usage limits with ChatGPT?",
          answer:
            "On plans with shared allowances or credits, Codex may share usage with ChatGPT Work, ChatGPT for Excel and Workspace Agents when those features are available. Regular ChatGPT messages use separate limits.",
        },
      ]}
    />
  );
}
