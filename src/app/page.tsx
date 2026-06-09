import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Usage Calculator - Claude Fable 5, ChatGPT, Codex & Gemini",
  description:
    "Estimate how many Claude Fable 5 messages or AI prompts, tasks and usage units you may have left from your remaining percentage.",
  openGraph: {
    title: "AI Usage Calculator",
    description:
      "Estimate usage left for Claude Fable 5, Codex, ChatGPT, Gemini and more.",
  },
  twitter: {
    card: "summary",
    title: "AI Usage Calculator",
    description:
      "Estimate usage left for Claude Fable 5, Codex, ChatGPT, Gemini and more.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Usage Calculator"
      intro="Estimate how many prompts, messages or tasks you may have left across Claude Fable 5, Codex, ChatGPT, Gemini and more."
    />
  );
}
