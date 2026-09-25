import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percentage Calculator: Estimate Prompts Left",
  description:
    "Convert an AI usage percentage into estimated prompts, messages, searches or coding tasks. Choose a provider and reset window, or calibrate the estimate with your recent usage.",
  alternates: {
    canonical: "/ai-usage-calculator",
  },
  openGraph: {
    title: "AI Percentage Calculator: Estimate Prompts Left",
    description:
      "Convert an AI usage percentage into estimated prompts, messages or coding tasks left.",
    url: "/ai-usage-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Percentage Calculator: Estimate Prompts Left",
    description:
      "Convert your remaining AI usage percentage into estimated prompts, messages or coding tasks.",
    images: ["/opengraph-image"],
  },
};

export default function AiUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="AI Percent to Prompts Calculator"
      intro="Turn the remaining percentage on an AI usage meter into an approximate count of prompts, messages, searches or coding tasks. Choose the provider and usage window, or calibrate the estimate with your own recent history."
      extraFaq={[
        {
          question: "How do I convert an AI usage percentage into prompts?",
          answer:
            "For a fixed reference allowance, estimate units left as reference count × remaining percentage ÷ 100. For example, 30% of a 40-request allowance is about 12 requests. Most AI providers use dynamic limits rather than one fixed prompt count, so choose the matching platform, plan and reset window, or compare two readings from your own recent use to calibrate the estimate.",
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
            "Compare readings from the same provider, model and reset window. For example, if the meter drops from 80% to 70% after 5 similar requests, you used about 2 percentage points per request; at 70% remaining, that pace suggests roughly 35 similar requests left. This is only a planning estimate because later requests may use more or less allowance.",
        },
      ]}
    />
  );
}
