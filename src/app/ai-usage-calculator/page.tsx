import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Usage Calculator — Estimate Remaining Usage",
  description:
    "Estimate remaining prompts, messages, tasks, searches or AI usage units across popular AI tools.",
};

export default function AiUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="AI Usage Calculator"
      intro="Enter the percentage your AI tool shows as remaining. We estimate what that could mean in real prompts, messages or tasks."
    />
  );
}
