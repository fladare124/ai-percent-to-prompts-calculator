import type { Metadata } from "next";
import CodexPacePlanner from "@/components/CodexPacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Codex Usage Calculator and Reset Planner",
  description:
    "Estimate remaining Codex tasks and check whether your recent usage pace may last until the next reset.",
  alternates: {
    canonical: "/codex-usage-calculator",
  },
};

export default function CodexUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Codex Usage Calculator"
      intro="Turn the remaining percentage in your Codex usage meter into a planning range for coding tasks. Choose your plan and reset window, then adjust for model, reasoning and task size."
      platformFocus="Codex"
      productFocus="Codex"
      extraTool={<CodexPacePlanner />}
      guide={{
        title: "How Codex task usage varies",
        summary:
          "A Codex usage percentage is not a fixed number of coding tasks. The amount consumed depends on the model, reasoning, task complexity, repository context and tools used.",
        points: [
          "Check Settings → Usage in ChatGPT or your usage dashboard for the allowance and reset time on your account. In an active Codex CLI session, /status shows usage information.",
          "On supported ChatGPT plans, Codex and ChatGPT Work can draw from a shared agentic allowance. ChatGPT chat messages use a different kind of limit.",
          "Choose the task size and reasoning level that match your next job. A repository-wide change can use much more than a short code edit.",
        ],
        sources: [
          { label: "OpenAI guide to Codex usage", href: "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan" },
          { label: "OpenAI guide to usage credits", href: "https://help.openai.com/en/articles/12642688-using-credits-for-flexible-usage-in-chatgpt-freegopluspro-sora" },
          { label: "OpenAI API pricing", href: "https://developers.openai.com/api/docs/pricing" },
        ],
      }}
      extraFaq={[
        {
          question: "Why can Codex estimates vary?",
          answer:
            "A short change and a long-running task can use different amounts of the shared allowance. Model, reasoning, repository size, tools and where the task runs also affect usage.",
        },
        {
          question: "Where do I check my actual Codex usage?",
          answer:
            "Use Settings → Usage in ChatGPT or the usage dashboard. In an active Codex CLI session, run /status. The values there, including any reset time, are more authoritative than this estimate.",
        },
      ]}
    />
  );
}
