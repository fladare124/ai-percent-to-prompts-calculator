import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Percent to Prompts Calculator - Estimate AI Prompts Left",
  description:
    "Convert your remaining AI usage percentage into estimated prompts, messages or tasks left across Codex, ChatGPT, Claude, Gemini and more.",
  openGraph: {
    title: "Percent to Prompts Calculator",
    description:
      "Estimate how many AI prompts, messages or tasks you may have left from your remaining usage percentage.",
  },
  twitter: {
    card: "summary",
    title: "Percent to Prompts Calculator",
    description:
      "Estimate how many AI prompts, messages or tasks you may have left from your remaining usage percentage.",
  },
};

export default function PercentToPromptsCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Percent to Prompts Calculator"
      intro="Enter your remaining usage percentage and estimate how many AI prompts, messages or tasks you may have left across Codex, ChatGPT, Claude, Gemini and more."
    />
  );
}
