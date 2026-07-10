import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "ChatGPT Limit Calculator - Estimate Messages Left",
  description:
    "Estimate ChatGPT messages left using current plan windows, GPT-5.5 modes and GPT-5.6 preview model references.",
  alternates: {
    canonical: "/chatgpt-limit-calculator",
  },
};

export default function ChatGptLimitCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="ChatGPT Limit Calculator"
      intro="Use the remaining percentage shown by ChatGPT to estimate messages left. The calculator uses current plan windows and adjusts for GPT-5.5, GPT-5.6 preview models, thinking and tools."
      platformFocus="ChatGPT"
      extraFaq={[
        {
          question: "Is the ChatGPT Plus number guaranteed?",
          answer:
            "No. The current Plus reference is 160 messages per 3 hours, but access can differ by model, feature and capacity and may change.",
        },
        {
          question: "Does this support GPT-5.6?",
          answer:
            "Yes, as a preview reference for Sol, Terra and Luna. GPT-5.6 availability is limited, so those estimates use lower reliability and should not be read as a general ChatGPT message cap.",
        },
      ]}
    />
  );
}
