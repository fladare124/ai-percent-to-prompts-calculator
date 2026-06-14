import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Gemini Usage Calculator - Estimate Prompts Left",
  description:
    "Estimate remaining Gemini prompts or actions from a remaining percentage, plan, model and feature selection.",
  alternates: {
    canonical: "/gemini-usage-calculator",
  },
};

export default function GeminiUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Gemini Usage Calculator"
      intro="Estimate Gemini prompts or actions left using the remaining percentage shown by the platform, plus model, thinking level and feature choices."
      platformFocus="Gemini"
    />
  );
}
