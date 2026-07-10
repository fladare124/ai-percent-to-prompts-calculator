import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Gemini Usage Calculator - Estimate Prompts Left",
  description:
    "Estimate Gemini prompts left using compute-based plan ratios, Gemini 3 app models and current Gemini 3.5 or 3.1 API prices.",
  alternates: {
    canonical: "/gemini-usage-calculator",
  },
};

export default function GeminiUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Gemini Usage Calculator"
      intro="Estimate Gemini prompts or actions left using Google's compute-based plan ratios, Gemini 3 app models and current Gemini 3.5 or 3.1 API references."
      platformFocus="Gemini"
      extraFaq={[
        {
          question: "Why are Gemini results shown as a range?",
          answer:
            "Gemini app limits are compute-based. Model, context, thinking level, feature and prompt complexity can make two prompts consume different amounts.",
        },
      ]}
    />
  );
}
