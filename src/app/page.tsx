import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Usage Calculator - Codex, ChatGPT, Claude & Gemini",
  description:
    "Estimate how many Codex tasks or AI prompts, messages and usage units you may have left from your remaining percentage.",
  openGraph: {
    title: "AI Usage Calculator",
    description:
      "Estimate usage left for Codex, ChatGPT, Claude, Gemini and more.",
  },
  twitter: {
    card: "summary",
    title: "AI Usage Calculator",
    description:
      "Estimate usage left for Codex, ChatGPT, Claude, Gemini and more.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Usage Calculator"
      intro="Estimate how many prompts, messages or tasks you may have left across Codex, ChatGPT, Claude, Gemini and more."
    />
  );
}
