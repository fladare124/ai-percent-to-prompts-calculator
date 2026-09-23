import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percentage Calculator: Estimate Prompts Left",
  description:
    "Estimate prompts, messages or coding tasks from the percentage in your AI usage meter. Choose a provider preset or compare recent readings to estimate your own pace. Free, with no account connection.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Percentage Calculator: Estimate Prompts Left",
    description:
      "Estimate prompts, messages or coding tasks from the percentage in an AI usage meter.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Percentage Calculator: Estimate Prompts Left",
    description:
      "Estimate remaining prompts, messages, searches or coding tasks from an AI usage percentage.",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Percentage Calculator: Estimate Prompts Left"
      intro="Enter the remaining percentage shown by your AI provider to estimate prompts, messages, searches or coding tasks left. Choose the provider and reset window, or compare two readings to estimate your personal usage pace."
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
