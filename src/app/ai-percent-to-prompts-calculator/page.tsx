import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percent to Prompts Calculator - Estimate AI Prompts Left",
  description:
    "Convert your remaining AI usage percentage into estimated prompts, messages or tasks left across Codex, ChatGPT, Claude, Gemini and more.",
  alternates: {
    canonical: "/ai-percent-to-prompts-calculator",
  },
  openGraph: {
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate how many AI prompts, messages or tasks you may have left from your remaining usage percentage.",
    url: "/ai-percent-to-prompts-calculator",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate how many AI prompts, messages or tasks you may have left from your remaining usage percentage.",
  },
};

export default function AiPercentToPromptsCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="AI Percent to Prompts Calculator"
      intro="Enter your remaining AI usage percentage and estimate how many prompts, messages or tasks you may have left across Codex, ChatGPT, Claude, Gemini and more."
    />
  );
}
