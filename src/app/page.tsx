import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percentage Calculator: Prompts Left",
  description:
    "Estimate prompts, messages, searches or coding tasks left from your AI usage percentage. Choose a provider and reset window, or compare two recent readings for a pace-based estimate.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Percentage Calculator: Prompts Left",
    description:
      "Estimate remaining prompts, messages, searches or coding tasks from an AI usage percentage.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Percentage Calculator: Prompts Left",
    description:
      "Estimate remaining prompts, messages, searches or coding tasks from an AI usage percentage.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Percentage Calculator: Prompts Left"
      intro="Use the percentage remaining in an AI usage meter to estimate prompts, messages, searches or coding tasks left. Choose the provider and reset window, or compare two recent readings to estimate your personal usage pace."
      extraFaq={[
        {
          question: "How do I convert an AI usage percentage into prompts?",
          answer:
            "A percentage alone does not reveal a fixed prompt count because providers use different limits. Choose the matching platform, plan and reset window for a broad estimate, or compare two recent readings and the similar requests you completed to personalize it.",
        },
        {
          question: "What does 50% AI usage remaining mean?",
          answer:
            "It means the provider reports half of the allowance for that specific meter or reset window is left. It does not necessarily mean half of a known number of prompts unless the provider publishes a fixed count for your plan and feature.",
        },
        {
          question: "Can this show the exact number of ChatGPT or Claude messages left?",
          answer:
            "No. This site does not connect to your account, and usage can depend on the plan, model, task and active limit window. Use your provider's meter for the account's current reading; treat this result as a planning estimate.",
        },
        {
          question: "How does personal usage calibration work?",
          answer:
            "Enter an earlier remaining percentage and how many similar requests you completed since that reading. The calculator estimates your remaining requests from the percentage points used at your own recent pace.",
        },
      ]}
    />
  );
}
