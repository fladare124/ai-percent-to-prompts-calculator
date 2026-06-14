import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percent to Prompts Calculator - Estimate Remaining AI Usage",
  description:
    "Enter your remaining usage percentage and estimate remaining AI prompts, messages, tasks, searches or usage units across popular AI tools.",
};

export default function AiUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="AI Percent to Prompts Calculator"
      intro="Enter the percentage your AI tool shows as remaining. We estimate what that could mean in real prompts, messages or tasks."
    />
  );
}
