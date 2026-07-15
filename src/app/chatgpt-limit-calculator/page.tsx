import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "ChatGPT Limit Calculator - Estimate Messages Left",
  description:
    "Estimate ChatGPT messages or Codex tasks left using current OpenAI plan windows, GPT-5.6 Sol and the shared agentic usage pool.",
  alternates: {
    canonical: "/chatgpt-limit-calculator",
  },
};

export default function ChatGptLimitCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="ChatGPT Limit Calculator"
      intro="Estimate ChatGPT messages or Codex tasks from one OpenAI setup. Choose ChatGPT chat, Codex or Work, then select GPT-5.6 Sol or another available model."
      platformFocus="Codex"
      productFocus="ChatGPT chat"
      extraFaq={[
        {
          question: "Is the ChatGPT Plus number guaranteed?",
          answer:
            "No. The Plus number is a normalized planning reference, and access can differ by model, feature, capacity and the window shown in your account.",
        },
        {
          question: "Does this support GPT-5.6?",
          answer:
            "Yes. GPT-5.6 Sol is shown for eligible ChatGPT plans, while Terra and Luna appear when Codex or Work is selected. Availability is still rolling out and limits can differ by product.",
        },
      ]}
    />
  );
}
