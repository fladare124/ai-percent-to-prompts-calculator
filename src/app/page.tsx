import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percent to Prompts Calculator - GPT-5.6, Claude & Gemini",
  description:
    "Convert a remaining AI usage percentage into estimated ChatGPT messages, Codex tasks or prompts for GPT-5.6 Sol, Claude Fable 5, Gemini and more.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate ChatGPT messages, Codex tasks or prompts left for GPT-5.6 Sol, Claude Fable 5, Gemini and more.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate ChatGPT messages, Codex tasks or prompts left for GPT-5.6 Sol, Claude Fable 5, Gemini and more.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Percent to Prompts Calculator"
      intro="Enter the remaining percentage you see, then estimate ChatGPT messages, Codex tasks or prompts left across GPT-5.6 Sol, Claude Fable 5, Gemini and more."
    />
  );
}
