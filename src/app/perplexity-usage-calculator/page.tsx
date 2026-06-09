import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Perplexity Usage Calculator - Estimate Searches Left",
  description:
    "Estimate remaining Perplexity searches or research tasks from a remaining percentage, plan, mode and research depth.",
};

export default function PerplexityUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Perplexity Usage Calculator"
      intro="Estimate Perplexity searches or research tasks left from the remaining percentage you see, with adjustments for search mode, API model and research depth."
      platformFocus="Perplexity"
    />
  );
}
