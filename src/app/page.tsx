import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percent to Prompts Calculator - ChatGPT, Codex, Claude Max & Gemini Ultra",
  description:
    "Estimate remaining ChatGPT messages, Codex tasks, Claude Max messages and Gemini Ultra prompts from the percentage your AI tool shows.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate ChatGPT messages, Codex tasks, Claude Max messages or Gemini Ultra prompts from the remaining percentage shown by your tool.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate ChatGPT messages, Codex tasks, Claude Max messages or Gemini Ultra prompts from the remaining percentage shown by your tool.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Percent to Prompts Calculator"
      intro="Enter the remaining percentage you see, then estimate ChatGPT messages, Codex tasks or prompts left across GPT-5.6 Sol, Claude Fable 5, Gemini Ultra and more."
    />
  );
}
