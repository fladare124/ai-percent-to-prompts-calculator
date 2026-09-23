import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Gemini Usage Calculator",
  description:
    "Estimate how many Gemini prompts your remaining usage percentage could cover across a five-hour or weekly window.",
  alternates: {
    canonical: "/gemini-usage-calculator",
  },
};

export default function GeminiUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Gemini Usage Calculator"
      intro="Estimate how many Gemini prompts your remaining percentage could cover. Choose your Google AI plan and usage window, then account for the model and features you use."
      platformFocus="Gemini"
      guide={{
        title: "How Gemini usage limits work",
        summary:
          "Gemini Apps use compute-based limits rather than a single fixed prompt count. Google says model, prompt complexity, features and chat length can affect how much of the limit a request uses.",
        points: [
          "The app may use both shorter refresh windows and a weekly limit. Match the window shown in your account before estimating.",
          "Check Gemini Settings → Usage limits for your actual usage and when it refreshes.",
          "The calculator's prompt count is a planning estimate. Large context, Deep Research and other compute-heavy features can make real usage differ.",
        ],
        sources: [
          { label: "Google Gemini Apps limits and upgrades", href: "https://support.google.com/gemini/answer/16275805?hl=en" },
          { label: "Google Gemini API pricing", href: "https://ai.google.dev/gemini-api/docs/pricing" },
        ],
      }}
      extraFaq={[
        {
          question: "Why are Gemini results shown as a range?",
          answer:
            "Gemini limits are compute-based. Model, prompt complexity, chat length and features can make two prompts use different amounts of the allowance.",
        },
        {
          question: "Where can I see my Gemini usage?",
          answer:
            "In Gemini Apps, open Settings and choose Usage limits. That meter and its refresh time are the source of truth for your Google account.",
        },
      ]}
    />
  );
}
