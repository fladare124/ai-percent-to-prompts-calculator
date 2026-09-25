import type { Metadata } from "next";
import ChatGPTUsageLimitCalculator from "@/components/ChatGPTUsageLimitCalculator";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";
import { chatGPTUsageSource } from "@/lib/chatgptUsageRanges";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "ChatGPT Limit Calculator: Messages Left in 5 Hours",
  description:
    "Estimate ChatGPT Work and Codex local messages left from your plan, model and remaining usage percentage using OpenAI’s published five-hour ranges.",
  alternates: {
    canonical: "/chatgpt-limit-calculator",
  },
};

export default function ChatGptLimitCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="ChatGPT Limit Calculator: Messages Left"
      intro="Estimate a remaining message range for ChatGPT Work and Codex in a five-hour window. Choose your plan and model, then enter the remaining percentage shown in your usage dashboard."
      calculator={<ChatGPTUsageLimitCalculator />}
      guide={{
        title: "How ChatGPT Work and Codex usage limits work",
        summary:
          "OpenAI publishes estimated local messages per five-hour period for ChatGPT Work and Codex. The ranges vary by plan and model; they are not fixed message limits or a live reading from your account.",
        points: [
          "ChatGPT Work and Codex share usage, pricing and limits. The table on this page is specifically for local messages in a five-hour period.",
          "The published ranges are not guaranteed caps. Model choice, context, reasoning, tool use, retrieval and caching can change how much allowance similar tasks consume.",
          "OpenAI says cloud chats on ChatGPT plans use GPT-5.6 Sol and may use more of the allowance than local messages, so this local-message estimate may not match cloud usage.",
          "A weekly limit may also apply. Use your ChatGPT usage dashboard for your current allowance and reset time; this calculator cannot access your account.",
          "GPT-5.5 is listed in the current range table, with retirement from ChatGPT, Work and Codex scheduled for October 14, 2026. Check the official page for model changes.",
        ],
        sources: [
          {
            label: "OpenAI: ChatGPT Work and Codex pricing and usage ranges",
            href: chatGPTUsageSource,
          },
        ],
      }}
      extraFaq={[
        {
          question: "Are ChatGPT Work and Codex message limits fixed?",
          answer:
            "No. OpenAI publishes estimated ranges for local messages per five-hour period. Actual usage depends on the model, context, reasoning and tools, and a weekly limit may also apply. Check your usage dashboard for your current allowance and reset time.",
        },
        {
          question: "How does the ChatGPT usage calculator work?",
          answer:
            "It multiplies OpenAI’s low and high local-message estimates for the selected plan and model by the remaining percentage you enter. Usage is not always linear by message, so treat the output as a planning range rather than an exact count.",
        },
        {
          question: "Does this estimate include cloud chats or API usage?",
          answer:
            "The table covers OpenAI’s published local-message ranges for ChatGPT Work and Codex. OpenAI says cloud chats on ChatGPT plans use GPT-5.6 Sol and may use more allowance. API-key usage is usage-based and is not covered here.",
        },
        {
          question: "Does this calculator read my ChatGPT account?",
          answer:
            "No. Enter the remaining percentage shown in your usage dashboard. Your account remains the source for current usage, workspace settings and reset time.",
        },
      ]}
    />
  );
}
